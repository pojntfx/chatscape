provider "aws" {
  region  = "eu-north-1"
  profile = "ChatScapeAdministrator-856591169022"
}

# Hello World
resource "aws_lambda_function" "hello_world" {
  function_name = "hello_world"
  runtime       = "nodejs18.x"

  filename         = "out/hello-world.zip"
  source_code_hash = filebase64sha256("out/hello-world.zip")
  handler          = "hello-world.handler"

  role = aws_iam_role.lambda.arn
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

# API Gateway
resource "aws_api_gateway_rest_api" "chatscape" {
  name = "chatscape"
}

# Enable OPTIONS dummy method for CORS
resource "aws_api_gateway_method" "cors" {
  http_method   = "OPTIONS"
  authorization = "NONE"

  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_world.id
}

resource "aws_api_gateway_integration" "cors" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_world.id
  http_method = aws_api_gateway_method.cors.http_method

  type = "MOCK"
}

resource "aws_api_gateway_method_response" "cors_ok" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_world.id
  http_method = aws_api_gateway_method.cors.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "cors" {
  rest_api_id = aws_api_gateway_rest_api.chatscape.id
  resource_id = aws_api_gateway_resource.hello_world.id
  http_method = aws_api_gateway_method.cors.http_method
  status_code = aws_api_gateway_method_response.cors_ok.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'*'"
    "method.response.header.Access-Control-Allow-Methods" = "'*'"
    "method.response.header.Access-Control-Allow-Origin"  = "'https://${aws_cloudfront_distribution.spa.domain_name}'"
  }
}

resource "aws_api_gateway_deployment" "chatscape" {
  stage_name = "test"

  depends_on = [
    aws_api_gateway_integration.cors,
    aws_api_gateway_integration_response.cors,
    aws_api_gateway_integration.hello_world,
  ]

  rest_api_id = aws_api_gateway_rest_api.chatscape.id
}

# S3
resource "aws_s3_bucket" "spa" {
  bucket = "chatscape-spa"
  acl    = "private"

  versioning {
    enabled = false
  }

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_object" "index_html" {
  bucket = aws_s3_bucket.spa.bucket

  key    = "index.html"
  source = "src/index.html"

  content_type = "text/html"
  etag         = filebase64sha256("src/index.html")

  bucket_key_enabled = true
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

# Outputs
output "api_endpoint" {
  value = aws_api_gateway_deployment.chatscape.invoke_url
}

output "spa_endpoint" {
  value = "https://${aws_cloudfront_distribution.spa.domain_name}/"
}
