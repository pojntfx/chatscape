locals {
  spa_url = var.spa_url == "" ? "https://${aws_cloudfront_distribution.spa.domain_name}" : var.spa_url
}

# Hello World
resource "aws_lambda_function" "hello_world" {
  function_name = "hello_world"
  runtime       = "nodejs18.x"

  filename         = "out/hello-world.zip"
  source_code_hash = filebase64sha256("out/hello-world.zip")
  handler          = "main.handler"

  role = aws_iam_role.lambda.arn

  environment {
    variables = {
      SPA_URL = local.spa_url
    }
  }
}

resource "aws_api_gateway_resource" "hello_world" {
  path_part = "hello-world"

  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  parent_id   = aws_api_gateway_rest_api.chatscape.root_resource_id
}

resource "aws_api_gateway_method" "hello_world" {
  http_method   = "GET"
  authorization = "NONE"

  resource_id = aws_api_gateway_resource.hello_world.id
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
}

resource "aws_api_gateway_integration" "hello_world" {
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.hello_world.invoke_arn
  rest_api_id             = aws_api_gateway_rest_api.chatscape.id
  resource_id             = aws_api_gateway_resource.hello_world.id
  http_method             = aws_api_gateway_method.hello_world.http_method
}

resource "aws_lambda_permission" "hello_world" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = aws_lambda_function.hello_world.function_name
  source_arn    = "${aws_api_gateway_rest_api.chatscape.execution_arn}/*/*"
}

# Hello Secret
resource "aws_lambda_function" "hello_secret" {
  function_name = "hello_secret"
  runtime       = "nodejs18.x"

  filename         = "out/hello-secret.zip"
  source_code_hash = filebase64sha256("out/hello-secret.zip")
  handler          = "main.handler"

  role = aws_iam_role.lambda.arn

  environment {
    variables = {
      SPA_URL = local.spa_url
    }
  }
}

resource "aws_api_gateway_resource" "hello_secret" {
  path_part   = "hello-secret"
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  parent_id   = aws_api_gateway_rest_api.chatscape.root_resource_id
}

resource "aws_api_gateway_method" "hello_secret" {
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id

  resource_id = aws_api_gateway_resource.hello_secret.id
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
}

resource "aws_api_gateway_integration" "hello_secret" {
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.hello_secret.invoke_arn
  rest_api_id             = aws_api_gateway_rest_api.chatscape.id
  resource_id             = aws_api_gateway_resource.hello_secret.id
  http_method             = aws_api_gateway_method.hello_secret.http_method
}

resource "aws_lambda_permission" "hello_secret" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = aws_lambda_function.hello_secret.function_name
  source_arn    = "${aws_api_gateway_rest_api.chatscape.execution_arn}/*/*"
}

# Hello DB
resource "aws_lambda_function" "hello_db" {
  function_name = "hello_db"
  runtime       = "nodejs18.x"

  filename         = "out/hello-db.zip"
  source_code_hash = filebase64sha256("out/hello-db.zip")
  handler          = "main.handler"

  role = aws_iam_role.lambda_db.arn

  environment {
    variables = {
      SPA_URL    = local.spa_url,
      TABLE_NAME = aws_dynamodb_table.chatscape.name
    }
  }
}

resource "aws_api_gateway_resource" "hello_db" {
  path_part   = "hello-db"
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  parent_id   = aws_api_gateway_rest_api.chatscape.root_resource_id
}

resource "aws_api_gateway_method" "hello_db" {
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito.id

  resource_id = aws_api_gateway_resource.hello_db.id
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
}

resource "aws_api_gateway_integration" "hello_db" {
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.hello_db.invoke_arn
  rest_api_id             = aws_api_gateway_rest_api.chatscape.id
  resource_id             = aws_api_gateway_resource.hello_db.id
  http_method             = aws_api_gateway_method.hello_db.http_method
}

resource "aws_lambda_permission" "hello_db" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = aws_lambda_function.hello_db.function_name
  source_arn    = "${aws_api_gateway_rest_api.chatscape.execution_arn}/*/*"
}

# Lambda
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
          "dynamodb:GetItem"
        ]
        Resource = [
          aws_dynamodb_table.chatscape.arn
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

# API Gateway
resource "aws_api_gateway_rest_api" "chatscape" {
  name = "chatscape"
}

resource "aws_api_gateway_deployment" "chatscape" {
  stage_name = "test"

  depends_on = [
    aws_api_gateway_integration.hello_world,
    aws_api_gateway_integration.hello_world_cors,

    aws_api_gateway_integration.hello_secret,
    aws_api_gateway_integration.hello_secret_cors,

    aws_api_gateway_integration.hello_db,
    aws_api_gateway_integration.hello_db_cors,
  ]

  rest_api_id = aws_api_gateway_rest_api.chatscape.id

  # We need this because otherwise the stage itself would not be deployed when we add new lambdas
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_integration.hello_world,
      aws_api_gateway_integration.hello_world_cors,

      aws_api_gateway_integration.hello_secret,
      aws_api_gateway_integration.hello_secret_cors,

      aws_api_gateway_integration.hello_db,
      aws_api_gateway_integration.hello_db_cors,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Enable OPTIONS dummy methods for CORS
resource "aws_api_gateway_method" "hello_world_cors" {
  http_method   = "OPTIONS"
  authorization = "NONE"

  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_world.id
}

resource "aws_api_gateway_integration" "hello_world_cors" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_world.id
  http_method = aws_api_gateway_method.hello_world_cors.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode(
      {
        statusCode = 200
      }
    )
  }
}

resource "aws_api_gateway_method_response" "hello_world_cors_ok" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_world.id
  http_method = aws_api_gateway_method.hello_world_cors.http_method
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

resource "aws_api_gateway_integration_response" "hello_world_cors" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_world.id
  http_method = aws_api_gateway_method.hello_world_cors.http_method
  status_code = aws_api_gateway_method_response.hello_world_cors_ok.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'*'"
    "method.response.header.Access-Control-Allow-Methods" = "'*'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.spa_url}'"
  }
}

resource "aws_api_gateway_method" "hello_secret_cors" {
  http_method   = "OPTIONS"
  authorization = "NONE"

  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_secret.id
}

resource "aws_api_gateway_integration" "hello_secret_cors" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_secret.id
  http_method = aws_api_gateway_method.hello_secret_cors.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode(
      {
        statusCode = 200
      }
    )
  }
}

resource "aws_api_gateway_method_response" "hello_secret_cors_ok" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_secret.id
  http_method = aws_api_gateway_method.hello_secret_cors.http_method
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

resource "aws_api_gateway_integration_response" "hello_secret_cors" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_secret.id
  http_method = aws_api_gateway_method.hello_secret_cors.http_method
  status_code = aws_api_gateway_method_response.hello_secret_cors_ok.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'*'"
    "method.response.header.Access-Control-Allow-Methods" = "'*'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.spa_url}'"
  }
}

resource "aws_api_gateway_method" "hello_db_cors" {
  http_method   = "OPTIONS"
  authorization = "NONE"

  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_db.id
}

resource "aws_api_gateway_integration" "hello_db_cors" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_db.id
  http_method = aws_api_gateway_method.hello_db_cors.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode(
      {
        statusCode = 200
      }
    )
  }
}

resource "aws_api_gateway_method_response" "hello_db_cors_ok" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_db.id
  http_method = aws_api_gateway_method.hello_db_cors.http_method
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

resource "aws_api_gateway_integration_response" "hello_db_cors" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_db.id
  http_method = aws_api_gateway_method.hello_db_cors.http_method
  status_code = aws_api_gateway_method_response.hello_db_cors_ok.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'*'"
    "method.response.header.Access-Control-Allow-Methods" = "'*'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${local.spa_url}'"
  }
}

# S3
resource "aws_s3_bucket" "spa" {
  bucket = "chatscape-spa"
}

resource "aws_s3_bucket_ownership_controls" "spa" {
  bucket = aws_s3_bucket.spa.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "spa" {
  depends_on = [aws_s3_bucket_ownership_controls.spa]

  bucket = aws_s3_bucket.spa.id
  acl    = "private"
}

resource "aws_s3_bucket_website_configuration" "spa" {
  bucket = aws_s3_bucket.spa.id

  index_document {
    suffix = "index.html"
  }
}

resource "local_file" "config_json" {
  content = jsonencode({
    "clientID" : aws_cognito_user_pool_client.spa.id,
    "authority" : "https://cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.chatscape.id}",
    "apiURL" : aws_api_gateway_deployment.chatscape.invoke_url
  })
  filename = "${path.module}/frontend/public/config.json"
}

resource "aws_s3_object" "config_json" {
  depends_on = [local_file.config_json]

  bucket       = aws_s3_bucket.spa.bucket
  key          = "config.json"
  content_type = "application/json"

  source = local_file.config_json.filename
}

module "template_files" {
  source = "hashicorp/dir/template"

  base_dir = "${path.module}/frontend/out"
}

resource "aws_s3_bucket_object" "doc_files" {
  for_each = module.template_files.files

  bucket       = aws_s3_bucket.spa.bucket
  key          = each.key
  content_type = each.value.content_type

  source  = each.value.source_path
  content = each.value.content

  etag = each.value.digests.md5
}

resource "aws_s3_bucket_policy" "spa" {
  bucket = aws_s3_bucket.spa.id
  policy = data.aws_iam_policy_document.spa.json
}

resource "aws_s3_bucket_public_access_block" "spa" {
  bucket = aws_s3_bucket.spa.id

  block_public_acls   = true
  block_public_policy = true
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {}

resource "aws_cloudfront_distribution" "spa" {
  origin {
    domain_name = aws_s3_bucket.spa.bucket_regional_domain_name
    origin_id   = "chatscape-spa"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "chatscape-spa"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 30 # TODO: Set to 3600 in prod
    max_ttl                = 60 # TODO: Set to 86400 in prod
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

data "aws_iam_policy_document" "spa" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.spa.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }
  }
}

# Cognito
resource "aws_cognito_user_pool" "chatscape" {
  name = "chatscape"
}

resource "aws_api_gateway_authorizer" "cognito" {
  name          = "authorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.chatscape.id
  provider_arns = [aws_cognito_user_pool.chatscape.arn]
}

resource "aws_cognito_user_pool_domain" "chatscape" {
  domain       = "chatscape"
  user_pool_id = aws_cognito_user_pool.chatscape.id
}

resource "aws_cognito_user_pool_client" "spa" {
  name = "Chatscape"

  user_pool_id = aws_cognito_user_pool.chatscape.id

  generate_secret = false

  callback_urls = [local.spa_url]

  allowed_oauth_flows  = ["implicit", "code"]
  allowed_oauth_scopes = ["email", "openid", "profile"]

  allowed_oauth_flows_user_pool_client = true
  explicit_auth_flows                  = ["ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_ADMIN_USER_PASSWORD_AUTH"]

  supported_identity_providers = ["COGNITO"]
}

# DynamoDB
resource "aws_dynamodb_table" "chatscape" {
  name         = "chatscape"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Id"

  attribute {
    name = "Id"
    type = "S"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}