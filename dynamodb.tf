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

resource "aws_dynamodb_table" "contact_table" {
  name         = "contacts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "message_table" {
  name         = "messages"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "them"
  range_key    = "date"

  attribute {
    name = "them"
    type = "N" # Using Number type to represent boolean
  }

  attribute {
    name = "date"
    type = "N" # Using Number type to represent Unix timestamp
  }
}