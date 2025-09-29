#! /usr/bin/env node
// ^ That “shebang” line makes it runnable as an executable if you chmod +x it.
import { initializeJsonStore } from "./store";
import { Command } from "./types";
import { executeCommand } from "./utils";

initializeJsonStore();

const commands: Command[] = [
	{ key: "add", args: ["<task-description>"] },
	{ key: "delete", args: ["<task-id>"] },
	{ key: "update", args: ["<task-id>", "<task-description>"] },
	{ key: "mark-in-progress", args: ["<task-id>"] },
	{ key: "mark-done", args: ["<task-id>"] },
	{ key: "list", args: [], optionalArgs: ["<task-status>"] },
];

const commandMap: Record<string, string[]> = Object.fromEntries(commands.map(c => [c.key, c.args ]));

function validateInputs(argv: string[]): { command: string; args: string[] } {
	const command = argv[2];
	if (!command) throw new Error("Missing command.");

	const supportedArgs = commandMap[command];
	if (!supportedArgs) {
		const list = commands.map(c => `- ${c.key} ${c.args.join(" ")}`).join("\n");
		throw new Error(`Unsupported command: ${command}\nAvailable commands:\n${list}`);
	}

	const cmdArgs = argv.slice(3);
	if (cmdArgs.length !== supportedArgs.length) {
		throw new Error(
			`Invalid arguments for '${command}'. Expected: ${supportedArgs.join(" ") || "<none>"}`
		);
	}
	
	for (let index = 0; index < cmdArgs.length; index++) {
		const cmdArg = cmdArgs[index];
		switch (supportedArgs[index]) {
			case "<task-id>":
				const parsedId = Number.parseInt(cmdArg, 10);
				if (!Number.isInteger(parsedId))
					throw new Error(`Invalid task id: ${cmdArg}`);
				break;
			case "<task-status>":
				break;
			case "<task-description>":
			default:
				break;
		}
	}

	return { command, args: cmdArgs };
}

try {
	const { command, args } = validateInputs(process.argv);
	executeCommand([command, ...args]);
} catch (err) {
	console.error((err as Error).message);
	process.exit(1);
}

