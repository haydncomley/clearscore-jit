import { OnError, OnSuccess } from '../core/display';
import { useGit } from '../core/git';
import { askConfirm } from '../questions/questions';

export const ProcessRetroCommit = async () => {
    const git = useGit();

    if (!await git.hasOutStandingChanges()) {
        OnError('You don\'t have any outstanding changes to commit.');
    }

    const lastCommit = await git.findLastCommitDetails();
    if (!lastCommit.commitMessage || !lastCommit.ticket) {
        OnError('Your last commit was not a formatted one so you can\'t retro commit.');
    }

    await git.bringCommitBackToStaging();
    await git.stage();
    await git.retroCommit(lastCommit.commitMessage, lastCommit.ticket);
    
    if (await askConfirm('Do you also want to push?')) await git.quickPush();
    OnSuccess('Done');
};
