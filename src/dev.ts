import chalk from "chalk";
import { simpleGit } from "simple-git";
import { fileURLToPath } from "url";
import { getGitDetails } from "./git";
import { askConfirm, askQuestions, whichBranchName, whichBreakingChangesMade, whichCommitMessage, whichCommitType, whichDevelopmentStage, whichJiraTicket, whichPackageName } from "./questions";

function done() {
    console.log(chalk.greenBright('Done!'));
    process.exit(0);
}

// test

export async function checkDevelopmentStage() {
    const { developmentStage } = await askQuestions([
        whichDevelopmentStage(),
    ]);

    switch(developmentStage) {
        case 'commitQuick':
            await doQuickCommit();
            break;
        case 'commitFull':
            await doFullCommit();
            break;
        case 'squash':
            await doSquash();
            break;
        case 'branchNew':
            await doNewBranch();
            break;
    }
}

async function doQuickCommit() {
    const git = getGitDetails();

    const shouldAddAll = await askConfirm('Add any outstanding changes to commit?');
    if(shouldAddAll) await git.stageAll();
    
    const { commitMessage } = await askQuestions([
        whichCommitMessage(),
    ]);

    if (!commitMessage)  process.exit(1);
    
    await git.commit(commitMessage);
    
    const shouldPush = await askConfirm('Do you also want to push?');
    if (shouldPush) await git.quickPush()
    done();
}

async function doFullCommit() {
    const git = getGitDetails();

    const shouldAddAll = await askConfirm('Add any outstanding changes to commit?');
    if(shouldAddAll) await git.stageAll();

    const { commitMessage, commitType, jiraTicket, packageName, breakingChanges } = await askQuestions([
        whichCommitType(),
        whichJiraTicket(),
        whichPackageName(),
        whichCommitMessage(),
        whichBreakingChangesMade()
    ]);

    if (!commitType || !packageName || !commitMessage || !jiraTicket)  process.exit(1);

    await git.commitWithDetails(commitType, packageName, commitMessage, jiraTicket, breakingChanges);
    
    const shouldPush = await askConfirm('Do you also want to push?');
    if (shouldPush) await git.push()
    done();
}

async function doNewBranch() {
    const git = getGitDetails();
    
    const removeAllEdits = await askConfirm('Clean all outstanding changes?', false);
    if (removeAllEdits) await git.clean();

    const { commitType, branchName } = await askQuestions([
        whichCommitType(),
        whichBranchName(),
    ]);

    if (!commitType || !branchName)  process.exit(1);
    
    await git.newBranch(`${commitType}/${branchName}`);
    done();
}

async function doSquash() {
    const git = getGitDetails();

    const { commitMessage, commitType, packageName, jiraTicket } = await askQuestions([
        whichCommitType(),
        whichJiraTicket(),
        whichPackageName(),
        whichCommitMessage(),
    ]);

    if (!commitType || !packageName || !commitMessage || !jiraTicket)  process.exit(1);

    const newMessage = `${commitType}(${packageName}): ${commitMessage}`;

    await git.autoRebase(newMessage, jiraTicket);
    done();
}