import 'dotenv/config';

export class AppConfig {
  static readonly PORT = process.env.PORT || '3000';
  static readonly MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/catwiki';
  static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';
  static readonly CAT_API_KEY = process.env.CAT_API_KEY || 'default-cat-api-key';
  static readonly CAT_API_BASE_URL = process.env.CAT_API_BASE_URL || 'https://api.example.com/cats';

  static validate(): void {
    if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production environment');
    }

    if (!process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
      throw new Error('MONGO_URI must be set in production environment');
    }


  }
}