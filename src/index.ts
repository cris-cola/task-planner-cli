#! /usr/bin/env node
// ^ That “shebang” line makes it runnable as an executable if you chmod +x it.

import { showTutorial } from "./tutorial";

console.log("Hello from Task Planner CLI!\n");

showTutorial();

process.argv.slice(1).forEach((val, index) => {
    console.log(`${index}: ${val}`);

    // if (val === "add") {
    //   console.log("Usage: task-cli [options]");
    // }
    // if (arg === "--version") {
    //   console.log("task-cli version 1.0.0");
    // }
    // if (arg === "--add") {
    //   console.log("Adding a new task");
    // }
});