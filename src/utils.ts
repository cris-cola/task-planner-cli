import { Status } from "./types";

// ANSI color codes
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

export const colorizeGreen = (text: string) => `${GREEN}${text}${RESET}`;
export const colorizeRed = (text: string) => `${RED}${text}${RESET}`;

export function tryParseInt(cmdArg: string) {
	const trimmed = cmdArg.trim();
	if (!/^\d+$/.test(trimmed))
		throw new Error(colorizeRed(`Invalid task id: ${cmdArg}`));

	return Number.parseInt(trimmed, 10);
}

export function isStatus(value: string): value is Status {
  return Object.values(Status).includes(value as Status);
}