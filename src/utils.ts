import fs from "fs";
// Removed accidental imports from 'inspector' and 'process' that shadowed console or were unused.

const FOLDER = "data";
const FILEPATH = `${FOLDER}/store.json`;
type Task = {
	id: number,
	taskName: string
}
export function logCommanisdInfo(currentValue: string, command: string, description: string) {
	if (currentValue === command)
		console.log(description);
	return;
}

function getTasks() {
	try {
		const userJson = fs.readFileSync(FILEPATH, 'utf8');
		return userJson.trim() ? JSON.parse(userJson) as Task[]: [];
	} catch (err) {
		console.log('Error reading store:', err);
		return [];
	}
}
export function executeCommand(command: string[]){
	switch(command[0]){
		case 'add':
			addEntry(command[1]);
			break; // prevent fall-through
		case 'update':
			listEntries();
		default:
			break;
	}
}

function getNextId(ids: number[]){
	if(ids.length === 0) return 0;

	const maxId = Math.max(...ids);

	for (let i = 0; i <= maxId; i++)
		if(!ids.includes(i)) return i;

	return maxId + 1;
}

function listEntries() {
	throw new Error("You should provide at least one command.");
}

function addEntry(taskName: string) {
	const taskList = getTasks();
	
	let newTaskId = getNextId(taskList.map(x => x.id));
	taskList.push({ id: newTaskId, taskName });
	
	const sortedTasks = [...taskList].sort((a, b) => a.id - b.id);
	writeTasks(sortedTasks, newTaskId);
}

function writeTasksToFile(tasks: Task[]) {
	try {
		fs.writeFileSync(FILEPATH, JSON.stringify(tasks, null, 2));
	} catch (err) {
		console.log('Error writing file: ', err);
	}
}

function writeTasks(tasks: Task[], newId?: number) { 
	writeTasksToFile(tasks);
	if(newId)
		console.log(`Task added successfully (ID: ${newId})`);
	else
		console.log('Tasks store initialized!');
}

export function initializeJsonStore() {
	const exists = fs.existsSync(FILEPATH);
	if(!exists){
		if (!fs.existsSync(FOLDER)) {
				try{
					fs.mkdirSync(FOLDER, { recursive: true });
				} catch (err) {
					console.log('Error creating directory:', err);
					return;
				}
		}
		const initialData: Task[] = [];
		writeTasks(initialData);
	}
}	
