const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SPA_URL = process.env.SPA_URL;
const MESSAGES_TABLE_NAME = process.env.MESSAGES_TABLE_NAME;

export const handler = async (event) => {
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
    const compositeKey = `${senderNamespace}:::${recipientNamespace}`;
    const compositeKeyReverse = `${recipientNamespace}:::${senderNamespace}`;

    const paramsSender = {
      TableName: MESSAGES_TABLE_NAME,
      IndexName: "CompositeNamespaceDateIndex",
      KeyConditionExpression: "#compositeNamespace = :compositeValue",
      ExpressionAttributeValues: {
        ":compositeValue": compositeKey,
      },
      ExpressionAttributeNames: {
        "#compositeNamespace": "compositeNamespace",
      },
    };

    // Fetch messages where recipient is the current user and sender is the specified one
    const paramsRecipient = {
      TableName: MESSAGES_TABLE_NAME,
      IndexName: "CompositeNamespaceDateIndex",
      KeyConditionExpression: "#compositeNamespace = :compositeValueReverse",
      ExpressionAttributeValues: {
        ":compositeValueReverse": compositeKeyReverse,
      },
      ExpressionAttributeNames: {
        "#compositeNamespace": "compositeNamespace",
      },
    };

    const resultsSender = await dynamoDb.query(paramsSender).promise();
    const resultsRecipient = await dynamoDb.query(paramsRecipient).promise();

    return [...resultsSender.Items, ...resultsRecipient.Items];
  };

  try {
    const messagesBetween = await fetchMessagesBetween(
      senderNamespace,
      recipientNamespace
    );

    const formattedMessages = messagesBetween.map((item) => {
      const [itemSenderNamespace] = item.compositeNamespace.split(":::");
      return {
        ...item,
        them: itemSenderNamespace !== senderNamespace,
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify(formattedMessages),
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
