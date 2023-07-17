data "aws_route53_zone" "this" {
  name = var.base_domain
}
data "aws_s3_bucket" "webhosting" {
  bucket = var.bucket
}
data "aws_s3_bucket" "log" {
  bucket = var.log_bucket
}
data "aws_cloudfront_cache_policy" "this" {
  name = "Managed-CachingOptimized"
}
resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "default"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_acm_certificate" "stg" {
  provider          = aws.ue1
  domain_name       = "${var.host}-staging.${var.base_domain}"
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}
resource "aws_cloudfront_distribution" "stg" {
  enabled             = true
  comment             = "${var.host} staging"
  price_class         = "PriceClass_200"
  aliases             = [aws_acm_certificate.stg.domain_name]
  default_root_object = "index.html"
  origin {
    domain_name              = data.aws_s3_bucket.webhosting.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = "${var.host}-staging"
    origin_path              = "/${var.host}-staging"
  }
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.this.id
    compress               = true
    target_origin_id       = "${var.host}-staging"
    viewer_protocol_policy = "allow-all"
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.stg.arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
  logging_config {
    bucket = data.aws_s3_bucket.log.bucket_regional_domain_name
    prefix = "CloudFront/"
  }
}
resource "aws_route53_record" "stg" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = "${var.host}-staging"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.stg.domain_name
    zone_id                = aws_cloudfront_distribution.stg.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_acm_certificate" "prod" {
  provider          = aws.ue1
  domain_name       = "${var.host}.${var.base_domain}"
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}
resource "aws_cloudfront_distribution" "prod" {
  enabled             = true
  comment             = "${var.host} production"
  price_class         = "PriceClass_200"
  aliases             = [aws_acm_certificate.prod.domain_name]
  default_root_object = "index.html"
  origin {
    domain_name              = data.aws_s3_bucket.webhosting.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = var.host
    origin_path              = "/${var.host}"
  }
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.this.id
    compress               = true
    target_origin_id       = var.host
    viewer_protocol_policy = "allow-all"
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.prod.arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
  logging_config {
    bucket = data.aws_s3_bucket.log.bucket_regional_domain_name
    prefix = "CloudFront/"
  }
}
resource "aws_route53_record" "prod" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = var.host
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.prod.domain_name
    zone_id                = aws_cloudfront_distribution.prod.hosted_zone_id
    evaluate_target_health = false
  }
}
