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
      httpMethod: "POST",
      body: JSON.stringify({
        namespace: "example",
        email: "test@example.com",
        name: "John Doe",
      }),
    };
  });

  it("should handle valid request", async () => {
    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(200);
    expect(JSON.parse(rv.body)).toMatchObject({
      name: "John Doe",
      email: "test@example.com",
      namespace: "example",
      blocked: false,
    });
    expect(rv).toMatchSnapshot();
  });

  it("should handle invalid request body", async () => {
    mockEvent.body = "invalid_json";

    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(400);
    expect(rv.body).toContain("invalid request body");
    expect(rv).toMatchSnapshot();
  });

  it("should handle unsupported HTTP method", async () => {
    mockEvent.httpMethod = "GET";

    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(405);
    expect(rv.body).toContain("method not allowed");
    expect(rv).toMatchSnapshot();
  });

  it("should handle missing parameter", async () => {
    mockEvent.body = JSON.stringify({
      namespace: "example",
      email: "test@example.com",
    });

    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(400);
    expect(rv.body).toContain("name not provided");
    expect(rv).toMatchSnapshot();
  });

  it("should handle missing parameter", async () => {
    mockEvent.body = JSON.stringify({
      name: "John Doe",
      email: "test@example.com",
    });

    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(400);
    expect(rv.body).toContain("namespace not provided");
    expect(rv).toMatchSnapshot();
  });

  it("should handle missing parameter", async () => {
    mockEvent.body = JSON.stringify({
      namespace: "example",
      name: "John Doe",
    });

    const rv = await handler(mockEvent, mockContext);

    expect(rv.statusCode).toBe(400);
    expect(rv.body).toContain("email not provided");
    expect(rv).toMatchSnapshot();
  });
});