locals {
  environment = "production"
}

module "ecr" {
  source = "../base/ecr"

  environment = local.environment
  name        = "micro-task"
}
