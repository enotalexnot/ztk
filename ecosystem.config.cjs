module.exports = {
  apps: [{
    name: 'techcenter',
    script: 'tsx',
    args: 'server/index.ts',
    cwd: '/home/techcenter/app',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: 'postgresql://techuser:DCo%2FSKuH%2BREoblzyqPIhJ3O4vFROSG5RSi51SErFyF8%3D@localhost:5432/techcenter'
    },
    error_file: '/home/techcenter/logs/err.log',
    out_file: '/home/techcenter/logs/out.log',
    log_file: '/home/techcenter/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.git'],
    restart_delay: 1000
  }]
}
