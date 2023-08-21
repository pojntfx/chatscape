const mockQuery = jest.fn();
const mockUpdate = jest.fn();

jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => ({
        query: mockQuery,
        update: mockUpdate,
      })),
    },
  };
});

const { handler } = require("./main");

describe("Block contact lambda", () => {
  it("sets the blocked boolean after a user has been blocked", async () => {
    mockQuery.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({
        Items: [
          { email: "test@example.com", id: "1234" },
          { email: "another@example.com", id: "5678" },
        ],
      }),
    });

    mockUpdate.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce(),
    });

    const rv = await handler({
      httpMethod: "POST",
      body: JSON.stringify({
        namespace: "test",
        email: "test@example.com",
      }),
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      TableName: undefined,
      Key: {
        id: "1234",
      },
      UpdateExpression: "set blocked = :blockedVal",
      ExpressionAttributeValues: {
        ":blockedVal": true,
      },
    });

    expect(rv.statusCode).toBe(200);
    expect(rv).toMatchSnapshot();
  });

  it("should handle contact not found", async () => {
    mockQuery.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({
        Items: [
          { email: "test@example.com", id: "1234" },
          { email: "another@example.com", id: "5678" },
        ],
      }),
    });

    mockUpdate.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce(),
    });

    const rv = await handler({
      httpMethod: "POST",
      body: JSON.stringify({
        namespace: "test",
        email: "jakob@example.com",
      }),
    });

    expect(rv.statusCode).toBe(404);
    expect(rv.body).toContain("contact not found");
    expect(rv).toMatchSnapshot();
  });

  it("should handle invalid request body", async () => {
    const rv = await handler({
      httpMethod: "POST",
      body: "invalid JSON",
    });

    expect(rv.statusCode).toBe(400);
    expect(rv.body).toContain("invalid request body");
    expect(rv).toMatchSnapshot();
  });

  it("should handle unsupported HTTP method", async () => {
    const rv = await handler({
      httpMethod: "GET",
      body: JSON.stringify({
        namespace: "test",
        email: "test@example.com",
      }),
    });

    expect(rv.statusCode).toBe(405);
    expect(rv.body).toContain("method not allowed");
    expect(rv).toMatchSnapshot();
  });
});
