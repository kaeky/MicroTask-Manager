provider "aws" {
  region  = "us-east-1"
  profile = "inlaze"

  ##Change the role_arn to the role_arn of the account you want to assume
  assume_role {
    role_arn = "arn:aws:iam::CustomAccount:role/CustomRole"
  }
}
