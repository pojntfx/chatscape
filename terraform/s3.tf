resource "aws_s3_bucket" "spa" {
  bucket = "chatscape-frontend"
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
  filename = "${path.module}/../frontend/public/config.json"
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

  base_dir = "${path.module}/../frontend/out"
}

resource "aws_s3_object" "doc_files" {
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