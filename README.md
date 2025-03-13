# 🚀 BlinkReact

<div align="center">
  
  <p align="center">
    <img src="./assets/blinkreact-logo.png" alt="BlinkReact Logo" width="200" height="200"/>
  </p>
  
  ![BlinkReact Logo](https://img.shields.io/badge/BlinkReact-Performance%20Analysis-blue?style=for-the-badge)
  
  [![npm version](https://img.shields.io/npm/v/blinkreact.svg)](https://www.npmjs.com/package/blinkreact)
  [![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)
  [![npm downloads](https://img.shields.io/npm/dm/blinkreact.svg)](https://www.npmjs.com/package/blinkreact)
  
  **A powerful performance analysis tool for React components that detects unnecessary re-renders, measures render times, and provides optimization suggestions.**
  
</div>

---

## ✨ Features

- 🔄 **Render Count Tracking**: Monitor how many times a component re-renders and detect unnecessary re-renders
- ⏱️ **Render Time Measurement**: Measure the time taken for initial and subsequent renders
- 🧠 **State Update Monitoring**: Track state changes and detect redundant updates
- 🛠️ **Performance Recommendations**: Get actionable suggestions for optimizing your component

## 📦 Installation

```bash
# Install globally
npm install -g blinkreact

# Or use npx without installing
npx blinkreact <component-file>
```

## 🚦 Usage

```bash
blinkreact path/to/your/component.tsx
```

## 🔍 How It Works

BlinkReact analyzes your React component through a 4-step process:

1. 🧪 **Instrumentation**: Adds performance tracking code to your component
2. 📊 **Render Analysis**: Measures render counts and durations
3. 🔄 **State Analysis**: Detects redundant state updates and inefficient patterns
4. 📝 **Report Generation**: Creates a comprehensive performance report

## 📄 Output

BlinkReact generates a detailed `PERFORMANCE_REPORT.md` file containing:

| Section | Description |
|---------|-------------|
| 📌 **Component Info** | Component name and file path |
| ⏱️ **Render Metrics** | Total renders, render times, unnecessary renders |
| 🧠 **State Management** | State updates and redundancy analysis |
| 💡 **Recommendations** | Actionable optimization suggestions |

## 🔧 Requirements

- Node.js >= 14.0
- React >= 18.0

## 📊 Example Report

<details>
<summary>Click to expand example report</summary>

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

## State Management

- **Total State Updates:** 10
- **Redundant State Updates:** 2

## Performance Recommendations

- **Reduce Unnecessary Renders:** Consider using `React.memo()` to prevent re-renders when props haven't changed.
- **Optimize Render Performance:** The component has slow renders. Consider breaking it down into smaller components.
- **Reduce Redundant State Updates:** The component has redundant state updates. Consider using functional updates.
```
</details>

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check the [issues page](https://github.com/halitiince/blinkreact/issues).

## 📝 License

This project is [ISC](https://opensource.org/licenses/ISC) licensed.

---

<div align="center">
  <sub>Built with ❤️ for the React community</sub>
</div> 
