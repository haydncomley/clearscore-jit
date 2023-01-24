import chalk from 'chalk';
import prompts, { PromptObject } from 'prompts';
import { selectConfirm, selectDirectory, selectFromList, selectTicketNumber } from './questions-primitives';

export async function askQuestions(questions: PromptObject<string>[]) {
    return await prompts(questions);
}

export async function askConfirm(message: string, initial = true) {
    const { confirm } = await askQuestions([
        selectConfirm('confirm', message, initial)
    ]);
    return confirm;
}

export function whichDevelopmentStage() {
    return selectFromList('developmentStage', 'What do you want to do?', [
        { title: `Quick Commit ${chalk.grey('(quickly push code while developing)')}`, value: 'commitQuick'},
        { title: `Full Commit ${chalk.grey('(create a commit ready for a PR)')}`, value: 'commitFull'},
        { title: `Squash Changes ${chalk.grey('(compile all commits into one for a PR)')}`, value: 'squash'},
        { title: `New Branch ${chalk.grey('(to develop a new feature/fix)')}`, value: 'branchNew'},
    ]);
}

export function whichCommitType() {
    return selectFromList('commitType', 'Commit Type', [
        { title: 'Feature', value: 'feat'},
        { title: 'Fix', value: 'fix'},
        { title: 'Chore', value: 'chore'},
    ]);
}

export function whichDir() {
    return selectDirectory('dir', 'Select Dir');
}

export function whichJiraTicket() {
    return selectTicketNumber('jiraTicket', `Jira Ticket Number ${chalk.grey('(e.g. XX-1234)')}`);
}

export function whichPackageName() {
    return {
        type: 'text',
        name: 'packageName',
        message: `Package/Update Name ${chalk.grey('(e.g. webapp.products)')}`,
        format: (value: string) => value.toLowerCase().trim()
    } as PromptObject;
}

const commitExamples = [
    'Squashed some bugs 🐛',
    'Remade flux on the weekend',
    'Fixed y̶o̶u̶r̶ typos',
]

export function whichCommitMessage() {
    return {
        type: 'text',
        name: 'commitMessage',
        message: `Commit Message ${chalk.grey(`(e.g. ${ commitExamples[Math.floor(Math.random() * commitExamples.length)] })`)}`,
        format: (value: string) => value.toLowerCase().trim(),
        validate: (value: string) => {
            if (value.length < 1) return 'Please provide a commit message'
            return true;
        }
    } as PromptObject;
}

export function whichBreakingChangesMade() {
    return {
        type: 'text',
        name: 'breakingChanges',
        message: `Breaking Changes ${chalk.grey(`(if none leave blank)`)}`,
    } as PromptObject;
}

const branchExamples = [
    'flux-2',
    'clearscore-fix-final-new-3-2023',
    'update-eslint',
]

export function whichBranchName() {
    return {
        type: 'text',
        name: 'branchName',
        message: `Branch Name ${chalk.grey(`(e.g. ${ branchExamples[Math.floor(Math.random() * branchExamples.length)] })`)}`,
        format: (value: string) => value.trim().toLowerCase().replaceAll(' ', '-'),
        validate: (value: string) => {
            const regex = /^[a-zA-Z0-9-]+$/;
            return (!!value.match(regex)) ? true : 'Invalid Branch Format';
        },
    } as PromptObject;
}