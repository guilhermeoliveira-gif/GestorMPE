console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
const path = require('path');
console.log('Resolved src:', path.resolve(__dirname, 'src'));
