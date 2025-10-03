#! /usr/bin/env node
// ^ That “shebang” line makes it runnable as an executable if you chmod +x it.
import { executeCommand } from "./commands";
import { initStore } from "./store";
import { validateCommand } from "./validation";

initStore();

class App {
	static start(){
		try {
			const { command, args } = validateCommand(process.argv);
			executeCommand([command, ...args]);
		} catch (err) {
			console.error((err as Error).message);
			process.exit(1);
		}
	}
}

App.start();