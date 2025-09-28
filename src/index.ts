#! /usr/bin/env node
// ^ That “shebang” line makes it runnable as an executable if you chmod +x it.
import { executeCommand, initializeJsonStore } from "./utils";
initializeJsonStore();
type Command = {
	key: string,
	value: string[]
};
const mapping: Command[] = [
	{ key: "add", value: ["<task-name>"] },
	{ key: "delete", value: ["<task-id>"] },
	{ key: "update", value: ["<task-id>", "<task-name>"] },
	{ key: "mark-in-progress", value: ["<task-id>"] },
	{ key: "mark-done", value: ["<task-id>"] },
	{ key: "list-all", value: [] }
];

validateInputs(process.argv);
process.argv.slice(2).forEach((val, index, next) => {
	
	const keys = mapping.map(x => x.key);
	if (keys.includes(val)) {
		executeCommand(next);
		return;
	}
});


function validateInputs(argv: string[]) {
	if(argv.length < 4){
		throw new Error("You should provide at least one command.");
	}
	if(argv.length > 4){
		const entries = mapping.map(cmd => " " + cmd.key + " " + cmd.value).join("\n");
    throw new Error(`Arguments not supported: you can only provide one of the following commands:\n${entries}`);
	}
}

