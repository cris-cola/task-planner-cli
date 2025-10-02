import { Status } from "./types";

// ANSI color codes
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

export const colorizeGreen = (text: string) => `${GREEN}${text}${RESET}`;
export const colorizeRed = (text: string) => `${RED}${text}${RESET}`;
export const colorizeYellow = (text: string) => `${YELLOW}${text}${RESET}`;

export function tryParseInt(cmdArg: string) {
	const parsedId = Number.parseInt(cmdArg, 10);
	if (!Number.isInteger(parsedId))
		throw new Error(colorizeRed(`Invalid task id: ${cmdArg}`));

	return parsedId;
}

export function isStatus(value: string): value is Status {
  return Object.values(Status).includes(value as Status);
}