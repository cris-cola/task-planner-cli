import { Command, StatusExtra, Status } from "./types";
import { colorizeRed, tryParseInt, isStatus } from "./utils";

const commands: Command[] = [
  { key: "add", required: ["<task-description>"], optional: [] },
  { key: "delete", required: ["<task-id>"], optional: [] },
  { key: "update", required: ["<task-id>", "<task-description>"], optional: [] },
  { key: "mark-in-progress", required: ["<task-id>"], optional: [] },
  { key: "mark-done", required: ["<task-id>"], optional: [] },
  { key: "list", required: [], optional: ["<task-status>"] },
];

const commandMap: Record<string, Command> = Object.fromEntries(commands.map(c => [c.key, { 
  key: c.key, 
  required: c.required, 
  optional: c.optional ?? [] 
}]));

export function validateCommand(argv: string[]): { command: string; args: string[] } {
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

export function validateArguments(args: string[], supported: Command, command: string) {
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