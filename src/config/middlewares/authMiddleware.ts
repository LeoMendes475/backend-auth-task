import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Context, Next } from 'koa';
import dotenv from 'dotenv';
import * as crypto from 'crypto';
import jwkToPem from 'jwk-to-pem';
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { UserRepository } from '../../adapters/repositories/UserRepository';

dotenv.config();

const poolId = process.env.COGNITO_USER_POOL_ID;
const region = process.env.COGNITO_REGION;

const userRepository = new UserRepository();

if (!poolId || !region) {
  throw new Error('COGNITO_USER_POOL_ID e COGNITO_REGION precisam estar definidos no .env');
}

const cognitoIssuer = `https://cognito-idp.${region}.amazonaws.com/${poolId}`;
const cognitoJwkUrl = `${cognitoIssuer}/.well-known/jwks.json`;

let cachedKeys: any = null;

const verifyToken = async (token: string) => {
  try {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: poolId,
      tokenUse: "access",
      clientId: process.env.COGNITO_APP_CLIENT_ID,
    });
    // Verifique se a assinatura do token é válida
    // return jwt.verify(token, publicKeyPem, {
    //   algorithms: ['RS256'],
    //   issuer: cognitoIssuer,
    // });
    // @ts-ignore
    const validate = await verifier.verify(token);
    return validate
  } catch (err) {
    console.error('Erro na verificação do token: ', (err as Error).message);
    throw new Error('Erro na verificação do token.');
  }
};


const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers['authorization'];
  if (!token || !token.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { message: 'Token não encontrado ou formato inválido.' };
    return;
  }
  try {
    const accessToken = token.split(' ')[1];
    const tokenPayload = await verifyToken(accessToken);
    // console.log('tokenPayload::',tokenPayload)
    // const user = await userRepository.findByEmail(tokenPayload?.email)
    // console.log('user::',user)

    ctx.state.user = {
      // id: user?.id,
      role: tokenPayload?.scope === 'aws.cognito.signin.user.admin' ? 'admin' : 'user'
    }
    await next();
  } catch (error) {
    console.log('authMiddleware:error::', (error as Error).message)
    ctx.status = 401;
    ctx.body = { message: 'Token inválido ou expirado.', error: error };
  }
};

export default authMiddleware;
