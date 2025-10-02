import fs from "fs";
import { Task } from "./types";
import { colorizeGreen } from "./utils";

const FILENAME = "store.json";

export function initializeJsonStore() {
	if(!fs.existsSync(FILENAME)){
		const initialData: Task[] = [];
		writeTasksToFile(initialData);
	  console.log(colorizeGreen("Tasks store initialized!"));
	}
}	

export function getTasks() {
  try {
    const storeJson = fs.readFileSync(FILENAME, 'utf8');
    return storeJson.trim() ? JSON.parse(storeJson) as Task[]: [];
  } catch (err) {
		console.error('\x1b[31mError reading store:\x1b[0m', err);
    return [];
  }
}

export function writeTasksToFile(tasks: Task[]) {
  try {
    fs.writeFileSync(FILENAME, JSON.stringify(tasks, null, 2));
  } catch (err) {
		console.error('\x1b[31mError writing file:\x1b[0m', err);
  }
}
