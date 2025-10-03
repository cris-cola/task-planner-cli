
import { getTasks, writeTasksToFile } from "./store";
import { Status, StatusExtra } from "./types";
import { colorizeGreen, colorizeRed } from "./utils";

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
				case "not-done":
					listTasksNotDone();
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

function listTasksNotDone() {
	let taskList = getTasks();
	taskList = taskList.filter(tsk => tsk.status !== Status.Done);
	
	console.log(colorizeGreen(JSON.stringify(taskList, null, 2)));
}

function listTasks(status?: Status | StatusExtra) {
	let taskList = getTasks();
	if (status === StatusExtra.NotDone)
		taskList = taskList.filter(tsk => tsk.status !== Status.Done);
	else if (status)
		taskList = taskList.filter(tsk => tsk.status === status);

	console.log(colorizeGreen(JSON.stringify(taskList, null, 2)));
}

function getNextId(ids: number[]){
	if(ids.length === 0) return 1;

	const sortedIds = [...ids].sort((a, b) => a - b);
	let nextId = 1;

	for (const id of sortedIds){
		if (id > nextId) break;
		if (id === nextId) nextId += 1;
	}

	return nextId;
}

function deleteTask(taskId: number) {
	const taskList = getTasks();
	const task = taskList.find(tsk => tsk.id === taskId);
	if(!task) {
		throw new Error(colorizeRed(`Can't delete task (ID: ${taskId}): not found`));
	}
	
	const taskIndex = taskList.indexOf(task);
	taskList.splice(taskIndex, 1);

	writeTasksToFile(taskList);
	console.log(colorizeGreen(`Task deleted successfully (ID: ${taskId})`));
}

function markStatus(taskId: number, status: Status) {
	const taskList = getTasks();
	const task = taskList.find(tsk => tsk.id === taskId);
	if(!task) 
		throw new Error(colorizeRed(`Task with ID: ${taskId} not found`));
	
	const taskIndex = taskList.indexOf(task);
	task.status = status;
	task.updatedAt = new Date();
	
	taskList[taskIndex] = task;
	writeTasksToFile(taskList);
	console.log(colorizeGreen(`Task status updated (ID: ${taskId})`));
}

function updateTask(taskId: number, description: string) {
	const taskList = getTasks();
	const task = taskList.find(tsk => tsk.id === taskId);
	if(!task) 
		throw new Error(colorizeRed(`Task with ID: ${taskId} not found`));
	
	const taskIndex = taskList.indexOf(task);
	task.description = description;
	task.updatedAt = new Date();

	taskList[taskIndex] = task;
	writeTasksToFile(taskList);
	console.log(colorizeGreen(`Task updated successfully (ID: ${taskId})`));
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

	console.log(colorizeGreen(`Task added successfully (ID: ${newTaskId})`));
}