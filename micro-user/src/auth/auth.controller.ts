import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('verifyToken')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@Request() req) {
    return req.user;
  }
}
