jest.mock("aws-sdk", () => {
  const mockDynamoDB = {
    DocumentClient: jest.fn(() => ({
      put: jest.fn().mockReturnThis(),
      promise: jest.fn(),
    })),
  };

  return {
    DynamoDB: mockDynamoDB,
  };
});

const { handler } = require("./main");

describe("Lambda Function Tests", () => {
  let mockEvent;

  const mockContext = {};

  beforeEach(() => {
    mockEvent = {
      body: JSON.stringify({
        senderNamespace: "test",
        recipientNamespace: "recipient-namespace",
        message: "Test message",
      }),
      requestContext: {
        authorizer: {
          claims: {
            "cognito:username": "test",
          },
        },
      }
    };
  });

  it("should handle valid request", async () => {
    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(200);
    expect(JSON.parse(rv.body)).toMatchObject({
      senderNamespace: "test",
      recipientNamespace: "recipient-namespace",
      message: "Test message",
    });
  });

  it("should handle missing message", async () => {
    mockEvent.body = JSON.stringify({
      senderNamespace: "test",
      recipientNamespace: "recipient-namespace",
      message: "",
    });

    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(400);
    expect(rv.body).toContain("message is empty");
  });

  it("should handle invalid request body", async () => {
    mockEvent.body = "invalid_json";

    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(400);
    expect(rv.body).toContain("invalid request body");
  });
});