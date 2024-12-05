provider "aws" {
  region  = "us-east-1"

  assume_role {
    ##Change the role_arn to the role_arn of the account you want to assume
    role_arn = "arn:aws:iam::CustomAccount:role/CustomRole"
  }
}
