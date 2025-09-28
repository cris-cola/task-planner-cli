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
	{ key: "list", args: [] }
];

const commandMap: Record<string, string[]> = Object.fromEntries(commands.map(c => [c.key, c.args]));

function validateInputs(argv: string[]): { command: string; args: string[] } {
	const command = argv[2];
	if (!command) throw new Error("Missing command.");

	const args = commandMap[command];
	if (!args) {
		const list = commands.map(c => `- ${c.key} ${c.args.join(" ")}`).join("\n");
		throw new Error(`Unsupported command: ${command}\nAvailable commands:\n${list}`);
	}

	const providedArgs = argv.slice(3);
	if (providedArgs.length !== args.length) {
		throw new Error(
			`Invalid argument for '${command}'. Expected: ${args.join(" ") || "<none>"}`
		);
	}

	return { command, args: providedArgs };
}

try {
	const { command, args } = validateInputs(process.argv);
	executeCommand([command, ...args]);
} catch (err) {
	console.error((err as Error).message);
	process.exit(1);
}

