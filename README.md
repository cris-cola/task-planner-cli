# task-planner-cli
Task Tracker

## How to Run the Application

### Standard Setup & Execution

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build and run in development mode:
   ```bash
   npm run build:watch & npm run dev
   ```
   *Use this method for rapid development with automatic rebuilding when files change.*

   Alternatively, build once and then run:
   ```bash
   npm run build && npm run dev
   ```
   *Prefer this method for production or when you need a clean build.*

### Direct TypeScript Execution

Run TypeScript files directly without separate compilation:
```bash
npm start
```
*This is useful for quick testing during development.*

### Global CLI Usage

Make the tool available as a global command:
```bash
npm link task-cli
```

After linking, run commands directly using:
```bash
task-cli [command] [options]
```
*Replace `task-cli` with the actual package name if different.*
