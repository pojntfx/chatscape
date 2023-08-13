resource "aws_dynamodb_table" "contacts" {
  name         = "contacts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "messages" {
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
