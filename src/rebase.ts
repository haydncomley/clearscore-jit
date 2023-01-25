import fs from 'fs';
import os from 'os';
import path from 'path';

const gitTodoFile = process.argv[2];
const nameFile = path.join(__dirname, './jit-name-file')

const gitData = fs.readFileSync(gitTodoFile).toString();
const nameData = fs.readFileSync(nameFile).toString().trim();

const lines = gitData.split(os.EOL);

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (i === 0) {
        lines[i] = line.replace('pick', 'reword');
    } else {
        lines[i] = line.replace('pick', 'fixup');
    }
}

console.log('Done :)');
process.exit(0);