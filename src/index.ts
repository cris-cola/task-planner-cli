#! /usr/bin/env node
// ^ That “shebang” line makes it runnable as an executable if you chmod +x it.
import { commandMap, commands, executeCommand } from "./commands";
import { initializeJsonStore } from "./store";
import { Command, Status, StatusExtra } from "./types";
import { colorizeRed, isStatus, tryParseInt } from "./utils";

initializeJsonStore();

try {
	const { command, args } = validateCommand(process.argv);
	executeCommand([command, ...args]);
} catch (err) {
	console.error((err as Error).message);
	process.exit(1);
}

function validateCommand(argv: string[]): { command: string; args: string[] } {
	const command = argv[2];
	if (!command) throw new Error("Missing command.");

	const supported = commandMap[command];
	if (!supported) {
		const list = commands.map(cmd => {
			return `- ${cmd.key} ${cmd.required.join(" ")}${cmd.optional ? cmd.optional?.join(" ") : []}`
		}).join("\n");
		throw new Error(colorizeRed(`Unsupported command: ${command}\nAvailable commands:\n${list}`));
	}

	const args = validateArguments(argv.slice(3), supported, command);
	return { command, args };
}

function validateArguments(args: string[], supported: Command, command: string) {
	const min = supported.required.length;
	const max = min + supported.optional.length;
	const supportedArgs = [...supported.required, ...supported.optional];
	if (args.length < min || args.length > max) {
		const expected = supportedArgs.join(" ")
		throw new Error(
			colorizeRed(`Invalid arguments for '${command}'. Expected: ${expected || "<none>"}`)
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
				if (!isStatus(val) && val !== StatusExtra.NotDone)
					throw new Error(colorizeRed(`Invalid status '${val}'. Allowed: ${Object.values(Status).join(", ")}`));
				break;
			default:
				break;
		}
	}
	return args;
}