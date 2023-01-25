import fs from 'fs';
import os from 'os';

const gitTodoFile = process.argv[2];
const gitData = fs.readFileSync(gitTodoFile).toString();

const lines = gitData.split(os.EOL);

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (i === 0) {
        lines[i] = line.replace('pick', 'reword');
    } else {
        lines[i] = line.replace('pick', 'fixup');
    }
}

fs.writeFileSync(gitTodoFile, lines.join(os.EOL));

console.log('Done :)');
process.exit(0);