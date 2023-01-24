import chalk from "chalk";
import { existsSync } from "fs";
import { PromptObject } from "prompts";

export function selectFromList(id: string, title: string, options: { title: string; value: any; }[], multiple?: boolean) {
    return {
        type: multiple ? 'multiselect' : 'select',
        name: id,
        message: title,
        choices: options,
        hint: `Arrows to navigate. ${multiple ? 'Space to select. Return to submit' : 'Return to select.'} `,
        instructions: false
    } as PromptObject
}

export function selectDirectory(id: string, title: string) {
    return {
        type: 'text',
        name: id,
        message: title,
        instructions: false,
        validate: value => {
            return existsSync(`${value}`) ? true : 'Path does not exist.';
        }
    } as PromptObject
}

export function selectTicketNumber(id: string, title: string) {
    return {
        type: 'text',
        name: id,
        message: title,
        hint: 'e.g. XX-1234',
        instructions: false,
         
        validate: value => {
            const regex = /.+-.+/gm;
            return !!(value as string).match(regex) ? true : 'Invalid Ticket Format';
        },
        format: value => (value as string).toUpperCase()
    } as PromptObject
}