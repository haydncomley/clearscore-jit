import { OnError, OnInfo, OnSuccess } from '../core/display';
import { useGit } from '../core/git';
import { askConfirm, askQuestions, whichCommitMessage } from '../questions/questions';

export const ProcessQuickCommit = async () => {
    const git = useGit();

    if (!await git.hasOutStandingChanges()) {
        OnError('You don\'t have any outstanding changes to commit.');
    }

    await git.stage();

    OnInfo('All outstanding changes have been staged.');

    const { commitMessage } = await askQuestions([
        whichCommitMessage(),
    ]);

    if (!commitMessage)  process.exit(1);

    await git.quickCommit(commitMessage);
    
    if (await askConfirm('Do you also want to push?')) await git.quickPush();
    OnSuccess('Done');
};
