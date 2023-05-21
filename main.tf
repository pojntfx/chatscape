provider "aws" {
    region  = "eu-north-1"
    profile = "ChatScapeAdministrator-856591169022"
}

# Hello World
resource "aws_lambda_function" "hello_world" {
  function_name    = "hello_world"
  runtime          = "nodejs18.x"

  filename         = "out/hello-world.zip"
  source_code_hash = filebase64sha256("out/hello-world.zip")
  handler          = "hello-world.handler"

  role             = aws_iam_role.lambda.arn
}

resource "aws_api_gateway_resource" "hello_world" {
  path_part   = "hello-world"

  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  parent_id   = aws_api_gateway_rest_api.chatscape.root_resource_id
}

resource "aws_api_gateway_method" "hello_world" {
  http_method   = "GET"
  authorization = "NONE"

  resource_id   = aws_api_gateway_resource.hello_world.id
  rest_api_id   = aws_api_gateway_rest_api.chatscape.id
}

resource "aws_api_gateway_integration" "hello_world" {
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.hello_world.invoke_arn
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_world.id
  http_method = aws_api_gateway_method.hello_world.http_method
}

resource "aws_lambda_permission" "hello_world" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = aws_lambda_function.hello_world.function_name
  source_arn    = "${aws_api_gateway_rest_api.chatscape.execution_arn}/*/*"
}

# Lambda
resource "aws_iam_role" "lambda" {
  name = "lambda"

   assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# API Gateway
resource "aws_api_gateway_rest_api" "chatscape" {
  name = "chatscape"
}

resource "aws_api_gateway_deployment" "chatscape" {
  stage_name  = "test"

  depends_on  = [aws_api_gateway_integration.hello_world]
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
}

# Outputs
output "api_endpoint" {
  value = aws_api_gateway_deployment.chatscape.invoke_url
}
