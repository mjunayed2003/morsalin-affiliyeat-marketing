import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { InquiriesService } from './inquiries.service.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  async create(@Body() dto: CreateInquiryDto) {
    return this.inquiriesService.create(dto);
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.inquiriesService.findAll(userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: any,
  ) {
    return this.inquiriesService.updateStatus(id, status);
  }
}
