const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SPA_URL = process.env.SPA_URL;
const MESSAGES_TABLE_NAME = process.env.MESSAGES_TABLE_NAME;

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

  const recipientNamespace = event.queryStringParameters?.recipientNamespace;
  if (!recipientNamespace) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("missing recipientNamespace"),
    };
  }

  const fetchMessagesBetween = async (senderNamespace, recipientNamespace) => {
    const compositeKey = `${senderNamespace}#${recipientNamespace}`;
    const compositeKeyReverse = `${recipientNamespace}#${senderNamespace}`;

    const params = {
      TableName: MESSAGES_TABLE_NAME,
      IndexName: "CompositeNamespaceDateIndex",
      KeyConditionExpression:
        "#compositeNamespace = :compositeValue OR #compositeNamespace = :compositeValueReverse",
      ExpressionAttributeValues: {
        ":compositeValue": compositeKey,
        ":compositeValueReverse": compositeKeyReverse,
      },
      ExpressionAttributeNames: {
        "#compositeNamespace": "compositeNamespace",
      },
    };

    const result = await dynamoDb.query(params).promise();
    return result.Items;
  };

  try {
    const messagesBetween = await fetchMessagesBetween(
      senderNamespace,
      recipientNamespace
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify(
        messagesBetween.map((item) => ({
          ...item,
          them: item.senderNamespace !== senderNamespace,
        }))
      ),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("could not retrieve messages"),
    };
  }
};
