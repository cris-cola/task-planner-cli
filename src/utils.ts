import fs from "fs";

const FOLDER = "data";

/* 	logCommandInfo(val, "--version", "task-cli version 1.0.0");
	logCommandInfo(val, "add", "Usage: task-cli add [options]");
	logCommandInfo(val, "update", "Usage: task-cli [options]");
	logCommandInfo(val, "delete", "Usage: task-cli [options]");
	logCommandInfo(val, "mark-in-progress", "Usage: task-cli [options]");
	logCommandInfo(val, "mark-done", "Usage: task-cli [options]"); */
export function logCommanisdInfo(currentValue: string, command: string, description: string) {
	if (currentValue === command)
		console.log(description);
	return;
}

export function executeCommand(command :string[]){
	if(command[0] === "add")
		addEntry();
}

function addEntry() {
	// throw new Error("Function not implemented.");
}

export function initializeJsonStore(jsonFileName: string) {
	const filePath = `${FOLDER}/${jsonFileName}`;
	const exists = fs.existsSync(filePath);
	if(!exists){
			fs.mkdir(FOLDER, (err: NodeJS.ErrnoException | null) => {
					if (err) return console.log(err);
			});
			fs.writeFile(filePath, "", function(err) {
				if(err) return console.log("?", err);
				console.log("Json store initialized!");
		});
	}
}