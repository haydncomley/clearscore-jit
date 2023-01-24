import gitRepoInfo from "git-repo-info";
import { GitError, SimpleGit, simpleGit, SimpleGitBase, SimpleGitTaskCallback } from "simple-git";

interface IGitDetails {
    branchName: string,
    root: string,
    stageAll: () => Promise<void>,
    commit: (message: string) => Promise<void>,
    push: (branch?: string) => Promise<void>,
}

function gitPromise(git: SimpleGit, ...commands: string[]) {
    return new Promise<void>((res) => {
        const callback: SimpleGitTaskCallback<string, GitError> = (e) => {
            if (e) {
                console.error(e);
                process.exit(1);
            }
            res();
        }

        git.raw(commands, callback);
    });
}

export function getGitDetails(dir?: string): IGitDetails | undefined  {
    const details = gitRepoInfo(dir || process.cwd());
    if (!details.root) return undefined;

    const git = simpleGit(details.root);

    const stageAll = async () => {
        // git add .
        await gitPromise(git, 'add', '.');
    }

    const commit = async (message: string) => {
        // git commit -m "{message}" --no-verify
        await gitPromise(git, 'commit', '-m', message, '--no-verify');
    }

    const push = async (branch?: string) => {
        // git push --set-upstream origin {branchName}
        await gitPromise(git, 'push', '--set-upstream', 'origin', (branch || details.branch), '--no-verify');
    }

    return {
        branchName: details.branch,
        root: details.root,
        commit,
        stageAll,
        push
    }
}