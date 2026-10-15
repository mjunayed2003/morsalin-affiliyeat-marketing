var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { InquiriesController } from './inquiries.controller.js';
import { InquiriesService } from './inquiries.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
let InquiriesModule = class InquiriesModule {
};
InquiriesModule = __decorate([
    Module({
        imports: [PrismaModule],
        controllers: [InquiriesController],
        providers: [InquiriesService],
        exports: [InquiriesService],
    })
], InquiriesModule);
export { InquiriesModule };
//# sourceMappingURL=inquiries.module.js.map