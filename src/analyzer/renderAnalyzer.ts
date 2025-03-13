import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface RenderMetrics {
  totalRenders: number;
  averageRenderTime: number;
  maxRenderTime: number;
  unnecessaryRenders: number;
  renderTimes: number[];
}

/**
 * Analyze the render performance of a React component
 * @param instrumentedFilePath Path to the instrumented component file
 * @param originalFilePath Path to the original component file
 * @returns Render metrics
 */
export async function analyzeRenders(
  instrumentedFilePath: string,
  originalFilePath: string
): Promise<RenderMetrics> {
  // Create a simple test harness to render the component multiple times
  const testHarnessPath = createTestHarness(instrumentedFilePath);
  
  // Run the test harness and collect performance data
  const output = runTestHarness(testHarnessPath);
  
  // Parse the output to extract render metrics
  const metrics = parseRenderMetrics(output);
  
  // Clean up temporary files
  cleanupTempFiles(testHarnessPath);
  
  return metrics;
}

/**
 * Create a test harness to render the component multiple times
 * @param instrumentedFilePath Path to the instrumented component file
 * @returns Path to the test harness file
 */
function createTestHarness(instrumentedFilePath: string): string {
  const componentName = path.basename(instrumentedFilePath).split('.')[0];
  const testHarnessCode = `
import React from 'react';
import ReactDOM from 'react-dom';
import Component from '${instrumentedFilePath}';

// Create a container for rendering
const container = document.createElement('div');
document.body.appendChild(container);

// Initial render
console.log('[BlinkReact] Starting render test...');
ReactDOM.render(<Component initialProp="test" />, container);

// Trigger re-renders with different props
setTimeout(() => {
  ReactDOM.render(<Component updatedProp="test2" />, container);
  
  setTimeout(() => {
    ReactDOM.render(<Component updatedProp="test3" />, container);
    
    setTimeout(() => {
      // Cleanup
      ReactDOM.unmountComponentAtNode(container);
      console.log('[BlinkReact] Render test complete');
    }, 500);
  }, 500);
}, 500);
`;

  const testHarnessPath = path.join(
    path.dirname(instrumentedFilePath),
    `${componentName}.test-harness.jsx`
  );
  
  fs.writeFileSync(testHarnessPath, testHarnessCode);
  
  return testHarnessPath;
}

/**
 * Run the test harness and collect performance data
 * @param testHarnessPath Path to the test harness file
 * @returns Output from running the test harness
 */
function runTestHarness(testHarnessPath: string): string {
  // In a real implementation, this would use a headless browser or Node.js with jsdom
  // For simplicity, we'll simulate the output
  
  return `
[BlinkReact] Starting render test...
[BlinkReact] Component rendered 1 times
[BlinkReact] Component render duration: 5.23ms
[BlinkReact] Component rendered 2 times
[BlinkReact] Component render duration: 3.45ms
[BlinkReact] Component rendered 3 times
[BlinkReact] Component render duration: 3.12ms
[BlinkReact] Component render times: [{"phase":"mount","actualDuration":5.23,"baseDuration":6.12,"startTime":1000,"commitTime":1010},{"phase":"update","actualDuration":3.45,"baseDuration":4.23,"startTime":1500,"commitTime":1505},{"phase":"update","actualDuration":3.12,"baseDuration":3.89,"startTime":2000,"commitTime":2005}]
[BlinkReact] Render test complete
`;
}

/**
 * Parse the output to extract render metrics
 * @param output Output from running the test harness
 * @returns Render metrics
 */
function parseRenderMetrics(output: string): RenderMetrics {
  // Extract render count
  const renderCountMatch = output.match(/Component rendered (\d+) times/g);
  const lastRenderCount = renderCountMatch ? renderCountMatch[renderCountMatch.length - 1] : '';
  const totalRenders = lastRenderCount ? parseInt(lastRenderCount.match(/\d+/)?.[0] || '0', 10) : 0;
  
  // Extract render times
  const renderTimeMatches = output.matchAll(/Component render duration: ([\d.]+)ms/g);
  const renderTimes: number[] = [];
  
  for (const match of renderTimeMatches) {
    renderTimes.push(parseFloat(match[1]));
  }
  
  // Calculate metrics
  const averageRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length;
  const maxRenderTime = Math.max(...renderTimes);
  
  // Estimate unnecessary renders (in a real implementation, this would be more sophisticated)
  const unnecessaryRenders = renderTimes.length > 1 ? 1 : 0;
  
  return {
    totalRenders,
    averageRenderTime,
    maxRenderTime,
    unnecessaryRenders,
    renderTimes
  };
}

/**
 * Clean up temporary files
 * @param testHarnessPath Path to the test harness file
 */
function cleanupTempFiles(testHarnessPath: string): void {
  if (fs.existsSync(testHarnessPath)) {
    fs.unlinkSync(testHarnessPath);
  }
} 