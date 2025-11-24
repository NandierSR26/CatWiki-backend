import { 
  MongoUserRepository, 
  BcryptPasswordHasher, 
  JsonWebTokenService,
  RegisterUserUseCase,
  LoginUserUseCase,
  GetUserByIdUseCase,
  AuthController,
  AuthMiddleware,
  AppConfig
} from './dependency-container.js';
import { AuthRoutes } from '../../auth/presentation/routes/auth.routes.js';

export class AuthModuleFactory {
  static create() {
    // Infrastructure
    const userRepository = new MongoUserRepository();
    const passwordHasher = new BcryptPasswordHasher();
    const jwtService = new JsonWebTokenService(
      AppConfig.JWT_SECRET
    );

    // Application
    const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
    const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, jwtService);
    const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

    // Presentation
    const authController = new AuthController(
      registerUserUseCase,
      loginUserUseCase,
      getUserByIdUseCase
    );
    const authMiddleware = new AuthMiddleware(jwtService);
    const authRoutes = AuthRoutes.routes(authController, authMiddleware);

    return {
      authRoutes,
      authMiddleware,
      userRepository,
      passwordHasher,
      jwtService
    };
  }
}