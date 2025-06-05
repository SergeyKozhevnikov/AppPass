"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET ?? 'testjwt';
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
        console.log('Токен отсутствует, пользователь не аутентифицирован');
        return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.sub ? Number.parseInt(decoded.sub, 10) : 0,
            username: decoded.name || '',
            role: decoded.role || 'user',
            email: decoded.email || '',
        };
        console.log('Пользователь аутентифицирован:', req.user);
        next();
    }
    catch (error) {
        console.error('Ошибка при проверке токена:', error);
        next();
    }
};
exports.authMiddleware = authMiddleware;
