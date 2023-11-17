import { version } from '../package.json';

import { DisplayBanner, OnError } from './lib/core/display';
import { useGit } from './lib/core/git';
import { ProcessAutoSquash } from './lib/processes/autoSquash.process';
import { ProcessBackToMaster } from './lib/processes/backToMaster.process';
import { ProcessFormattedCommit } from './lib/processes/formattedCommit.process';
import { ProcessNewBranch } from './lib/processes/newBranch.process';
import { ProcessQuickCommit } from './lib/processes/quickCommit.process';
import { ProcessRetroCommit } from './lib/processes/retroCommit.process';
import { askConfirm, askQuestions, whichDevelopmentStage } from './lib/questions/questions';

import chalk from 'chalk';

async function run() {
    process.stdout.cursorTo(0, 0);
    process.stdout.clearScreenDown();
    
    const gitDetails = useGit();
    if (!gitDetails) OnError('Could not find a git repo.');

    DisplayBanner({
        color: chalk.green,
        message: `${gitDetails.root} @ ${await gitDetails.branchName()}`,
        title: `Jit (${version})`,
    });

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
    case 'test':
        console.log('ECHO ECHO ecHO echO echo...');
        break;
    }

    const wantsToRerun = await askConfirm('Jit Again?', true);
    if (wantsToRerun) run();
}

run();
