import { OnSuccess } from '../core/display';
import { useGit } from '../core/git';
import { askConfirm, askQuestions, whichBranchName,whichCommitType } from '../questions/questions';

import chalk from 'chalk';

export const ProcessNewBranch = async () => {
    const git = useGit();

    if (await git.hasOutStandingChanges()) {
        const keepEdits = await askConfirm('Do you want to keep your outstanding changes?', true);
        if (!keepEdits) await git.clean();
    }

    const {
        commitType, 
        branchName, 
    } = await askQuestions([
        whichCommitType(),
        whichBranchName(),
    ]);

    if (!commitType || !branchName)  process.exit(1);
    
    const newBranchName = `${commitType}/${branchName}`;
    await git.createBranch(newBranchName);
    OnSuccess(`Branch "${chalk.bold(newBranchName)}" created.`);
};
