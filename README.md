# BlinkReact

A performance analysis tool for React components that detects unnecessary re-renders, measures render times, and provides optimization suggestions.

## Installation

```bash
npm install -g blinkreact
# or use npx without installing
npx blinkreact <component-file>
```

## Usage

```bash
blinkreact path/to/your/component.tsx
```

## Features

- **Render Count Tracking**: Monitor how many times a component re-renders and detect unnecessary re-renders.
- **Render Time Measurement**: Measure the time taken for initial and subsequent renders.
- **State Update Monitoring**: Track state changes and detect redundant updates.
- **Performance Recommendations**: Get suggestions for optimizing your component.

## How It Works

BlinkReact analyzes your React component by:

1. Instrumenting the component with performance tracking code
2. Analyzing render performance
3. Analyzing state updates
4. Generating a comprehensive performance report

## Output

BlinkReact generates a `PERFORMANCE_REPORT.md` file containing:

- Component name and file path
- Render performance metrics
- State update details
- Performance recommendations

## Requirements

- Node.js >= 14.0
- React >= 18.0

## Example Report

```markdown
# BlinkReact Performance Report

## Component: `TodoList`

**File Path:** `src/components/TodoList.tsx`  
**Analysis Date:** 2023-05-15 10:30:45

## Render Performance

- **Total Renders:** 5
- **Average Render Time:** 3.45ms
- **Maximum Render Time:** 8.12ms
- **Unnecessary Renders:** 2

...
```

## License

ISC 