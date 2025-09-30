#! /usr/bin/env node
// ^ That “shebang” line makes it runnable as an executable if you chmod +x it.
import { initializeJsonStore } from "./store";
import { Command, Status } from "./types";
import { executeCommand, tryParseInt } from "./utils";

initializeJsonStore();

const commands: Command[] = [
	{ key: "add", required: ["<task-description>"] },
	{ key: "delete", required: ["<task-id>"] },
	{ key: "update", required: ["<task-id>", "<task-description>"] },
	{ key: "mark-in-progress", required: ["<task-id>"] },
	{ key: "mark-done", required: ["<task-id>"] },
	{ key: "list", required: [], optional: ["<task-status>"] },
	{ key: "add-stuff", required: ["<task-description>"], optional: ["<task-status>"] },
];

interface CommandSpec {
  key: string;
  required: string[];
  optional: string[];
}

const commandMap: Record<string, CommandSpec> = Object.fromEntries(commands.map(c => [c.key, { 
	key: c.key, 
	required: c.required, 
	optional: c.optional ?? [] 
}]));

function validateCommand(argv: string[]): { command: string; args: string[] } {
	const command = argv[2];
	if (!command) throw new Error("Missing command.");

	const supported = commandMap[command];
	if (!supported) {
		const list = commands.map(cmd => `- ${cmd.key} ${cmd.required.join(" ")}`).join("\n");
		throw new Error(`Unsupported command: ${command}\nAvailable commands:\n${list}`);
	}

	const args = validateArguments(argv.slice(3), supported, command);
	return { command, args };
}

try {
	const { command, args } = validateCommand(process.argv);
	executeCommand([command, ...args]);
} catch (err) {
	console.error((err as Error).message);
	process.exit(1);
}

function validateArguments(args: string[], supported: CommandSpec, command: string) {
	const min = supported.required.length;
	const max = min + supported.optional.length;
	const supportedArgs = [...supported.required, ...supported.optional];
	if (args.length < min || args.length > max) {
		const expected = supportedArgs.join(" ")
		throw new Error(
			`Invalid arguments for '${command}'. Expected: ${expected || "<none>"}`
		);
	}

	for (let index = 0; index < args.length; index++) {
		const val = args[index];
		const spec = supportedArgs[index];
		switch (spec) {
			case "<task-id>":
				tryParseInt(val);
				break;
			case "<task-status>":
				if (!isStatus(val)){
					throw new Error(`Invalid stqatus '${val}'. Allowed: todo, in-progress, done`);
				}
				break;
			default:
				break;
		}
	}
	return args;
}

function isStatus(value: string): value is Status {
  const allowed: Status[] = ['todo', 'in-progress', 'done'];
  return allowed.includes(value as Status);
}