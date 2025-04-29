terraform {
  backend "s3" {
    bucket         = "terraform-state-remindrx-dddictionary"
    key            = "core/terraform.tfstate"
    region         = "us-east-2"
  }
}