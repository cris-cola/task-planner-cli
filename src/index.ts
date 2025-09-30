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

	const supportedArgs = commandMap[command];
	if (!supportedArgs) {
		const list = commands.map(cmd => `- ${cmd.key} ${cmd.required.join(" ")}`).join("\n");
		throw new Error(`Unsupported command: ${command}\nAvailable commands:\n${list}`);
	}

	const args = validateArguments(argv.slice(3), supportedArgs, command);
	return { command, args };
}

try {
	const { command, args } = validateCommand(process.argv);
	executeCommand([command, ...args]);
} catch (err) {
	console.error((err as Error).message);
	process.exit(1);
}

function validateArguments(args: string[], supportedArgs: CommandSpec, command: string) {
	const required = supportedArgs.required;
	if (args.length !== required.length && args.length !== supportedArgs.optional.length) {
		throw new Error(
			`Invalid arguments for '${command}'. Expected: ${required.join(" ") || "<none>"}`
		);
	}

	for (let index = 0; index < args.length; index++) {
		const cmdArg = args[index];
		switch (required[index]) {
			case "<task-id>":
				tryParseInt(cmdArg);
				break;
			default:
				break;
		}
		const optional = supportedArgs.optional;
		if (optional[index] === "<task-status>"){
			const s = cmdArg as Status;
		}
	}
	return args;
}