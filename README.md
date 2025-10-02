# Task Planner CLI

A simple command-line task tracker built with Node.js and TypeScript. Manage tasks with add, delete, update, mark status, and list operations.

Project: https://roadmap.sh/projects/task-tracker

## Installation

```bash
npm install
npm run build
```

## Global Installation

```bash
npm link
```

Run `task-cli` commands from anywhere.

## Usage

- Add task: `task-cli add "Task description"`
- Delete task: `task-cli delete <id>`
- Update task: `task-cli update <id> "New description"`
- Mark status: `task-cli mark-todo <id>`, `task-cli mark-in-progress <id>`, `task-cli mark-done <id>`
- List tasks: `task-cli list`

## Testing

Run all tests:
```bash
npm test
```
