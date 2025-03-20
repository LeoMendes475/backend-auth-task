import { UserRepository } from "../../../adapters/repositories/UserRepository";
import { CognitoAuthService } from "../../../domain/services/cognitoAuthService";

export class SignInOrRegisterUseCase {
    private userRepository: UserRepository;
    private cognitoAuthService: CognitoAuthService;

    constructor(userRepository: UserRepository, cognitoAuthService: CognitoAuthService) {
        this.userRepository = userRepository;
        this.cognitoAuthService = cognitoAuthService;
    }

    async execute(email: string, password: string) {
        let user = await this.userRepository.findByEmail(email);
        if (!user) {
            user = await this.userRepository.create({
                email,
                name: '',
                role: 'user',
                isOnboarded: false,
                createdAt: new Date()
            });
            await this.cognitoAuthService.signUp(email, password, user?.id, user?.role);
        }

        const tokens = await this.cognitoAuthService.signIn(email, password);

        return { user, tokens };
    }
}
