data "aws_caller_identity" "current" {}

data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

resource "aws_ecs_task_definition" "service" {
  family             = var.service_name
  cpu                = var.service_cpu
  memory             = var.service_memory_hard_limit
  network_mode       = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn = data.aws_iam_role.ecs_task_execution_role.arn

  container_definitions = <<EOF
[
  {
    "name": "${var.service_name}",
    "image": "${var.service_image}",
    "cpu": ${var.service_cpu},
    "memory": ${var.service_memory_hard_limit},
    "memoryReservation": ${var.service_memory_reservation},
    "environment": ${var.service_environment},
    "secrets": [
      {
        "name": "NODE_ENV",
        "valueFrom": "arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter/${var.env}/NODE_ENV"
      },
      {
        "name": "PORT",
        "valueFrom": "arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter/${var.env}/PORT"
      },
      {
        "name": "DATABASE_HOST",
        "valueFrom": "arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter/${var.env}/DATABASE_HOST"
      },
      {
        "name": "DATABASE_USERNAME",
        "valueFrom": "arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter/${var.env}/DATABASE_USERNAME"
      },
      {
        "name": "DATABASE_PASSWORD",
        "valueFrom": "arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter/${var.env}/DATABASE_PASSWORD"
      },
      {
        "name": "DATABASE_SCHEMA",
        "valueFrom": "arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter/${var.env}/DATABASE_SCHEMA"
      },
      {
        "name": "DATABASE_NAME",
        "valueFrom": "arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter/${var.env}/DATABASE_NAME"
      },
      {
        "name": "DATABASE_PORT",
        "valueFrom": "arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter/${var.env}/DATABASE_PORT"
      },
    ],
    "essential": true,
    "mountPoints": [],
    "networkMode": "awsvpc",
    "portMappings": [{
      "containerPort": ${var.service_port}
    }],
    "dockerLabels": {
      "service": "${var.service_name}"
    },
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${var.service_name}",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }
]
EOF

  tags = {
    Name        = "${var.service_name}-task"
    Environment = var.env
  }
}

resource "aws_ecs_service" "service" {
  name                  = var.service_name
  cluster               = var.ecs_cluster_id
  task_definition       = aws_ecs_task_definition.service.arn
  desired_count         = var.service_desired_count
  launch_type           = "FARGATE"
  wait_for_steady_state = true

  network_configuration {
    security_groups = var.security_groups
    subnets         = var.subnets
  }


  # tasks are registered at the load balancer with their randomly chosen port mapped to the port of the application running inside the container
  load_balancer {
    target_group_arn = aws_alb_target_group.nest_api.arn
    container_name   = var.service_name
    container_port   = var.service_port
  }

  # a maximum of desired_count * 2 tasks will be started during a deployment
  deployment_maximum_percent = 200

  # minimum number of tasks during a deployment = desired_count
  deployment_minimum_healthy_percent = 100

  tags = {
    Name        = var.service_name
    Environment = var.env
  }
}

resource "aws_cloudwatch_log_group" "logs" {
  name = var.service_name

  tags = {
    Environment = var.env
  }
}
