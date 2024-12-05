output "discovery_dns" {
  value="api.${var.env}.inlaze.local"
}

output "service_arn" {
  value = aws_ecs_task_definition.service.arn
}

output "task_definition_arn" {
  value = aws_ecs_task_definition.service.arn
}
