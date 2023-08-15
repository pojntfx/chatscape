const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const SPA_URL = process.env.SPA_URL;
const CONTACTS_TABLE_NAME = "Contacts";

function decrypt(text) {
  let content = Buffer.from(text, "base64");
  let iv = content.slice(0, IV_LENGTH);
  let tag = content.slice(IV_LENGTH, IV_LENGTH + 16);
  let encryptedText = content.slice(IV_LENGTH + 16);
  let decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encryptedText);
  let finalBuffer = Buffer.concat([decrypted, decipher.final()]);
  return finalBuffer.toString();
}

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

  let namespace;
  try {
    const decodedToken = jwt.decode(event.headers.Authorization);
    namespace = decodedToken.namespace;
    namespace = decrypt(namespace);
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("invalid or missing token"),
    };
  }

  const params = {
    TableName: CONTACTS_TABLE_NAME,
    IndexName: "NamespaceIndex",
    KeyConditionExpression: "namespace = :namespaceValue",
    ExpressionAttributeValues: {
      ":namespaceValue": namespace,
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
