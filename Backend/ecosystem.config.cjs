module.exports = {
    apps: [
      {
        name: 'drfayaz-backend',
        script: './index.js',
        watch: false,
        env: {
          NODE_ENV: 'production',
          PORT: 8800,
          MONGO_URL: 'mongodb://admin:DrFayaz99@127.0.0.1:27017/DrFayazDB?authSource=admin',
          SENDGRID_API_KEY: 'your_sendgrid_key_here'
        }
      }
    ]
  };
  