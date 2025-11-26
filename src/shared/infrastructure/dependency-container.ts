// Auth Domain
export { User } from '../../auth/domain/entities/user.entity.js';
export { UserEmail } from '../../auth/domain/value-objects/user-email.js';
export { UserPassword } from '../../auth/domain/value-objects/user-password.js';
export { UserId } from '../../auth/domain/value-objects/user-id.js';
export type { UserRepository } from '../../auth/domain/repositories/user.repository.js';
// Auth Application
export { RegisterUserUseCase } from '../../auth/application/use-cases/register-user.use-case.js';
export { LoginUserUseCase } from '../../auth/application/use-cases/login-user.use-case.js';
export { GetUserByIdUseCase } from '../../auth/application/use-cases/get-user-by-id.use-case.js';
export type { PasswordHasher } from '../../auth/application/interfaces/password-hasher.interface.js';
export type { JwtService } from '../../auth/application/interfaces/jwt.service.interface.js';

// Auth Infrastructure
export { MongoUserRepository } from '../../auth/infrastructure/repositories/mongo-user.repository.js';
export { BcryptPasswordHasherAdapter } from '../../auth/infrastructure/adapters/bcrypt-password-hasher.adapter.js';
export { JsonWebTokenAdapter } from '../../auth/infrastructure/adapters/jsonwebtoken.adapter.js';

// Auth Presentation
export { AuthController } from '../../auth/presentation/controllers/auth.controller.js';
export { AuthMiddleware } from '../../auth/presentation/middlewares/auth.middleware.js';
export { AuthRoutes } from '../../auth/presentation/routes/auth.routes.js';

// Config
export { AppConfig } from '../../config/app.config.js';
export { DatabaseConfig } from '../../config/database.config.js';