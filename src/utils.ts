import { getTasks, writeTasksToFile } from "./store";

export function executeCommand(commands: string[]){
	switch(commands[0]){
		case 'list':
			listTasks();
			break;
		case 'add':
			addTask(commands[1]);
			break;
		case 'update':
			updateTask(Number.parseInt(commands[1], 10), commands[2]);
			break;
		case 'delete':
			deleteTask(Number.parseInt(commands[1], 10));
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

function deleteTask(taskId: number) {
	const taskList = getTasks();
	const task = taskList.find(tsk => tsk.id === taskId);
	if(!task) 
		throw new Error(`Can't delete task (ID: ${taskId}): not found`);
	
	const taskIndex = taskList.indexOf(task);
	taskList.splice(taskIndex, 1);

	writeTasksToFile(taskList);
}

function updateTask(taskId: number, description: string) {
	const taskList = getTasks();
	const task = taskList.find(tsk => tsk.id === taskId);
	if(!task) 
		throw new Error(`Task with ID: ${taskId} not found`);
	
	const taskIndex = taskList.indexOf(task);
	task.description = description;
	task.updatedAt = new Date();
	taskList[taskIndex] = task;
	writeTasksToFile(taskList);
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