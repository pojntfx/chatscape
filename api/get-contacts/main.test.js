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
    httpMethod: "POST",
    body: JSON.stringify({ namespace: "your-namespace" }),
  };

  const mockContext = {};

  it("should return 405 if http method is not POST", async () => {
    const mockEvent = {
      httpMethod: "GET",
    };

    const result = await handler(mockEvent, mockContext);

    expect(result.statusCode).toBe(405);
    expect(result.body).toBe(JSON.stringify("method not allowed"));
  });

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