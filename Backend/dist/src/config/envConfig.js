const envConfig = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/myapp',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    SERVER_URL: process.env.BETTER_AUTH_URL || 'http://localhost:8000'
};
export default envConfig;
//# sourceMappingURL=envConfig.js.map