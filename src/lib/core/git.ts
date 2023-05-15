
import { OnError, OnInfo, OnSuccess } from './display';

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs';
import gitRepoInfo from 'git-repo-info';
import path from 'path';
import { GitError, SimpleGit, simpleGit, SimpleGitTaskCallback } from 'simple-git';

function gitPromise(git: SimpleGit, ...commands: string[]) {
    return new Promise<string>((res) => {
        const callback: SimpleGitTaskCallback<string, GitError> = (e, data) => {
            if (e) {
                console.error(e);
                OnError('Something went wrong with git.');
            }
            res(data);
        };

        git.raw(commands, callback);
    });
}

async function wrapGit(root: string, command: string) {
    try {
        await attachProcess(root, command);
    } catch {
        OnError('Something went wrong with git - check output for more details.');
    }
}

export function useGit(dir?: string) {
    const details = gitRepoInfo(dir || process.cwd());
    if (!details.root) return undefined;

    const git = simpleGit(details.root);

    const stage = () => wrapGit(details.root, 'git add .');
    const quickCommit = (message: string) => wrapGit(details.root, `git commit -m "${message}" --no-verify`);
    const fullCommit = async (type: string, product: string, message: string, ticket: string, isBreaking?: string) => {
        let command = `git commit -am "${type}(${product}): ${message}" -m "${ticket}"`;
        if (isBreaking) command += ` -m "BREAKING CHANGE: ${isBreaking}"`;
        await wrapGit(details.root, command);
    };
    const amendCommit = async (message: string, ticket: string, isBreaking?: string) => {
        OnInfo('Updating Ticket Info...');
        let command = `git commit --amend -am "${message}" -m "${ticket}"`;
        if (isBreaking) command += ` -m "BREAKING CHANGE: ${isBreaking}"`;
        await wrapGit(details.root, command);
        OnSuccess('Ticket Details Amended.', true);
    };
    const quickPush = (branch?: string) => wrapGit(details.root, `git push --set-upstream origin ${branch || details.branch} -f --no-verify`);
    const fullPush = (branch?: string) => wrapGit(details.root, `git push --set-upstream origin ${branch || details.branch} -f`);
    const clean = () => wrapGit(details.root, 'git reset --hard HEAD');
    const hasOutStandingChanges = async () => !(await gitPromise(git, 'status')).includes('nothing to commit, working tree clean');
    const changedFiles = async () => {
        const files = execSync('{ git diff --name-only ; git diff --name-only --staged ; } | sort | uniq').toString();
        return files.split('\n');
    };
    const createBranch = (branch: string) => wrapGit(details.root, `git checkout -b "${branch}"`);
    const fetch = () => wrapGit(details.root, 'git fetch');
    const branchName = async () => await gitPromise(git, 'rev-parse', '--abbrev-ref', 'HEAD');
    const autoRebase = async (message: string, ticket: string, isBreaking?: string) => {
        await rebase(message);
        await amendCommit(message, ticket, isBreaking);
    };
    const checkout = async (branch: string) => {
        await wrapGit(details.root, `git checkout ${branch}`);
    };
    const pull = async () => {
        await wrapGit(details.root, 'git pull');
    };
    const rebase = async (message: string) => {
        OnInfo('Rebasing...');
        const rebaseScript = path.join(__dirname, './lib/core/rebaseScript.sh');
        const nameFile = path.join(__dirname, './lib/core/jit-name-file.txt');
        if (existsSync(nameFile)) rmSync(nameFile);
        writeFileSync(nameFile, message);

        await wrapGit(details.root, `git fetch && GIT_SEQUENCE_EDITOR="${rebaseScript}" git rebase -i origin/master`);
        OnSuccess('Rebase Complete.', true);
    };

    return {
        amendCommit,
        autoRebase,
        branchName,
        changedFiles, 
        checkout,
        clean,
        createBranch,
        fetch,
        fullCommit,
        fullPush,
        hasOutStandingChanges,
        pull,
        quickCommit,
        quickPush,
        rebase,
        root: details.root,
        stage,
    };
}

export function attachProcess(root: string, command: string) {
    return new Promise<void>((res, rej) => {
        const spawnedProcess = spawn(command, {
            cwd: root,
            shell: true,
            stdio: 'inherit',
        });

        spawnedProcess.on('close', () => res());
        spawnedProcess.on('disconnect', () => res());
        spawnedProcess.on('exit', () => res());
        spawnedProcess.on('error', () => rej());
    });
}

export const findChangedPackages = async () => {
    const git = useGit();
    const fileChanges = await git.changedFiles();
    return [ ...findRelevantPackages(fileChanges), 'repo' ];
};

const findRelevantPackages = (files: string[]) => {
    const packages = new Set(files.map((file) => findRelevantPackageName(file)));
    return Array.from(packages).filter(Boolean).map((x) => {
        const split = x.split('/');
        return split.length === 1 ? split[0] : split[1];
    });
};

const findRelevantPackageName = (filePath: string) => {
    let foundPackage = '';
    let currentDir = path.dirname(filePath);
    let steps = 0;
    const maxSteps = 35;
    
    while (!foundPackage && steps < maxSteps) {
        const dirExists = existsSync(currentDir);
        if (!dirExists) break;
        const packageJson = path.join(currentDir, 'package.json');
        const packageJsonExists = existsSync(packageJson);
        if (packageJsonExists) foundPackage = JSON.parse(readFileSync(packageJson).toString()).name;
        else currentDir = path.join(currentDir, '../');
        steps++;
    }

    return foundPackage;
};
