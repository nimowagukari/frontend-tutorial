terraform {
  backend "s3" {
    # 機密情報の漏洩防止の為、bucket は -backend-config オプションで指定すること
    key    = "tfstate.d/frontend-tutorial/terraform.tfstate.json"
    region = "ap-northeast-1"
  }
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ap-northeast-1"
  default_tags {
    tags = {
      ManagedBy = "terraform"
    }
  }
}

provider "aws" {
  alias  = "ue1"
  region = "us-east-1"
  default_tags {
    tags = {
      ManagedBy = "terraform"
    }
  }
}
