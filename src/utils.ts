import { getTasks, writeTasksToFile } from "./store";
import { Status } from "./types";

export function executeCommand(commands: string[]){
	switch(commands[0]){
		case 'list':
			switch (commands[1]) {
				case "done":
					listTasks(Status.Done);
					break;
				case "todo":
					listTasks(Status.Todo);
					break;
				case "in-progress":
					listTasks(Status.InProgress);
					break;
				default:
					listTasks();
			}
			break;
		case 'add':
			addTask(commands[1]);
			break;
		case 'update':
			updateTask(parseInt(commands[1]), commands[2]);
			break;
		case 'delete':
			deleteTask(parseInt(commands[1]));
			break;
		case 'mark-in-progress':
			markStatus(parseInt(commands[1]), Status.InProgress);
			break;
		case 'mark-done':
			markStatus(parseInt(commands[1]), Status.Done);
			break;
		default:
			break;
	}
}

function listTasks(status?: Status) {
	let taskList = getTasks();
	if (status)
		taskList = taskList.filter(tsk => tsk.status === status);
	
	console.log(`\x1b[32m${JSON.stringify(taskList, null, 2)}\x1b[0m`);
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
	console.log(`\x1b[32mTask deleted successfully (ID: ${taskId})\x1b[0m`);
}

function markStatus(taskId: number, status: Status) {
	const taskList = getTasks();
	const task = taskList.find(tsk => tsk.id === taskId);
	if(!task) 
		throw new Error(`Task with ID: ${taskId} not found`);
	
	const taskIndex = taskList.indexOf(task);
	task.status = status;
	task.updatedAt = new Date();
	
	taskList[taskIndex] = task;
	writeTasksToFile(taskList);
	console.log(`\x1b[32mTask status updated (ID: ${taskId})\x1b[0m`);
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
	console.log(`\x1b[32mTask updated successfully (ID: ${taskId})\x1b[0m`);
}

function addTask(description: string) {
	const taskList = getTasks();
	
	let newTaskId = getNextId(taskList.map(x => x.id));
	taskList.push({ 
		id: newTaskId, 
		description, 
		status: Status.Todo, 
		createdAt: new Date(), 
		updatedAt: new Date()
	});
	
	const sortedTasks = [...taskList].sort((a, b) => a.id - b.id);
	writeTasksToFile(sortedTasks);

	console.log(`\x1b[32mTask added successfully (ID: ${newTaskId})\x1b[0m`);
}

export function tryParseInt(cmdArg: string) {
	const parsedId = Number.parseInt(cmdArg, 10);
	if (!Number.isInteger(parsedId))
		throw new Error(`Invalid task id: ${cmdArg}`);

	return parsedId;
}