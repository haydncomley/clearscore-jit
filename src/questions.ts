import chalk from 'chalk';
import prompts, { PromptObject } from 'prompts';
import { selectDirectory, selectFromList, selectTicketNumber } from './questions-primitives';

export async function askQuestions(questions: PromptObject<string>[]) {
    return await prompts(questions);
}

export function whichDevelopmentStage() {
    return selectFromList('developmentStage', 'What do you want to do?', [
        { title: `Quick Commit ${chalk.grey('(quickly push code while developing)')}`, value: 'commit'},
        { title: `Full Commit ${chalk.grey('(create a commit ready for a PR)')}`, value: 'commit'},
        { title: `Squash Changes ${chalk.grey('(compile all commits into one for a PR)')}`, value: 'rebase'},
        { title: `New Branch ${chalk.grey('(to develop a new feature/fix)')}`, value: 'branch'},
    ]);
}

export function whichCommitType() {
    return selectFromList('commitType', 'Commit Type', [
        { title: 'Feature', value: 'feature'},
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
        format: value => (value as string).toLowerCase()
    } as PromptObject;
}