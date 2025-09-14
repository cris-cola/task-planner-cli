export type Task = {
	id: string,
	description: string,
	status: "todo" | "in-progress" | "done"
	createdAt: Date,
	updatedAt: Date
}
