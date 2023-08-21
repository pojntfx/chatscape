resource "aws_dynamodb_table" "contacts" {
  name         = "contacts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "namespace"
    type = "S"
  }

  global_secondary_index {
    name            = "NamespaceIndex"
    hash_key        = "namespace"
    projection_type = "ALL"
    write_capacity  = 5
    read_capacity   = 5
  }
}

resource "aws_dynamodb_table" "messages" {
  name         = "messages"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "date"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "senderNamespace"
    type = "S"
  }

  attribute {
    name = "recipientNamespace"
    type = "S"
  }

  attribute {
    name = "recipientNamespace"
    type = "S"
  }

  attribute {
    name = "date"
    type = "S"
  }

  global_secondary_index {
    name            = "SenderNamespaceIndex"
    hash_key        = "senderNamespace"
    projection_type = "ALL"
    write_capacity  = 5
    read_capacity   = 5
  }

  global_secondary_index {
    name            = "RecipientNamespaceIndex"
    hash_key        = "recipientNamespace"
    projection_type = "ALL"
    write_capacity  = 5
    read_capacity   = 5
  }

  global_secondary_index {
    name            = "SenderRecipientNamespaceIndex"
    hash_key        = "senderNamespace"
    range_key       = "recipientNamespace"
    projection_type = "ALL"
    write_capacity  = 5
    read_capacity   = 5
  }

}
