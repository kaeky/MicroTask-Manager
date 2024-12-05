data "terraform_remote_state" "inlaze" {
  backend = "s3"

  config = {
    bucket   = "tf-inlaze-remote-state"
    key      = "inlaze/production/state"
    region   = "us-east-1"
    profile  = "inlaze"
    role_arn = "arn:aws:iam::CustomAccount:role/CustomRole"
  }
}

data "terraform_remote_state" "config" {
  backend = "s3"

  config = {
    bucket   = "tf-inlaze-remote-state"
    key      = "inlaze/config/state"
    region   = "us-east-1"
    profile  = "inlaze"
    role_arn = "arn:aws:iam::CustomAccount:role/CustomRole"
  }
}

