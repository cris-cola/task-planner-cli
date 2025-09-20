import fs from "fs";

const FOLDER = "data";

export function logCommanisdInfo(currentValue: string, command: string, description: string) {
	if (currentValue === command)
		console.log(description);
	return;
}

export function executeCommand(command: string[]){
	switch(command[0]){
		case 'add':
			addEntry();
		default:
			break;
	}	
}

function addEntry() {
	throw new Error("Function not implemented.");
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