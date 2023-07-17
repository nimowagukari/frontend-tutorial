terraform {
  backend "s3" {
    bucket = var.tfstate_bucket
    key    = "tfstate.d/frontend-tutorial.tfstate.json"
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
