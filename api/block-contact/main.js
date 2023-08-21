const vali = require("valibot");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SPA_URL = process.env.SPA_URL;
const CONTACTS_TABLE_NAME = process.env.CONTACTS_TABLE_NAME;

const BodySchema = vali.object(
  {
    id: vali.string("id not provided", [
      vali.toTrimmed(),
      vali.minLength(1, "id is empty"),
    ]),
  },
  "invalid request body"
);

module.exports.handler = async (event) => {
  const namespace = event.requestContext.authorizer.claims["cognito:username"];
  if (!namespace) {
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

  const queryParams = {
    TableName: CONTACTS_TABLE_NAME,
    IndexName: "NamespaceIndex",
    KeyConditionExpression: "namespace = :namespaceVal",
    ExpressionAttributeValues: {
      ":namespaceVal": namespace,
    },
  };

  try {
    const results = await dynamoDb.query(queryParams).promise();

    if (results.Items) {
      const contact = results.Items.find((item) => item.id === body.id);

      if (contact) {
        const updateParams = {
          TableName: CONTACTS_TABLE_NAME,
          Key: {
            id: contact.id,
          },
          UpdateExpression: "set blocked = :blockedVal",
          ExpressionAttributeValues: {
            ":blockedVal": true,
          },
        };

        await dynamoDb.update(updateParams).promise();

        contact.blocked = true;

        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": SPA_URL,
          },
          body: JSON.stringify(contact),
        };
      } else {
        return {
          statusCode: 404,
          headers: {
            "Access-Control-Allow-Origin": SPA_URL,
          },
          body: JSON.stringify("contact not found"),
        };
      }
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("could not block contact"),
    };
  }
};
