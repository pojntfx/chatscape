const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;
const SPA_URL = process.env.SPA_URL;
const CONTACTS_TABLE_NAME = "Contacts";

function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  let finalBuffer = Buffer.concat([encrypted, cipher.final()]);
  let tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, finalBuffer]).toString("base64");
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

  let namespace;
  try {
    const decodedToken = jwt.decode(event.headers.Authorization);
    namespace = decodedToken.namespace;
    namespace = encrypt(namespace);
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("invalid or missing token"),
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

  if (!body.name) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": SPA_URL,
      },
      body: JSON.stringify("name not provided"),
    };
  }

  const params = {
    TableName: CONTACTS_TABLE_NAME,
    Item: {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      namespace: namespace,
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
