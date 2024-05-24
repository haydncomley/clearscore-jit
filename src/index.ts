
import { ClearAndDisplayBanner } from './lib/core/display';
import { ProcessAutoSquash } from './lib/processes/autoSquash.process';
import { ProcessBackToMaster } from './lib/processes/backToMaster.process';
import { ProcessFormattedCommit } from './lib/processes/formattedCommit.process';
import { ProcessNewBranch } from './lib/processes/newBranch.process';
import { ProcessQuickCommit } from './lib/processes/quickCommit.process';
import { ProcessRetroCommit } from './lib/processes/retroCommit.process';
import { askConfirm, askQuestions, whichDevelopmentStage } from './lib/questions/questions';

import chalk from 'chalk';

async function run() {
    await ClearAndDisplayBanner();

    const { developmentStage } = await askQuestions([
        whichDevelopmentStage(),
    ]);

    switch (developmentStage) {
    case 'commitQuick':
        await ProcessQuickCommit();
        break;
    case 'commitFull':
        await ProcessFormattedCommit();
        break;
    case 'commitRetro':
        await ProcessRetroCommit();
        break;
    case 'squash':
        await ProcessAutoSquash();
        break;
    case 'branchNew':
        await ProcessNewBranch();
        break;
    case 'checkoutMaster':
        await ProcessBackToMaster();
        break;
    case 'shareJit':
        console.log(`\nInstall -> ${chalk.bgBlack(chalk.greenBright(' npm install -g --save https://github.com/haydncomley/clearscore-jit/tarball/master '))}\n`);
        break;
    case 'test':
        console.log('ECHO ECHO ecHO echO echo...');
        break;
    }

    const wantsToRerun = await askConfirm('Jit Again?', true);
    if (wantsToRerun) run();
}

run();
