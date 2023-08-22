const vali = require("valibot");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SPA_URL = process.env.SPA_URL;
const MESSAGES_TABLE_NAME = process.env.MESSAGES_TABLE_NAME;

const BodySchema = vali.object(
  {
    recipientNamespace: vali.string("recipientNamespace not provided"),
    message: vali.string("message not provided", [
      vali.toTrimmed(),
      vali.minLength(1, "message is empty"),
    ]),
  },
  "invalid request body"
);

module.exports.handler = async (event) => {
  const senderNamespace =
    event.requestContext.authorizer.claims["cognito:username"];
  if (!senderNamespace) {
    return {
      statusCode: 403,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: "missing namespace",
    };
  }

  let body;
  try {
    body = vali.parse(BodySchema, JSON.parse(event.body));
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify(
        error instanceof vali.ValiError ? error.message : "invalid request body"
      ),
    };
  }

  if (!body.message) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("message not provided"),
    };
  }

  const compositeNamespace = `${senderNamespace}#${body.recipientNamespace}`;

  const params = {
    TableName: MESSAGES_TABLE_NAME,
    Item: {
      id: uuidv4(),
      senderNamespace,
      recipientNamespace: body.recipientNamespace,
      message: body.message,
      date: new Date().toISOString(),
      compositeNamespace,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("could not add message"),
    };
  }
};
