locals {
  resource_name = replace(var.name, "-", "_")
}

resource "aws_lambda_function" "function" {
  function_name = local.resource_name
  runtime       = "nodejs18.x"

  filename         = "out/${var.name}.zip"
  source_code_hash = filebase64sha256("out/${var.name}.zip")
  handler          = "main.handler"

  role = var.iam_role_arn 

  environment {
    variables = {
      SPA_URL    = var.spa_url,
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

resource "aws_api_gateway_resource" "gateway_resource" {
  path_part   = var.name
  rest_api_id = var.rest_api_id
  parent_id   = var.rest_api_root_resource_id
}

resource "aws_api_gateway_method" "gateway_method" {
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = var.authorizer_id

  resource_id = aws_api_gateway_resource.gateway_resource.id
  rest_api_id = var.rest_api_id
}

resource "aws_api_gateway_integration" "gateway_integration" {
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.function.invoke_arn
  rest_api_id             = var.rest_api_id
  resource_id             = aws_api_gateway_resource.gateway_resource.id
  http_method             = aws_api_gateway_method.gateway_method.http_method
}

resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = aws_lambda_function.function.function_name
  source_arn    = "${var.rest_api_execution_arn}/*/*"
}

# CORS
resource "aws_api_gateway_method" "gateway_method_cors" {
  http_method   = "OPTIONS"
  authorization = "NONE"

  rest_api_id = var.rest_api_id
  resource_id = aws_api_gateway_resource.gateway_resource.id
}

resource "aws_api_gateway_integration" "gateway_integration_cors" {
  rest_api_id = var.rest_api_id
  resource_id = aws_api_gateway_resource.gateway_resource.id
  http_method = aws_api_gateway_method.gateway_method_cors.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode(
      {
        statusCode = 200
      }
    )
  }
}

resource "aws_api_gateway_method_response" "gateway_method_response_cors_ok" {
  rest_api_id = var.rest_api_id
  resource_id = aws_api_gateway_resource.gateway_resource.id
  http_method = aws_api_gateway_method.gateway_method_cors.http_method
  status_code = 200

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "gateway_integration_response_cors" {
  rest_api_id = var.rest_api_id
  resource_id = aws_api_gateway_resource.gateway_resource.id
  http_method = aws_api_gateway_method.gateway_method_cors.http_method
  status_code = aws_api_gateway_method_response.gateway_method_response_cors_ok.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'*'"
    "method.response.header.Access-Control-Allow-Methods" = "'*'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${var.spa_url}'"
  }
}