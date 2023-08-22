const AWS = require("aws-sdk");

jest.mock("aws-sdk", () => {
  const mockDynamoDb = {
    query: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  const mockDocumentClient = {
    query: jest.fn(() => mockDynamoDb),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mockDocumentClient),
    },
  };
});

const { handler } = require("./main");

describe("Lambda Function Tests", () => {
  const mockEvent = {
    body: JSON.stringify({ namespace: "your-namespace" }),
    requestContext: {
      authorizer: {
        claims: {
          "cognito:username": "test",
        },
      },
    }
  };

  const mockContext = {};

  it("should return 500 if DynamoDB query fails", async () => {
    const mockDynamoDbError = new Error("DynamoDB Error");

    AWS.DynamoDB.DocumentClient().query().promise.mockRejectedValue(mockDynamoDbError);

    const result = await handler(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify("could not retrieve contacts"));
  });

  it("should return 200 with query results", async () => {
    const mockQueryResult = {
      Items: [{ id: "1", name: "Contact 1" }, { id: "2", name: "Contact 2" }],
    };

    AWS.DynamoDB.DocumentClient().query().promise.mockResolvedValue(mockQueryResult);

    const result = await handler(mockEvent, mockContext);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(mockQueryResult.Items));
  });
});