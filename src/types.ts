export type Task = {
	id: number,
	description: string,
	status: "todo" | "in-progress" | "done"
	createdAt: Date,
	updatedAt: Date
}

export type Command = { key: string; args: string[] };
