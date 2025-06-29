module.exports = {
  apps: [
    {
      name: 'RPS-Ai-GraphQL-BE',
      script: 'dist/main.js',
      instances: 'max', // Auto-scale based on CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        APP_PORT: 3005,
      },
      env_development: {
        NODE_ENV: 'development',
        APP_PORT: 3005,
      },
      env_production: {
        NODE_ENV: 'production',
        APP_PORT: 3005,
      },
      // Logging configuration
      log_file: 'logs/combined.log',
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Monitoring and restart policies
      min_uptime: '10s',
      max_restarts: 10,
      
      // Performance tuning
      node_args: '--max-old-space-size=4096',
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_interval: 30000,
    },
  ],
  
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/rps-ai-js.git',
      path: '/var/www/rps-ai-js',
      'post-deploy':
        'npm install && npm run build && pm2 restart ecosystem.config.js --env production',
    },
  },
};
