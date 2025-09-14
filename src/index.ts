#! /usr/bin/env node
// ^ That “shebang” line makes it runnable as an executable if you chmod +x it.
console.log("Hello from Task Planner CLI!\n");

import { stdin as input, stdout as output } from 'node:process';
import { displayTutorial as displayTutorial } from "./tutorial";
import * as readline from 'readline';
import { logCommandInfo } from "./utils";

const rl = readline.createInterface({ input, output });

function askForCommand() {
	rl.question('task-cli>', (input) => {
		
	})
}

displayTutorial();

process.argv.slice(1).forEach((val, index, next) => {
	console.log(`${index}: ${val}`);
		
	logCommandInfo(val, "--version", "task-cli version 1.0.0");
	logCommandInfo(val, "add", "Usage: task-cli add [options]");
	logCommandInfo(val, "update", "Usage: task-cli [options]");
	logCommandInfo(val, "delete", "Usage: task-cli [options]");
	logCommandInfo(val, "mark-in-progress", "Usage: task-cli [options]");
	logCommandInfo(val, "mark-done", "Usage: task-cli [options]");
});

console.log("Now what?");
askForCommand();