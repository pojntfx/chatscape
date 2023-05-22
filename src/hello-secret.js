SPA_URL = "https://d3bgrasa0w7u0x.cloudfront.net";

exports.handler = async () => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": SPA_URL,
  },
  body: JSON.stringify("Welcome to the secret Lambda!"),
});
