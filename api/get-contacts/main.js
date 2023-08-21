const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SPA_URL = process.env.SPA_URL;
const CONTACTS_TABLE_NAME = process.env.CONTACTS_TABLE_NAME;

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

  const params = {
    TableName: CONTACTS_TABLE_NAME,
    IndexName: "NamespaceIndex",
    KeyConditionExpression: "#ns = :namespaceValue",
    ExpressionAttributeValues: {
      ":namespaceValue": namespace,
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
