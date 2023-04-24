import { existsSync } from 'fs';
import { PromptObject } from 'prompts';

export function selectConfirm(id: string, title: string, initial = true) {
    return {
        active: 'yes',
        hint: 'Arrows to choose option. Return to select.',
        inactive: 'no',
        initial,
        instructions: false,
        message: title,
        name: id,
        type: 'toggle',
    } as PromptObject;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function selectFromList(id: string, title: string, options: { title: string; value: any }[], multiple?: boolean) {
    return {
        choices: options,
        hint: `Arrows to navigate. ${multiple ? 'Space to select. Return to submit' : 'Return to select.'} `,
        instructions: false,
        message: title,
        name: id,
        type: multiple ? 'multiselect' : 'select',
    } as PromptObject;
}

export function selectDirectory(id: string, title: string) {
    return {
        instructions: false,
        message: title,
        name: id,
        type: 'text',
        validate: value => {
            return existsSync(`${value}`) ? true : 'Path does not exist.';
        },
    } as PromptObject;
}

export function selectTicketNumber(id: string, title: string) {
    return {
        format: value => (value as string).toUpperCase().trim(),
        hint: 'e.g. XX-1234',
        instructions: false,
        message: title,
        name: id,
        type: 'text',
        validate: value => {
            const regex = /.+-.+/gm;
            return (value as string).match(regex) ? true : 'Invalid Ticket Format';
        },
    } as PromptObject;
}
