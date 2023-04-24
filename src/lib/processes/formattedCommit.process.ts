import { OnError, OnInfo, OnSuccess } from '../core/display';
import { findChangedPackages, useGit } from '../core/git';
import { askConfirm, askQuestions, whichBreakingChangesMade, whichCommitMessage, whichJiraTicket, whichPackageJsonName } from '../questions/questions';

export const ProcessFormattedCommit = async () => {
    const git = useGit();

    if (!await git.hasOutStandingChanges()) {
        OnError('You don\'t have any outstanding changes to commit.');
    }

    await git.stage();

    OnInfo('All outstanding changes have been staged.');
    const branchName = await git.branchName();
    const commitType = branchName.split('/')[0];
    const packageOptions = await findChangedPackages();

    const {
        packageJson, 
        jiraTicket, 
        commitMessage, 
        breakingChanges, 
    } = await askQuestions([
        whichPackageJsonName(packageOptions),
        whichJiraTicket(),
        whichCommitMessage(),
        whichBreakingChangesMade(),
    ]);

    if (!commitType || !packageJson || !commitMessage || !jiraTicket)  process.exit(1);

    await git.fullCommit(commitType, packageJson, commitMessage, jiraTicket, breakingChanges);
    
    if (await askConfirm('Do you also want to push?')) await git.fullPush();
    OnSuccess('Done');
};
