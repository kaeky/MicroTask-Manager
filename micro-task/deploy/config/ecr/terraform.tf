terraform {
  backend "s3" {
    bucket         = "tf-inlaze-remote-state"
    key            = "inlaze/micro_task_ecr"
    region         = "us-east-1"
    profile        = "inlaze"
    dynamodb_table = "TerraformBackendLocks"
    ## The role_arn is the same as the one in the provider.tf file
    role_arn       = "arn:aws:iam::CustomAccount:role/CustomRole"
  }
}
