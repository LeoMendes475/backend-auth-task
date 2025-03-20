import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    SignUpCommand,
    AdminInitiateAuthCommand,
    RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import * as crypto from 'crypto';
import { UserRepository } from '../../adapters/repositories/UserRepository';

export class CognitoAuthService {
    private client: CognitoIdentityProviderClient;
    private clientId: string;
    private userPoolId: string;
    private userRepository = new UserRepository();

    constructor() {
        this.client = new CognitoIdentityProviderClient({ region: process.env.COGNITO_REGION! });
        this.clientId = process.env.COGNITO_APP_CLIENT_ID!;
        this.userPoolId = process.env.COGNITO_USER_POOL_ID!;
    }

    async respondToNewPasswordChallenge(session: string, email: string, newPassword: string) {
        const secretHash = crypto
            .createHmac('sha256', process.env.COGNITO_APP_CLIENT_SECRET!)
            .update(`${email}${this.clientId}`)
            .digest('base64');

        const command = new RespondToAuthChallengeCommand({
            ClientId: this.clientId,
            ChallengeName: 'NEW_PASSWORD_REQUIRED',
            Session: session,
            ChallengeResponses: {
                USERNAME: email,
                NEW_PASSWORD: newPassword,
                SECRET_HASH: secretHash, // Incluir o SECRET_HASH aqui
            },
        });

        try {
            const response = await this.client.send(command);

            // Retorna os tokens de autenticação após a nova senha ser definida
            return {
                accessToken: response.AuthenticationResult?.AccessToken,
                idToken: response.AuthenticationResult?.IdToken,
                refreshToken: response.AuthenticationResult?.RefreshToken,
            };
        } catch (error: any) {
            console.error('Erro ao responder ao desafio de nova senha:', error);
            throw new Error('Erro ao responder ao desafio de nova senha: ' + (error.message || JSON.stringify(error)));
        }
    }


    async signIn(email: string, password: string) {
        const crypto = require('crypto');
console.log('crypto::')
        const secretHash = crypto
            .createHmac('sha256', process.env.COGNITO_APP_CLIENT_SECRET)
            .update(`${email}${process.env.COGNITO_APP_CLIENT_ID}`)
            .digest('base64');
console.log('secretHash::',secretHash)
        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: secretHash,
            },
        });

        try {
            const response = await this.client.send(command);
            console.log('client.send::',response)

            // Se o desafio NEW_PASSWORD_REQUIRED for retornado
            if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
                const challengeResponse = await this.respondToNewPasswordChallenge(
                    response.Session!,
                    email,
                    password
                );
                return challengeResponse;
            }

            return {
                accessToken: response.AuthenticationResult?.AccessToken,
                idToken: response.AuthenticationResult?.IdToken,
                refreshToken: response.AuthenticationResult?.RefreshToken,
            };
        } catch (error: any) {
            console.error('Erro ao autenticar usuário no Cognito:', error);
            throw new Error(
                'Erro ao autenticar usuário no Cognito: ' + (error.message || JSON.stringify(error))
            );
        }
    }


    async signUp(email: string, password: string, id: string, role: string) {
        const command = new SignUpCommand({
            ClientId: this.clientId,
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'profile', Value: role },
            ],
        });
        try {
            const aws_user = await this.client.send(command);
            console.log('criado:',aws_user)
            return { message: 'Usuário registrado no Cognito. Confirmação de e-mail necessária.' };
        } catch (error: any) {
            console.log('error:', error.message)
            throw new Error('Erro ao registrar usuário no Cognito: ' + error.message);
        }
    }

    async verifyToken(token: string) {
        const command = new AdminInitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            UserPoolId: this.userPoolId,
            ClientId: this.clientId,
            AuthParameters: {
                REFRESH_TOKEN: token,
            },
        });

        try {
            const response = await this.client.send(command);
            return response.AuthenticationResult?.AccessToken;
        } catch (error: any) {
            throw new Error('Token inválido: ' + error.message);
        }
    }
}
