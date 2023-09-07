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
  domain       = "chatscape-users"
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
  supported_identity_providers         = ["COGNITO"]
}
