const SPA_URL = process.env.SPA_URL;
const TABLE_NAME = process.env.TABLE_NAME;
const REGION = process.env.REGION;

const AWS = require("aws-sdk");
AWS.config.update({ region: REGION });

const docClient = new AWS.DynamoDB.DocumentClient();

export const handler = async () => {
  const data = await docClient
    .get({
      TableName: TABLE_NAME,
      Key: {
        Id: "1",
      },
    })
    .promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": SPA_URL,
    },
    body: JSON.stringify(data),
  };
};
