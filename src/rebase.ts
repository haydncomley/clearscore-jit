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
    if (line === '') {
        console.log('Done.');
        continue;
    } else if (i === 0) {
        const lineSplit = line.split(' ');
        lines[i] = `${lineSplit[0]} ${lineSplit[1]} ${nameData}`;
    } else {
        lines[i] = line.replace('pick', 'fixup');
    }
}

fs.writeFileSync(gitTodoFile, lines.join(os.EOL));
console.log(lines.join(os.EOL));
process.exit(0);