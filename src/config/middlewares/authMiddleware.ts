import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Context, Next } from 'koa';
import dotenv from 'dotenv';
import * as crypto from 'crypto';
import jwkToPem from 'jwk-to-pem';
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { UserRepository } from '../../adapters/repositories/UserRepository';

dotenv.config();

// Configurações do AWS Cognito vindas do .env
const poolId = process.env.COGNITO_USER_POOL_ID;
const region = process.env.COGNITO_REGION;

const userRepository = new UserRepository();

if (!poolId || !region) {
  throw new Error('COGNITO_USER_POOL_ID e COGNITO_REGION precisam estar definidos no .env');
}

// URL para pegar a chave pública do Cognito
const cognitoIssuer = `https://cognito-idp.${region}.amazonaws.com/${poolId}`;
const cognitoJwkUrl = `${cognitoIssuer}/.well-known/jwks.json`;

let cachedKeys: any = null;

// Função para buscar as chaves públicas do Cognito
const getKeys = async () => {
  if (cachedKeys) return cachedKeys;

  try {
    const response = await axios.get(cognitoJwkUrl);
    cachedKeys = response.data.keys;
    return cachedKeys;
  } catch (error) {
    throw new Error('Erro ao buscar as chaves públicas do Cognito.');
  }
};

// Função para converter a chave RSA para o formato PEM
// const rsaToPem = (publicKey: { n: string, e: string }) => {
//   const modulus = publicKey.n;
//   const exponent = publicKey.e;

//   // Decodifica 'n' e 'e' de base64
//   const modulusBuffer = Buffer.from(modulus, 'base64');
//   const exponentBuffer = Buffer.from(exponent, 'base64');

//   // Cria a chave pública em formato PEM
//   const modulusHex = modulusBuffer.toString('hex');
//   const exponentHex = exponentBuffer.toString('hex');

//   const modulusHexLength = modulusHex.length / 2;
//   const exponentHexLength = exponentHex.length / 2;

//   // Construção ASN.1
//   const seq = [
//     { type: 'INTEGER', value: 0x00 },  // version (0)
//     { type: 'INTEGER', value: modulusHexLength },
//     { type: 'INTEGER', value: modulusHex },
//     { type: 'INTEGER', value: exponentHexLength },
//     { type: 'INTEGER', value: exponentHex }
//   ];

//   const asn1 = seq.map(item => Buffer.from(item.value, 'hex'));
//   const asn1Key = Buffer.concat([Buffer.from('30819f', 'hex'), ...asn1]);

//   // Return PEM formatted key
//   const pemKey = asn1Key.toString('base64').match(/.{1,64}/g)?.join('\n') || '';
//   return `-----BEGIN PUBLIC KEY-----\n${pemKey}\n-----END PUBLIC KEY-----`;
// };


// Função para validar o token JWT
const verifyToken = async (token: string) => {
  // Decodifica o token para obter o 'kid'
  // const decoded = jwt.decode(token, { complete: true });
  // if (!decoded || !decoded.header.kid) throw new Error('Token inválido.');

  // const keys = await getKeys();

  // const key = keys.find((k: any) => k.kid === decoded.header.kid);
  // if (!key) throw new Error(`Chave pública não encontrada para o kid ${decoded.header.kid}.`);

  // // Converte a chave pública para PEM
  // const publicKeyPem = rsaToPem(key);

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
