import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getSystemInfo() {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      pid: process.pid,
      timestamp: new Date().toISOString(),
    };
  }
}
