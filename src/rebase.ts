import fs from 'fs';
import os from 'os';
import path from 'path';


const gitTodoFile = process.argv[2];
const gitData = fs.readFileSync(gitTodoFile).toString();

console.log('EDITING:: ' + gitTodoFile);

const lines = gitData.split(os.EOL);

if (lines[0].startsWith('pick')) {
    console.log('FIRST STEP');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (i === 0) {
            lines[i] = line.replace('pick', 'reword');
        } else {
            lines[i] = line.replace('pick', 'fixup');
        }
    }
} else {
    console.log('NOW RENAME');
    const commitMessage = fs.readFileSync(path.join(__dirname, './jit-name-file.txt')).toString().trim();
    lines[0] = commitMessage;
}


fs.writeFileSync(gitTodoFile, lines.join(os.EOL));

console.log('Done :)');
process.exit(0);