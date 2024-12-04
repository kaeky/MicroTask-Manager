import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { UserEntity } from '../../user/entities/user.entity';

export const CurrentUser = createParamDecorator<any, any, UserEntity>(
  (data, req: ExecutionContextHost) => {
    const handler = req.switchToHttp();
    const request = handler.getRequest();
    return request.user;
  },
);
