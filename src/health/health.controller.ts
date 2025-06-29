import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.version,
    };
  }

  @Get('ready')
  readiness() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        mongodb: 'connected',
        api: 'operational',
      },
    };
  }

  @Get('live')
  liveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      pid: process.pid,
      memory: process.memoryUsage(),
    };
  }

  @Get('info')
  info() {
    return this.healthService.getSystemInfo();
  }
}
