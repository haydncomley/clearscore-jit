import { selectConfirm, selectDirectory, selectFromList, selectTicketNumber } from '../../lib/questions/questions-primitives';
import { useGit } from '../core/git';

import chalk from 'chalk';
import prompts, { PromptObject } from 'prompts';

export async function askQuestions(questions: PromptObject<string>[]) {
    return await prompts(questions, { onCancel: () => process.exit(1) });
}

export async function askConfirm(message: string, initial = true) {
    const { confirm } = await askQuestions([
        selectConfirm('confirm', message, initial),
    ]);
    return confirm;
}

export function whichDevelopmentStage() {
    console.log('Hello');
    return selectFromList('developmentStage', 'What do you want to do?', [
        { title: `New Branch ${chalk.grey('(create a new branch)')}`, value: 'branchNew' },
        { title: `Formatted Commit ${chalk.grey('(create a commit ready for a PR)')}`, value: 'commitFull' },
        { title: `Quick Commit ${chalk.grey('(quickly push code while developing)')}`, value: 'commitQuick' },
        { title: `Auto Squish ${chalk.grey('(a semi-automated squash)')}`, value: 'squash' },
    ]);
}

export async function selectCommitType() {
    const git = useGit();
    const branchName = await git.branchName();
    const commitType = branchName.split('/')[0];
    if ([ 'fix', 'chore', 'feat' ].includes(commitType)) return commitType;
    else {
        const { commitType: commitTypeSelected } = await askQuestions([ whichCommitType() ]);
        return commitTypeSelected;
    }
}

export function whichCommitType() {
    return selectFromList('commitType', 'Commit Type', [
        { title: 'Feature', value: 'feat' },
        { title: 'Fix', value: 'fix' },
        { title: 'Chore', value: 'chore' },
    ]);
}

export function whichPackageJsonName(packages: string[]) {
    return selectFromList('packageJson', 'Select the main package changed', packages.map((x) => ({
        title: x,
        value: x,
    })));
}

export function whichDir() {
    return selectDirectory('dir', 'Select Dir');
}

export function whichJiraTicket() {
    return selectTicketNumber('jiraTicket', `Jira Ticket Number ${chalk.grey('(e.g. XX-1234)')}`);
}

export function whichPackageName() {
    return {
        format: (value: string) => value.toLowerCase().trim(),
        message: `Package/Update Name ${chalk.grey('(e.g. webapp.products)')}`,
        name: 'packageName',
        type: 'text',
        validate: (value: string) => value.length > 0 ? true : 'Please enter a package/update name',
    } as PromptObject;
}

const commitExamples = [
    'Squashed all the bugs 🐛',
    'Casually remade flux on the weekend',
    'Fixed y̶o̶u̶\'̶r̶e̶ your typos',
];

export function whichCommitMessage() {
    return {
        format: (value: string) => value.toLowerCase().trim(),
        message: `Commit Message ${chalk.grey(`(e.g. ${ commitExamples[Math.floor(Math.random() * commitExamples.length)] })`)}`,
        name: 'commitMessage',
        type: 'text',
        validate: (value: string) => {
            if (value.length < 1) return 'Please provide a commit message';
            return true;
        },
    } as PromptObject;
}

export function whichBreakingChangesMade() {
    return {
        message: `Breaking Changes ${chalk.grey('(if none leave blank)')}`,
        name: 'breakingChanges',
        type: 'text',
    } as PromptObject;
}

const branchExamples = [
    'flux-2',
    'clearscore-fix-final-new-2',
    'update-eslint',
    'yet-another-ts-migration',
];

export function whichBranchName() {
    return {
        format: (value: string) => value.trim().toLowerCase().replaceAll(' ', '-'),
        message: `Branch Name ${chalk.grey(`(e.g. ${ branchExamples[Math.floor(Math.random() * branchExamples.length)] })`)}`,
        name: 'branchName',
        type: 'text',
        validate: (value: string) => {
            const regex = /^[a-zA-Z0-9-]+$/;
            return (value.match(regex)) ? true : 'Branch has to be kebab-case';
        },
    } as PromptObject;
}
