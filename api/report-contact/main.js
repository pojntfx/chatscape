const vali = require("valibot");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SPA_URL = process.env.SPA_URL;
const CONTACTS_TABLE_NAME = process.env.CONTACTS_TABLE_NAME;

const BodySchema = vali.object(
  {
    email: vali.string("email not provided", [vali.email("email not valid")]),
    report: vali.string("report not provided", [
      vali.toTrimmed(),
      vali.minLength(1, "report is empty"),
    ]),
  },
  "invalid request body"
);

export const handler = async (event) => {
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
      const contact = results.Items.find((item) => item.email === body.email);

      if (contact) {
        const updateParams = {
          TableName: CONTACTS_TABLE_NAME,
          Key: {
            id: contact.id,
          },
          UpdateExpression: "set report = :reportVal",
          ExpressionAttributeValues: {
            ":reportVal": body.report,
          },
        };

        await dynamoDb.update(updateParams).promise();

        contact.report = body.report;

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
