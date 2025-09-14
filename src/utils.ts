
export function logCommandInfo(currentValue: string, command: string, description: string) {
	if (currentValue === command)
		console.log(description);
	return;
}