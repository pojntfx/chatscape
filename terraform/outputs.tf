output "api_url" {
  value = aws_api_gateway_deployment.chatscape.invoke_url
}

output "spa_url" {
  value = local.spa_url
}

output "user_pool_id" {
  value = aws_cognito_user_pool.chatscape.id
}

output "client_id" {
  value = aws_cognito_user_pool_client.spa.id
}

output "authority" {
  value = "https://cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.chatscape.id}"
}
