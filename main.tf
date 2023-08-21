locals {
  spa_url = var.spa_url == "" ? "https://${aws_cloudfront_distribution.spa.domain_name}" : var.spa_url

  lambdas = ["add-contact", "get-contacts", "block-contact", "report-contact", "add-message", "get-messages"]
}

# API Gateway
resource "aws_api_gateway_rest_api" "chatscape" {
  name = "chatscape"
}

resource "aws_api_gateway_deployment" "chatscape" {
  stage_name = "test"

  rest_api_id = aws_api_gateway_rest_api.chatscape.id

  # We need this because otherwise the stage itself would not be deployed when we add new lambdas
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_integration.gateway_integration[*],
      aws_api_gateway_integration.gateway_integration_cors[*]
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}
