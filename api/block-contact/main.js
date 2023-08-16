const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SPA_URL = process.env.SPA_URL;
const CONTACTS_TABLE_NAME = process.env.CONTACTS_TABLE_NAME;

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
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("invalid request body"),
    };
  }

  if (!body.namespace) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("namespace not provided"),
    };
  }

  if (!body.email) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("email not provided"),
    };
  }

  const queryParams = {
    TableName: CONTACTS_TABLE_NAME,
    IndexName: "namespace-index",
    KeyConditionExpression: "namespace = :namespaceVal",
    ExpressionAttributeValues: {
      ":namespaceVal": body.namespace,
    },
  };

  try {
    const results = await dynamoDb.query(queryParams).promise();

    if (results.Items) {
      const contact = results.Items.find((item) => item.email === body.email);

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
