require('dotenv').config();
module.exports = {
	apps: [
		{
			name: 'webapp',
			cwd: '.',
			script: 'node',
			args: 'node_modules/next/dist/bin/next start -p 3000',
			exec_mode: 'fork',
			max_memory_restart: '500M',
			autorestart: true,
			log_date_format: 'DD-MM HH:mm',
			env: process.env,
		},
		{
			name: 'worker',
			cwd: '_worker',
			script: 'node',
			args: 'dist/index.js',
			exec_mode: 'fork',
			max_memory_restart: '500M',
			autorestart: true,
			log_date_format: 'DD-MM HH:mm',
			env: process.env,
		},
	],
};
