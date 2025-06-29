# RPS AI - Intelligent Academic Planning System

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">RPS AI - Intelligent Academic Planning System</p>
<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## 🚀 Features

- **AI-Powered Content Generation**: Generate academic materials using OpenAI GPT models
- **Multi-Database Support**: PostgreSQL, MySQL, and MongoDB integration
- **Real-time GraphQL API**: Efficient data fetching with GraphQL subscriptions
- **Advanced Caching**: In-memory and Redis caching for optimal performance
- **Rate Limiting**: Intelligent request throttling for API protection
- **Comprehensive Logging**: Structured logging with MongoDB storage
- **Health Monitoring**: Built-in health checks and performance monitoring
- **Security First**: JWT authentication, CORS, and security headers
- **Docker Ready**: Production-ready containerization
- **Load Balancing**: Nginx configuration for high availability

## 📋 Prerequisites

- Node.js 18.x or higher
- PostgreSQL 12.x or higher
- MySQL/MariaDB 8.x or higher
- MongoDB 6.x or higher
- Redis 7.x (optional, for advanced caching)

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd rps-ai-js

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Configure your environment variables in .env file
```

## ⚙️ Configuration

Update your `.env` file with appropriate values:

```env
# Application
APP_PORT=3005
APP_HOST=0.0.0.0
ALLOWED_ORIGINS=http://localhost:3000

# Databases
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=rps_ai_db

SIMAK_MYSQL_HOST=localhost
SIMAK_MYSQL_PORT=3306
SIMAK_MYSQL_USER=simak_user
SIMAK_MYSQL_PASSWORD=password
SIMAK_MYSQL_DATABASE=simak_db

LOGGER_MONGO_URI=mongodb://localhost:27017/rps_ai_logs

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
```

## 🚀 Running the Application

### Development Mode

```bash
# Watch mode
npm run start:dev

# Debug mode
npm run start:debug
```

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod

# Or use PM2 for process management
npm run start:pm2
```

### Docker Deployment

```bash
# Build and run with Docker Compose
npm run docker:compose:up

# View logs
npm run docker:compose:logs

# Stop services
npm run docker:compose:down
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## 📊 Performance Optimizations

### 1. **Caching Strategy**

- **Settings Caching**: Frequently accessed settings are cached for 5 minutes
- **Response Caching**: GraphQL responses cached where appropriate
- **Database Connection Pooling**: Optimized connection management

### 2. **Rate Limiting**

- **AI Generation**: 10 requests per minute per user
- **General API**: 100 requests per minute per user
- **Short burst**: 3 requests per second

### 3. **Database Optimizations**

- **Connection Retry Logic**: Exponential backoff for failed connections
- **Connection Pooling**: Configured pool sizes for optimal performance
- **Query Optimization**: Indexed queries and batch operations

### 4. **Logging Optimizations**

- **Batch Logging**: Logs are batched and flushed every 5 minutes
- **Structured Logging**: JSON format for better analysis
- **Log Rotation**: Automatic cleanup of old logs

## 🏥 Health Monitoring

Access health endpoints:

- **General Health**: `GET /health`
- **Readiness Check**: `GET /health/ready`
- **Liveness Check**: `GET /health/live`

## 🔒 Security Features

- **JWT Authentication**: Secure user authentication
- **Rate Limiting**: Protect against abuse
- **CORS Configuration**: Cross-origin request handling
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Security middleware enabled

## 📈 Monitoring & Observability

### Performance Interceptors

- **Response Time Monitoring**: Track slow operations (>1s)
- **Error Tracking**: Comprehensive error logging
- **Usage Statistics**: User activity monitoring

### GraphQL Performance

- **Query Complexity Analysis**: Prevent expensive queries
- **Caching Strategy**: Cache frequent queries
- **Batch Operations**: Reduce database round trips

## 🐳 Docker & Production

### Production Docker Build

- **Multi-stage Build**: Optimized image size
- **Non-root User**: Security best practices
- **Health Checks**: Container health monitoring

## 📖 API Documentation

### GraphQL Playground

Access GraphQL playground at: `http://localhost:3005/graphql`

### Key Mutations

```graphql
# Generate academic material
mutation {
  GenerateBahanAjarBase(
    input: {
      namaMataKuliah: "Pemrograman Web"
      kodeMataKuliah: "TIF101"
      sks: 3
    }
  ) {
    id
    title
    content
  }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Check database services are running
   - Verify connection strings in `.env`
   - Check firewall settings

2. **OpenAI API Errors**

   - Verify API key is valid
   - Check rate limits
   - Monitor token usage

3. **Memory Issues**
   - Increase Node.js heap size: `--max-old-space-size=4096`
   - Monitor memory usage in logs
   - Check for memory leaks

## 🚀 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring tools configured
- [ ] Backup procedures in place
- [ ] Load balancer configured
- [ ] Health checks working

### PM2 Deployment

```bash
# Start with PM2
npm run start:pm2

# Monitor processes
npm run logs:pm2

# Restart if needed
npm run restart:pm2
```

## 📄 License

This project is licensed under the UNLICENSED License.

---

**Happy Coding! 🎉**
