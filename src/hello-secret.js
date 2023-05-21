exports.handler = async () => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "https://d3bgrasa0w7u0x.cloudfront.net",
  },
  body: JSON.stringify("Welcome to the secret Lambda!"),
});
