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
});
