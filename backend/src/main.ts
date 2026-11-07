import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import type { Express } from 'express';
import type { INestApplication } from '@nestjs/common';

import express from 'express';

let cachedServer: Express | null = null;

export async function createNestApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Allow up to 50MB for rich media & base64 product images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Enable CORS with restricted origin validation
  const allowedOrigins = [
    'https://freeproducts.online',
    'https://www.freeproducts.online',
    'http://localhost:3000',
    'http://localhost:3001',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/+$/, '')] : []),
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()) : []),
  ];

  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (e.g. mobile apps, server-to-server, or same-origin)
      if (!requestOrigin) return callback(null, true);
      if (
        allowedOrigins.includes(requestOrigin) ||
        requestOrigin.endsWith('.freeproducts.online') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error('Cross-Origin Request Blocked by Security Policy'), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global API route prefix
  app.setGlobalPrefix('api');

  return app;
}

// Serverless handler for Vercel deployment
export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    const app = await createNestApp();
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance() as Express;
  }
  return cachedServer(req, res);
}

// Standalone execution for local development and containerized hosting
if (!process.env.VERCEL) {
  const app = await createNestApp();
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 NestJS server running on: http://localhost:${port}/api`);
}

