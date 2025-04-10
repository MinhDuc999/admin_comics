import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
  ) {}

  @Get('test')
  test() {
    return { message: 'Auth controller is working' };
  }

  @Post('google-token')
  async googleTokenAuth(
    @Body() body: { idToken: string; email?: string; displayName?: string },
  ) {
    try {
      const payload = await this.googleAuthService.verifyIdToken(body.idToken);

      if (!payload || !payload.email) {
        throw new UnauthorizedException(
          'Invalid Google token or missing email',
        );
      }
      const userData = {
        email: payload.email,
        fullName:
          payload.name || body.displayName || payload.email.split('@')[0],
        googleId: payload.sub,
        avatar: payload.picture,
      };

      const user = await this.authService.validateGoogleUser(userData);

      return this.authService.login(user);
    } catch (error) {
      console.error('Authentication failed', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }
}
