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

  const params = {
    TableName: CONTACTS_TABLE_NAME,
    IndexName: "NamespaceIndex",
    KeyConditionExpression: "#ns = :namespaceValue",
    ExpressionAttributeValues: {
      ":namespaceValue": body.namespace,
    },
    ExpressionAttributeNames: {
      "#ns": "namespace",
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("could not retrieve contacts"),
    };
  }
};
