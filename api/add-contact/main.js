const vali = require("valibot");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SPA_URL = process.env.SPA_URL;
const CONTACTS_TABLE_NAME = process.env.CONTACTS_TABLE_NAME;

const BodySchema = vali.object(
  {
    namespace: vali.string("namespace not provided"),
    email: vali.string("email not provided", [vali.email("email not valid")]),
    name: vali.string("name not provided", [
      vali.toTrimmed(),
      vali.minLength(1, "name is empty"),
    ]),
  },
  "invalid request body"
);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("method not allowed"),
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
        error instanceof ValiError ? error.message : "invalid request body"
      ),
    };
  }

  const params = {
    TableName: CONTACTS_TABLE_NAME,
    Item: {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      namespace: body.namespace,
      blocked: false,
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
      body: JSON.stringify("could not create contact"),
    };
  }
};
