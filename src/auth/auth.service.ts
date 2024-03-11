import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }


  async login(user: User, response: Response) {
    const expires = new Date(); // Data de expiração do token

    // Adiciona o tempo de expiração do token
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow('JWT_EXPIRATION'), // 3600 segundos = 1 hora
    )

    // Cria o payload do token
    const tokenPayload: TokenPayload = {
      _id: user._id.toHexString(),
      email: user.email,
    };

    // Gera o token
    const token = this.jwtService.sign(tokenPayload);

    // Adiciona o token no cookie
    response.cookie('Authentication', token, {
      expires,
      httpOnly: true
    });

  }
}
