import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import express from 'express';
let cachedServer = null;
export async function createNestApp() {
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    const allowedOrigins = [
        'https://freeproducts.online',
        'https://www.freeproducts.online',
        'http://localhost:3000',
        'http://localhost:3001',
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/+$/, '')] : []),
        ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()) : []),
    ];
    app.enableCors({
        origin: (requestOrigin, callback) => {
            if (!requestOrigin)
                return callback(null, true);
            if (allowedOrigins.includes(requestOrigin) ||
                requestOrigin.endsWith('.freeproducts.online') ||
                process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            return callback(new Error('Cross-Origin Request Blocked by Security Policy'), false);
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    return app;
}
export default async function handler(req, res) {
    if (!cachedServer) {
        const app = await createNestApp();
        await app.init();
        cachedServer = app.getHttpAdapter().getInstance();
    }
    return cachedServer(req, res);
}
if (!process.env.VERCEL) {
    const app = await createNestApp();
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 NestJS server running on: http://localhost:${port}/api`);
}
//# sourceMappingURL=main.js.map