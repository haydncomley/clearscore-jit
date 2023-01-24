import gitRepoInfo from "git-repo-info";
import { GitError, SimpleGit, simpleGit, SimpleGitBase, SimpleGitTaskCallback } from "simple-git";

interface IGitDetails {
    branchName: string,
    root: string,
    fetch: () => Promise<void>,
    rebase: () => Promise<void>,
    clean: () => Promise<void>,
    newBranch: (branch: string) => Promise<void>,
    stageAll: () => Promise<void>,
    commit: (message: string) => Promise<void>,
    commitWithDetails: (type: string, product: string, message: string, ticket: string, isBreaking?: string) => Promise<void>,
    push: (branch?: string) => Promise<void>,
    quickPush: (branch?: string) => Promise<void>,
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
        await gitPromise(git, 'add', '.');
    }

    const commit = async (message: string) => {
        await gitPromise(git, 'commit', '-m', message, '--no-verify');
    }

    const commitWithDetails = async (type: string, product: string, message: string, ticket: string, isBreaking?: string) => {
        if (!isBreaking) await gitPromise(git, 'commit', '-am', `"${type}(${product}): ${message}"`, '-m', ticket);
        else await gitPromise(git, 'commit', '-am', `"${type}(${product}): ${message}"`, '-m', ticket), '-m', `"BREAKING CHANGE: ${isBreaking}"`;
    }
    
    const quickPush = async (branch?: string) => {
        await gitPromise(git, 'push', '--set-upstream', 'origin', (branch || details.branch), '--no-verify');
    }

    const push = async (branch?: string) => {
        await gitPromise(git, 'push', '--set-upstream', 'origin', (branch || details.branch));
    }
    
    const clean = async () => {
        await gitPromise(git, 'reset', '--hard', 'HEAD');
    }

    const newBranch = async (branch: string) => {
        await gitPromise(git, 'checkout', '-b', branch);
    }

    const fetch = async () => {
        await gitPromise(git, 'fetch');
    }

    const rebase = async () => {
        await gitPromise(git, 'rebase', 'origin/master');
    }

    return {
        branchName: details.branch,
        root: details.root,
        newBranch,
        clean,
        stageAll,
        commit,
        commitWithDetails,
        push,
        quickPush,
        fetch,
        rebase
    }
}