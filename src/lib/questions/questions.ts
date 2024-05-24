import { selectConfirm, selectDirectory, selectFromList, selectTicketNumber } from '../../lib/questions/questions-primitives';
import { useGit } from '../core/git';
import { IsTesting } from '../core/test';

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
    return selectFromList('developmentStage', 'What do you want to do?', [
        { title: `${chalk.cyanBright('Branch - ✨ New ')}${chalk.grey('(create a new branch)')}`, value: 'branchNew' },
        { title: `${chalk.magentaBright('Commit - 📝 Formatted ')}${chalk.grey('(create a commit ready for a PR)')}`, value: 'commitFull' },
        { title: `${chalk.magentaBright('Commit - 🔄 Retro ')}${chalk.grey('(force push current changes on-top of the last commit)')}`, value: 'commitRetro' },
        { title: `${chalk.magentaBright('Commit - 🧪 Dev ')}${chalk.grey('(quickly push code while developing)')}`, value: 'commitQuick' },
        { title: `${chalk.greenBright('Other  - 🐛 Squish  ')}${chalk.grey('(a semi-automated squash with master)')}`, value: 'squash' },
        { title: `${chalk.blueBright('Other  - 🔗 Share Jit ')}${chalk.grey('(print npm install for Jit)')}`, value: 'shareJit' },
        { title: `${chalk.redBright('Other  - ❌ Reset Branch ')}${chalk.grey('(back to a clean slate from master)')}`, value: 'checkoutMaster' },
    ].concat(IsTesting() ? [
        { title: 'Echo?', value: 'test' },
    ].map((x) => ({ ...x, title: `${chalk.yellowBright('[TEST]')} ${x.title}` })) : []));
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
    return selectTicketNumber('jiraTicket', `Jira Ticket Number ${chalk.grey('(e.g. XX-XXXX or Jira Ticket URL)')}`);
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
    'Fixed y̶o̶u̶\'̶r̶e̶ your typos',
    'Force pushing main',
    'Taking - my time',
];

export function whichCommitMessage() {
    return {
        format: (value: string) => value.toLowerCase().trim(),
        message: `Commit Message ${chalk.grey(`(e.g. ${commitExamples[Math.floor(Math.random() * commitExamples.length)]})`)}`,
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
    'website-2',
    'fix-final-new-2',
    'just-one-more-commit',
    'migrating-the-migration',
    'loosing-my-marbles',
];

export function whichBranchName() {
    return {
        format: (value: string) => value.replace(/\s+/g, '-').toLowerCase(),
        message: `Branch Name ${chalk.grey(`(these have to be kebab-case - e.g. ${branchExamples[Math.floor(Math.random() * branchExamples.length)]})`)}`,
        name: 'branchName',
        type: 'text',
    } as PromptObject;
}
