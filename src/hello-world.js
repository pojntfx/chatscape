exports.handler = async () => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "https://d2gv0zz05h5n2d.cloudfront.net",
  },
  body: JSON.stringify("Hello from Lambda!"),
});
