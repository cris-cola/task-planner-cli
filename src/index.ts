#! /usr/bin/env node
// ^ That “shebang” line makes it runnable as an executable if you chmod +x it.
import { executeCommand, initializeJsonStore } from "./utils";
initializeJsonStore("store.json");

const mapping = ["add", "delete", "update", "mark-in-progress", "mark-done"];

process.argv.slice(2).forEach((val, index, next) => {
	console.log(`${index}: ${val}`);
	
	if (mapping.includes(val)) {
		executeCommand(next);
		return;
	}

	console.log("Unsupported command!");
});


