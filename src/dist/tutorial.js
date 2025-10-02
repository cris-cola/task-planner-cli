"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayTutorial = displayTutorial;
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const violet = '\x1b[35m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';
function formatCommand(command, args) {
    let formatted = `${green}task-cli${reset} ${yellow}${command}${reset}`;
    args.forEach(arg => {
        if (typeof arg === 'number' || /^\d+$/.test(arg)) {
            formatted += ` ${violet}${arg}${reset}`;
        }
        else {
            formatted += ` ${yellow}${arg}${reset}`;
        }
    });
    return formatted;
}
function displayTutorial() {
    console.log(`${dim}# Adding a new task${reset}`);
    console.log(formatCommand('add', ['"Buy groceries"']));
    console.log(`${dim}# Output: Task added successfully (ID: 1)${reset}\n`);
    console.log(`${dim}# Updating and deleting tasks${reset}`);
    console.log(formatCommand('update', ["1", '"Buy groceries and cook dinner"']));
    console.log(formatCommand('delete', ["1"]));
    console.log();
    console.log(`${dim}# Marking a task as in progress or done${reset}`);
    console.log(formatCommand('mark-in-progress', ["1"]));
    console.log(formatCommand('mark-done', ["1"]));
    console.log();
    console.log(`${dim}# Listing all tasks${reset}`);
    console.log(formatCommand('list', []));
    console.log();
    console.log(`${dim}# Listing tasks by status${reset}`);
    console.log(formatCommand('list', ['done']));
    console.log(formatCommand('list', ['todo']));
    console.log(formatCommand('list', ['in-progress']));
}
