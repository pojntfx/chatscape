resource "aws_lambda_function" "function" {
  for_each      = local.lambdas
  function_name = replace(each.key, "-", "_")
  runtime       = "nodejs18.x"

  filename         = "out/${each.key}.zip"
  source_code_hash = filebase64sha256("out/${each.key}.zip")
  handler          = "main.handler"

  role = aws_iam_role.lambda_db.arn

  environment {
    variables = {
      SPA_URL             = local.spa_url,
      CONTACTS_TABLE_NAME = aws_dynamodb_table.contacts.name,
      MESSAGES_TABLE_NAME = aws_dynamodb_table.messages.name
    }
  }
}

resource "aws_api_gateway_resource" "gateway_resource" {
  for_each    = local.lambdas
  path_part   = each.key
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  parent_id   = aws_api_gateway_rest_api.chatscape.root_resource_id
}

resource "aws_api_gateway_method" "gateway_method" {
  for_each      = local.lambdas
  http_method   = each.value
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id

  resource_id = aws_api_gateway_resource.gateway_resource[each.key].id
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
}

resource "aws_api_gateway_integration" "gateway_integration" {
  for_each                = local.lambdas
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.function[each.key].invoke_arn
  rest_api_id             = aws_api_gateway_rest_api.chatscape.id
  resource_id             = aws_api_gateway_resource.gateway_resource[each.key].id
  http_method             = aws_api_gateway_method.gateway_method[each.key].http_method
}

resource "aws_lambda_permission" "lambda_permission" {
  for_each      = local.lambdas
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = aws_lambda_function.function[each.key].function_name
  source_arn    = "${aws_api_gateway_rest_api.chatscape.execution_arn}/*/*"
}

# CORS
resource "aws_api_gateway_method" "gateway_method_cors" {
  for_each      = local.lambdas
  http_method   = "OPTIONS"
  authorization = "NONE"

  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.gateway_resource[each.key].id
}

resource "aws_api_gateway_integration" "gateway_integration_cors" {
  for_each    = local.lambdas
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.gateway_resource[each.key].id
  http_method = aws_api_gateway_method.gateway_method_cors[each.key].http_method

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
  for_each    = local.lambdas
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.gateway_resource[each.key].id
  http_method = aws_api_gateway_method.gateway_method_cors[each.key].http_method
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
  for_each    = local.lambdas
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.gateway_resource[each.key].id
  http_method = aws_api_gateway_method.gateway_method_cors[each.key].http_method
  status_code = aws_api_gateway_method_response.gateway_method_response_cors_ok[each.key].status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Authorization, Content-Type'"
    "method.response.header.Access-Control-Allow-Methods" = "'*'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${var.spa_url}'"
  }
}

# Policies
resource "aws_iam_role" "lambda" {
  name = "lambda"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Effect" : "Allow",
        "Sid" : ""
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "lambda_db" {
  name = "lambda_db"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:UpdateItem"
        ]
        Resource = [
          aws_dynamodb_table.contacts.arn,
          "${aws_dynamodb_table.contacts.arn}/index/*",
          aws_dynamodb_table.messages.arn,
          "${aws_dynamodb_table.messages.arn}/index/*"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "arn:aws:logs:*:*:*"
      },
    ]
  })
}


resource "aws_iam_role" "lambda_db" {
  name = "lambda_db"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Effect" : "Allow",
        "Sid" : ""
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda-policy-attachment" {
  role       = aws_iam_role.lambda_db.name
  policy_arn = aws_iam_policy.lambda_db.arn
}
