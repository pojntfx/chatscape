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
        namespace: "test",
        email: "test@example.com",
        name: "John Doe",
      }),
      requestContext: {
        authorizer: {
          claims: {
            "cognito:username": "test",
          },
        },
      },
    };
  });

  it("should handle valid request", async () => {
    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(200);
    expect(JSON.parse(rv.body)).toMatchObject({
      name: "John Doe",
      email: "test@example.com",
      namespace: "test",
      blocked: false,
    });
  });

  it("should handle invalid request body", async () => {
    mockEvent.body = "invalid_json";

    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(400);
    expect(rv.body).toContain("invalid request body");
  });

  it("should handle missing parameter", async () => {
    mockEvent.body = JSON.stringify({
      namespace: "test",
      email: "test@example.com",
    });

    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(400);
    expect(rv.body).toContain("name not provided");
  });

  it("should handle missing parameter", async () => {
    mockEvent.body = JSON.stringify({
      namespace: "test",
      name: "John Doe",
    });

    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(400);
    expect(rv.body).toContain("email not provided");
  });
});
