module.exports = {
   apps: [{
     name: 'main',
     script: 'main.js', // Replace with the entry point file of your application
     args: [],
     instances: 1,
     autorestart: true,
     watch: false,
     max_memory_restart: '2G', // Set the maximum memory PM2 will allow for your application
     env: {
       NODE_ENV: 'production'
     },
     node_args: ['--max-old-space-size=8192'], // Set the heap memory size for Node.js
   }]
 };