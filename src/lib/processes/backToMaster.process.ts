import { OnSuccess } from '../core/display';
import { useGit } from '../core/git';
import { askConfirm } from '../questions/questions';

export const ProcessBackToMaster = async () => {
    const git = useGit();

    if (await git.hasOutStandingChanges()) {
        const keepEdits = await askConfirm('Do you want to try and keep your outstanding changes?', true);
        if (!keepEdits) await git.clean();
    }

    try {
        await git.checkout('master');
    } catch {
        await git.checkout('main');
    }

    await git.pull();
    OnSuccess('Done');
};
