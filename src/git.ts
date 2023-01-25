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
    autoRebase: (newMessage: string, ticket: string) => Promise<void>,
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
                console.log(chalk.red('-- GIT ERROR --'));
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
        if (!isBreaking) await gitPromise(git, 'commit', '-am', `${type}(${product}): ${message}`, '-m', ticket);
        else await gitPromise(git, 'commit', '-am', `${type}(${product}): ${message}`, '-m', ticket), '-m', `"BREAKING CHANGE: ${isBreaking}"`;
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

    
    const autoRebase = async (message: string, ticket: string, isBreaking?: string) => {
        // await gitPromise(git, 'config', 'pull.rebase', 'true');
        await completeAutoRebase(details.root, message);
        console.log(chalk.cyanBright('Rebase Complete.'));

        console.log(chalk.magentaBright('Updating Commit Message (this can take a minute because of NX/husky)...'));
        if (!isBreaking) await gitPromise(git, 'commit', '--amend', '-am', `${message}`, '-m', ticket);
        else await gitPromise(git, 'commit', '--amend', '-am', `${message}`, '-m', ticket), '-m', `"BREAKING CHANGE: ${isBreaking}"`;
        console.log(chalk.cyanBright('Update Complete.'));
        
        console.log(chalk.magentaBright('Syncing...'));
        await gitPromise(git, 'push', 'origin', `${details.branch}:${details.branch}`);
        console.log(chalk.cyanBright('Completed Syncing.'));
        // await gitPromise(git, 'pull', '--rebase', 'origin', 'master');
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
        console.log(chalk.magentaBright('Starting rebase...'));

        const rebaseScript = path.join(__dirname, './rebaseScript.sh');
        const nameFile = path.join(__dirname, './jit-name-file.txt');
        if (existsSync(nameFile)) rmSync(nameFile);
        writeFileSync(nameFile, newMessage);

        const rebaseProcess = spawn(`GIT_SEQUENCE_EDITOR="${rebaseScript}" yarn && git fetch && git rebase -i origin/master`, {
            shell: true,
            cwd: root,
            stdio: 'inherit'
        });
        
        rebaseProcess.on('exit', () => {
            res(true);
        });

        rebaseProcess.on('close', () => {
            res(true);
        });
    })
}