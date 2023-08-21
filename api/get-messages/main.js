const vali = require("valibot");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SPA_URL = process.env.SPA_URL;
const MESSAGES_TABLE_NAME = process.env.MESSAGES_TABLE_NAME;

const BodySchema = vali.object(
  {
    recipientNamespace: vali.string("recipientNamespace not provided"),
  },
  "invalid request body"
);

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

  const fetchMessagesBetween = async (senderNamespace, recipientNamespace) => {
    const paramsForSenderToRecipient = {
      TableName: MESSAGES_TABLE_NAME,
      IndexName: "SenderRecipientNamespaceIndex",
      KeyConditionExpression:
        "#senderNamespace = :senderValue AND #recipientNamespace = :recipientValue",
      ExpressionAttributeValues: {
        ":senderValue": senderNamespace,
        ":recipientValue": recipientNamespace,
      },
      ExpressionAttributeNames: {
        "#senderNamespace": "senderNamespace",
        "#recipientNamespace": "recipientNamespace",
      },
    };

    const paramsForRecipientToSender = {
      TableName: MESSAGES_TABLE_NAME,
      IndexName: "SenderRecipientNamespaceIndex",
      KeyConditionExpression:
        "#senderNamespace = :recipientValue AND #recipientNamespace = :senderValue",
      ExpressionAttributeValues: {
        ":senderValue": senderNamespace,
        ":recipientValue": recipientNamespace,
      },
      ExpressionAttributeNames: {
        "#senderNamespace": "senderNamespace",
        "#recipientNamespace": "recipientNamespace",
      },
    };

    const [resultFromSender, resultFromRecipient] = await Promise.all([
      dynamoDb.query(paramsForSenderToRecipient).promise(),
      dynamoDb.query(paramsForRecipientToSender).promise(),
    ]);

    return [...resultFromSender.Items, ...resultFromRecipient.Items];
  };

  try {
    const messagesBetween = await fetchMessagesBetween(
      senderNamespace,
      body.recipientNamespace
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
