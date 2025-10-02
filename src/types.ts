
export interface Command {
  key: string;
  required: string[];
  optional: string[];
}

export enum Status {
  Todo = 'todo',
  InProgress = 'in-progress',
  Done = 'done'
}

export enum StatusExtra {
  NotDone = 'not-done'
}

export type Task = {
	id: number,
	description: string,
	status: Status,
	createdAt: Date,
	updatedAt: Date
}
