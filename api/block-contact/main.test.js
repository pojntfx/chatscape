const AWS = require("aws-sdk");
const { handler } = require("./main.js");

jest.mock("aws-sdk", () => {
  const mockDynamoDB = {
    DocumentClient: jest.fn(() => ({
      query: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      promise: jest.fn(),
    })),
  };

  return {
    DynamoDB: mockDynamoDB,
  };
});

describe("Lambda Function Tests", () => {
  let mockEvent;

  const mockContext = {};

  beforeEach(() => {
    mockEvent = {
      httpMethod: "POST",
      body: JSON.stringify({
        namespace: "example",
        email: "test@example.com",
      }),
    };

    AWS.DynamoDB.DocumentClient.mockClear();
  });

  it("should handle valid request and block contact", async () => {
    AWS.DynamoDB.DocumentClient().promise.mockResolvedValue({
      Items: [
        {
          id: "contact-id",
          email: "test@example.com",
          namespace: "example",
          blocked: false,
        },
      ],
    });

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      id: "contact-id",
      email: "test@example.com",
      namespace: "example",
      blocked: true,
    });
  });

  it("should handle contact not found", async () => {
    AWS.DynamoDB.DocumentClient().promise.mockResolvedValue({
      Items: [
        {
          id: "other-contact-id",
          email: "other@example.com",
          namespace: "example",
        },
      ],
    });

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(404);
    expect(response.body).toContain("contact not found");
  });

  it("should handle DynamoDB update error", async () => {
    AWS.DynamoDB.DocumentClient().promise.mockRejectedValue(new Error("DynamoDB Error"));

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain("could not block contact");
  });

  it("should handle invalid request body", async () => {
    mockEvent.body = "invalid_json";

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(400);
    expect(response.body).toContain("invalid request body");
  });

  it("should handle unsupported HTTP method", async () => {
    mockEvent.httpMethod = "GET";

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(405);
    expect(response.body).toContain("method not allowed");
  });
});