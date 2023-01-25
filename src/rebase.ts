import fs from 'fs';
import os from 'os';
import path from 'path';

const gitTodoFile = process.argv[2];
const gitData = fs.readFileSync(gitTodoFile).toString();

const commitMessage = fs.readFileSync(path.join(__dirname, './jit-name-file.txt')).toString().trim();

const lines = gitData.split(os.EOL);

if (lines[0].startsWith('pick')) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (i === 0) {
            lines[0] = `pick ${lines[0].slice(5, 12)} ${commitMessage}`
        } else {
            lines[i] = line.replace('pick', 'fixup');
        }
    }
}

fs.writeFileSync(gitTodoFile, lines.join(os.EOL));
process.exit(0);