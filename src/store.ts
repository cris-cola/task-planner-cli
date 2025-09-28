import fs from "fs";
import { Task } from "./types";

const FOLDER = "data";
const FILEPATH = `${FOLDER}/store.json`;

export function initializeJsonStore() {
	const exists = fs.existsSync(FILEPATH);
	if(!exists){
		if (!fs.existsSync(FOLDER)) {
				try{
					fs.mkdirSync(FOLDER, { recursive: true });
				} catch (err) {
          console.error('\x1b[31mError creating directory:\x1b[0m', err);
					return;
				}
		}
		const initialData: Task[] = [];
		writeTasksToFile(initialData);
	  console.log(`\x1b[32mTasks store initialized!\x1b[0m`);
	}
}	

export function getTasks() {
  try {
    const storeJson = fs.readFileSync(FILEPATH, 'utf8');
    return storeJson.trim() ? JSON.parse(storeJson) as Task[]: [];
  } catch (err) {
		console.error('\x1b[31mError reading store:\x1b[0m', err);
    return [];
  }
}

export function writeTasksToFile(tasks: Task[]) {
  try {
    fs.writeFileSync(FILEPATH, JSON.stringify(tasks, null, 2));
  } catch (err) {
		console.error('\x1b[31mError writing file:\x1b[0m', err);
  }
}
