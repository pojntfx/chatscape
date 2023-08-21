const mockQuery = jest.fn();

jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => ({
        query: mockQuery,
      })),
    },
  };
});

const { handler } = require("./main");

describe("Lambda Function Tests", () => {
  const mockEvent = {
    httpMethod: "POST",
    body: JSON.stringify({
      senderNamespace: "sender-namespace",
      recipientNamespace: "recipient-namespace",
    }),
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
});