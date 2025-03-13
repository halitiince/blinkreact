import * as fs from 'fs';
import * as path from 'path';

/**
 * Instrument a React component with performance tracking code
 * @param componentCode Original component code
 * @param componentFilePath Path to the component file
 * @returns Instrumented component code
 */
export async function instrumentComponent(
  componentCode: string,
  componentFilePath: string
): Promise<string> {
  // Extract component name from file path
  const componentName = path.basename(componentFilePath).split('.')[0];
  
  // Add imports for performance tracking
  const instrumentedCode = `
// Instrumented by BlinkReact
import { useEffect, useRef } from 'react';
import { Profiler } from 'react';

// Original component code
${componentCode}

// Performance tracking HOC
export function withPerformanceTracking(Component) {
  const WrappedComponent = (props) => {
    const renderCount = useRef(0);
    const renderTimes = useRef([]);
    const startTime = useRef(0);
    
    useEffect(() => {
      renderCount.current += 1;
      console.log(\`[BlinkReact] ${componentName} rendered \${renderCount.current} times\`);
      
      return () => {
        // Log performance data on unmount
        console.log(\`[BlinkReact] ${componentName} render times: \${JSON.stringify(renderTimes.current)}\`);
      };
    });
    
    const handleRender = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
      renderTimes.current.push({
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      });
      
      console.log(\`[BlinkReact] ${componentName} render duration: \${actualDuration.toFixed(2)}ms\`);
    };
    
    return (
      <Profiler id="${componentName}" onRender={handleRender}>
        <Component {...props} />
      </Profiler>
    );
  };
  
  WrappedComponent.displayName = \`WithPerformanceTracking(\${Component.displayName || Component.name || '${componentName}'}\`;
  return WrappedComponent;
}

// Export the wrapped component
export default withPerformanceTracking(${componentName});
`;

  // Create a temporary instrumented file
  const tempFilePath = path.join(
    path.dirname(componentFilePath),
    `${componentName}.instrumented.jsx`
  );
  
  fs.writeFileSync(tempFilePath, instrumentedCode);
  
  return tempFilePath;
} 