import { OnInfo, OnSuccess } from '../core/display';
import { findChangedPackages, useGit } from '../core/git';
import { askConfirm, askQuestions, selectCommitType, whichCommitMessage, whichJiraTicket, whichPackageJsonName } from '../questions/questions';

export const ProcessAutoSquash = async () => {
    const git = useGit();

    if (await git.hasOutStandingChanges()) {
        if (await askConfirm('You have un–committed changes, quickly push them to continue with rebase?')) {
            await git.stage();
            OnInfo('All outstanding changes have been staged.');
            await git.quickCommit('Jit - Changes Temp Commit');
        }
        else process.exit(0);
    }

    const lastCommit = await git.findLastCommitDetails();
    let message = lastCommit.commitMessage;
    const ticket = lastCommit.ticket;

    if (!lastCommit.commitMessage || !lastCommit.ticket) {
        const commitType = await selectCommitType();
        const packageOptions = await findChangedPackages();
    
        const {
            commitMessage, 
            packageJson, 
            jiraTicket, 
        } = await askQuestions([
            whichJiraTicket(),
            whichPackageJsonName(packageOptions),
            whichCommitMessage(),
        ]);
        // OnError('Your last commit was not a formatted one so you can\'t retro commit.');
        if (!commitType || !packageJson || !commitMessage || !jiraTicket) process.exit(1);
        message = `${commitType}(${packageJson}): ${commitMessage}`;
    }

    await git.autoRebase(message, ticket);

    if (await askConfirm('Do you also want to force push?')) {
        await git.fullPush();
        OnSuccess('Done');
    } else OnInfo('Force push commit with: git push -f');
};
