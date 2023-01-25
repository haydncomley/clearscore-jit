import chalk from "chalk";
import { spawn } from "child_process";
import { existsSync, readFileSync, readSync, rmSync, writeFileSync } from "fs";
import gitRepoInfo from "git-repo-info";
import path from "path";
import { GitError, SimpleGit, simpleGit, SimpleGitBase, SimpleGitTaskCallback } from "simple-git";
import treeKill from "tree-kill";

interface IGitDetails {
    branchName: string,
    root: string,
    fetch: () => Promise<void>,
    autoRebase: (newMessage: string) => Promise<void>,
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

    
    const autoRebase = async (message: string) => {
        await completeAutoRebase(details.root, message);
        // await gitPromise(git, 'rebase', '--continue');
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
        autoRebase
    }
}

function completeAutoRebase(root: string, newMessage: string) {
    return new Promise<boolean>((res) => {
        console.log(path.join(__dirname, './rebaseScript.sh'));
        console.log('Starting rebase');

        const rebaseProcess = spawn(`GIT_SEQUENCE_EDITOR="${path.join(__dirname, './rebaseScript.sh')}" git rebase -i origin/master`, {
            shell: true,
            cwd: root
        });
        
        rebaseProcess.stdout.on('data', (data) => {
            console.log('CMD: ' + data.toString());
        })
        rebaseProcess.stderr.on('data', (data) => {
            if (data.toString().includes('You have unstaged changes')) {
                console.error(chalk.red('You have unstaged changes. Make sure you commit or stash before trying to rebase.'));
            } else {
                console.error(data.toString());
            }
            process.exit(1);
        })
    })
}