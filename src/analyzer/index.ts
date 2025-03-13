import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { generateReport } from '../utils/report';
import { instrumentComponent } from './instrumenter';
import { analyzeRenders } from './renderAnalyzer';
import { analyzeStateUpdates } from './stateAnalyzer';

/**
 * Main function to analyze a React component
 * @param componentFilePath Path to the React component file
 */
export async function analyzeComponent(componentFilePath: string): Promise<void> {
  // Check if file exists
  if (!fs.existsSync(componentFilePath)) {
    throw new Error(`Component file not found: ${componentFilePath}`);
  }

  // Check if file is a React component
  const fileContent = fs.readFileSync(componentFilePath, 'utf-8');
  if (!isReactComponent(fileContent)) {
    throw new Error(`File does not appear to be a React component: ${componentFilePath}`);
  }

  console.log(chalk.yellow('Step 1: Instrumenting component for analysis...'));
  const instrumentedCode = await instrumentComponent(fileContent, componentFilePath);
  
  console.log(chalk.yellow('Step 2: Analyzing render performance...'));
  const renderMetrics = await analyzeRenders(instrumentedCode, componentFilePath);
  
  console.log(chalk.yellow('Step 3: Analyzing state updates...'));
  const stateMetrics = await analyzeStateUpdates(instrumentedCode, componentFilePath);
  
  console.log(chalk.yellow('Step 4: Generating performance report...'));
  await generateReport({
    componentName: path.basename(componentFilePath),
    componentPath: componentFilePath,
    renderMetrics,
    stateMetrics
  });
  
  console.log(chalk.green('\n✅ Analysis complete! Report generated as PERFORMANCE_REPORT.md\n'));
}

/**
 * Check if a file contains a React component
 * @param fileContent Content of the file
 */
function isReactComponent(fileContent: string): boolean {
  // Simple check for React imports and component patterns
  const hasReactImport = /import.*React/i.test(fileContent);
  const hasComponentDefinition = /function.*\(.*\).*{|class.*extends.*Component|const.*=.*\(.*\).*=>|React\.FC/i.test(fileContent);
  const hasJSXReturn = /return.*</i.test(fileContent);
  const hasHooks = /useState|useEffect|useContext|useReducer|useCallback|useMemo|useRef/i.test(fileContent);
  
  return hasReactImport && ((hasComponentDefinition || hasJSXReturn) || hasHooks);
} 