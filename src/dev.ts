import { simpleGit } from "simple-git";
import { getGitDetails } from "./git";
import { askConfirm, askQuestions, whichCommitMessage, whichDevelopmentStage } from "./questions";

export async function checkDevelopmentStage() {
    const { developmentStage } = await askQuestions([
        whichDevelopmentStage(),
    ]);

    switch(developmentStage) {
        case 'commitQuick':
            await doQuickCommit();
            break;
        case 'commitFull':
            break;
        case 'squash':
            break;
        case 'branchNew':
            break;
    }
}

async function doQuickCommit() {
    const git = getGitDetails();
    const { commitMessage } = await askQuestions([
        whichCommitMessage(),
    ]);

    const shouldAddAll = await askConfirm('Add any outstanding changes to commit?');
    if(shouldAddAll) await git.stageAll();
    await git.commit(commitMessage);
    
    const shouldPush = await askConfirm('Do you also want to push?');
    if (shouldPush) await git.push()

}