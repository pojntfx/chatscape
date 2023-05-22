const SPA_URL = process.env.SPA_URL;

exports.handler = async () => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": SPA_URL,
  },
  body: JSON.stringify("Hello from Lambda!"),
});
