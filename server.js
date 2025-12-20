const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value && !key.startsWith('#')) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const PORT = process.env.PORT || '3000';
const command = process.argv[2] || 'dev';

const args = command === 'dev'
    ? ['next', 'dev', '--port', PORT]
    : ['next', 'start', '--port', PORT];

console.log(`Starting on port ${PORT}...`);

const child = spawn('npx', args, {
    stdio: 'inherit',
    shell: true
});

child.on('exit', (code) => {
    process.exit(code);
});
