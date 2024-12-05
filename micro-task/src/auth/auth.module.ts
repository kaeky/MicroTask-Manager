import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/jwt-auth.guard';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AuthService, AuthGuard],
  exports: [],
})
export class AuthModule {}
