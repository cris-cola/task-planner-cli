import { getTasks, writeTasksToFile } from "./store";

export function executeCommand(command: string[]){
	switch(command[0]){
		case 'list':
			listTasks();
			break;
		case 'add':
			addTask(command[1]);
			break;
		case 'update':
			updateTask(command[1], command[2])
			break;
		default:
			break;
	}
}

function listTasks() {
	const taskList = getTasks();
	console.log(JSON.stringify(taskList, null, 2));
}

function getNextId(ids: number[]){
	if(ids.length === 0) return 0;

	const maxId = Math.max(...ids);

	for (let i = 0; i <= maxId; i++)
		if(!ids.includes(i)) return i;

	return maxId + 1;
}

function updateTask(taskId: string, description: string) {
	throw new Error('Not implemented');
}

function addTask(description: string) {
	const taskList = getTasks();
	
	let newTaskId = getNextId(taskList.map(x => x.id));
	taskList.push({ 
		id: newTaskId, 
		description, 
		status: "todo", 
		createdAt: new Date(), 
		updatedAt: new Date()
	});
	
	const sortedTasks = [...taskList].sort((a, b) => a.id - b.id);
	writeTasksToFile(sortedTasks);

	console.log(`\x1b[32mTask added successfully (ID: ${newTaskId})\x1b[0m`);
}