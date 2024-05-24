import { version } from '../../../package.json';

import { getGitRootDirName,useGit } from './git';

import chalk, { Chalk } from 'chalk';

export const DisplayBanner = ({
    title,
    message,
    color = chalk.magentaBright,
}: { title?: string; message: string; color?: Chalk }) => {
    const lines = message.split('\n');
    if (title) lines.unshift(title);

    const longest = Math.max(...lines.map(x => x.length));
    const padBy = 4;
    const horizontalBorder = '#';
    // const verticalBorder = Array(longest + (padBy * 2) + (horizontalBorder.length * 2)).fill('#').join('');
    // const lineBreak = horizontalBorder + Array(longest + (padBy * 2)).fill(' ').join('') + horizontalBorder + '\n';
    let output = '';

    lines.forEach((line, i) => {
        const leftPadding = Math.round((longest - line.length) / 2);
        const rightPadding = (longest - line.length) % 2 === 0 ? leftPadding : leftPadding - 1;
        const isHeader = i === 0;

        output +=   horizontalBorder + 
                    Array(padBy + leftPadding).fill(' ').join('') +
                    (isHeader ? chalk.bold(line) : line) +
                    Array(padBy + rightPadding).fill(' ').join('') +
                    horizontalBorder + '\n';
    });
    console.log(color(output));
};

export async function ClearAndDisplayBanner() {
    process.stdout.cursorTo(0, 0);
    process.stdout.clearScreenDown();

    const gitDetails = useGit();
    if (!gitDetails) OnError('Could not find a git repo.');

    const branchName = (await gitDetails.branchName()).trim();
    const isMainBranch = [ 'master', 'main', 'trunk' ].includes(branchName);

    DisplayBanner({
        color: chalk.green,
        message: `${getGitRootDirName()} @ ${branchName} ${ isMainBranch ? '🌳' : '🪵' }`,
        title: `🤠 Jit (${version}) 🎉`,
    });
}

export function OnSuccess(message: string, dontExit?: boolean) {
    console.log(chalk.greenBright(`${chalk.bold('[OK]')} ${message}`));
    if (!dontExit) process.exit(0);
}

export function OnError(message: string, dontExit?: boolean) {
    console.log(chalk.redBright(`${chalk.bold('[BAD]')} ${message}`));
    if (!dontExit) process.exit(1);
}

export function OnInfo(message: string) {
    console.log(chalk.blueBright(`${chalk.bold('[INFO]')} ${message}`));
}
