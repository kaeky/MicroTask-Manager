locals {
  host         = "inlaze"
  env          = "production"
  service_name = "${local.host}-${local.env}-micro-task"
  ##Custom Domain
  domain       = "CustomeDomain.com"
  port         = 8080
  vpc = {
    id              = data.terraform_remote_state.inlaze.outputs.vpc.vpc_id,
    private_subnets = data.terraform_remote_state.inlaze.outputs.vpc.private_subnets
  }
  ecs                = data.terraform_remote_state.inlaze.outputs.ecs
  https_listener_arn = data.terraform_remote_state.inlaze.outputs.alb.https_listener_arns[0]
  security_groups    = data.terraform_remote_state.inlaze.outputs.sg
}


module "service" {
  source = "../base/ecs"

  env                        = local.env
  ecs_cluster_id             = local.ecs.id
  service_name               = local.service_name
  service_desired_count      = 1
  service_image              = var.image
  service_cpu                = 2048
  service_memory_reservation = 2048
  service_memory_hard_limit  = 4096

  service_environment = <<EOF
[
  {"name": "APP_NAME", "value": "${local.service_name}"},
  {"name": "ENVIRONMENT_NAME", "value": "${local.env}"},
  {"name": "LOG_LEVEL", "value": "warning"}
]
EOF

  service_log_type            = "ecs_text"
  service_port                = local.port
  vpc_id                      = local.vpc.id
  alb_listener_arn            = local.https_listener_arn
  domain                      = local.domain
  security_groups             = [local.security_groups.private_http]
  subnets                     = local.vpc.private_subnets
  service_discovery_namespace = local.ecs.namespace.id
}
