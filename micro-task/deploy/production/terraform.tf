terraform {
  backend "s3" {
    bucket         = "tf-inlaze-remote-state"
    key            = "inlaze/production/micro_task_service"
    region         = "us-east-1"
    profile        = "inlaze"
    dynamodb_table = "TerraformBackendLocks"
    role_arn       = "arn:aws:iam::CustomAccount:role/CustomRole"
  }
}
