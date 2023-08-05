variable "base_domain" {
  type = string
  description = "DNS ドメイン名"
}

variable "host" {
  type = string
  description = "DNS ドメイン名に含まれるホスト部の値"
}

variable "bucket" {
  type = string
  description = "CloudFront で指定する S3 バケット名"
}
variable "log_bucket" {
  type = string
  description = "CloudFront で指定する、ログの S3 バケット名"
}
