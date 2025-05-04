terraform {
  backend "s3" {
    bucket = "terraform-state-remindrx-dddictionary-v2"
    key    = "core/terraform.tfstate"
    region = "us-east-1"
  }
}