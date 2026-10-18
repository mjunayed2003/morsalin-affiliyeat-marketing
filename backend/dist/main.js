import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
let cachedServer = null;
export async function createNestApp() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: true,
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