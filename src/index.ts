import chalk from 'chalk';
import { checkDevelopmentStage } from './dev';
import { getGitDetails } from './git';

async function run() {
    process.stdout.cursorTo(0, 0);
    process.stdout.clearScreenDown();

    const gitDetails = getGitDetails();
    if (!gitDetails) {
        console.log(chalk.yellow(chalk.bold('This directory doesn\'t contain a git repo.')))
        process.exit(1);
    }

    console.log(chalk.magentaBright(`${chalk.bold('Targeted Dir:')} ${gitDetails.root}`))

    await checkDevelopmentStage();
    
    // const responses = await askQuestions([
    //     whichDevelopmentStage(),
    //     whichCommitType(),
    //     whichPackageName(),
    //     whichJiraTicket(),
    //     whichDir()
    // ]);
    // console.log(responses);
}

run();