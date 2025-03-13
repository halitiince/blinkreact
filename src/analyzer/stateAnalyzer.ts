import * as fs from 'fs';
import * as path from 'path';

export interface StateUpdate {
  stateName: string;
  updateCount: number;
  redundantUpdates: number;
}

export interface StateMetrics {
  totalStateUpdates: number;
  redundantStateUpdates: number;
  stateUpdateDetails: StateUpdate[];
}

/**
 * Analyze the state updates of a React component
 * @param instrumentedFilePath Path to the instrumented component file
 * @param originalFilePath Path to the original component file
 * @returns State metrics
 */
export async function analyzeStateUpdates(
  instrumentedFilePath: string,
  originalFilePath: string
): Promise<StateMetrics> {
  // Read the original component file to analyze state usage
  const originalCode = fs.readFileSync(originalFilePath, 'utf-8');
  
  // Extract state hooks and updates
  const stateHooks = extractStateHooks(originalCode);
  
  // Analyze state updates for redundancy
  const stateUpdateDetails = analyzeStateRedundancy(stateHooks, originalCode);
  
  // Calculate total metrics
  const totalStateUpdates = stateUpdateDetails.reduce(
    (total, state) => total + state.updateCount,
    0
  );
  
  const redundantStateUpdates = stateUpdateDetails.reduce(
    (total, state) => total + state.redundantUpdates,
    0
  );
  
  return {
    totalStateUpdates,
    redundantStateUpdates,
    stateUpdateDetails
  };
}

/**
 * Extract state hooks from component code
 * @param code Component code
 * @returns Array of state hook information
 */
function extractStateHooks(code: string): Array<{ name: string; setter: string }> {
  const stateHooks: Array<{ name: string; setter: string }> = [];
  
  // Match useState declarations
  // Example: const [count, setCount] = useState(0);
  const useStateRegex = /const\s+\[\s*(\w+)\s*,\s*(\w+)\s*\]\s*=\s*useState/g;
  let match;
  
  while ((match = useStateRegex.exec(code)) !== null) {
    stateHooks.push({
      name: match[1],
      setter: match[2]
    });
  }
  
  return stateHooks;
}

/**
 * Analyze state updates for redundancy
 * @param stateHooks Array of state hook information
 * @param code Component code
 * @returns Array of state update details
 */
function analyzeStateRedundancy(
  stateHooks: Array<{ name: string; setter: string }>,
  code: string
): StateUpdate[] {
  return stateHooks.map(hook => {
    // Count occurrences of the setter function
    const setterRegex = new RegExp(`${hook.setter}\\s*\\(`, 'g');
    const setterMatches = code.match(setterRegex);
    const updateCount = setterMatches ? setterMatches.length : 0;
    
    // Analyze for potential redundant updates
    // This is a simplified heuristic - in a real implementation, this would be more sophisticated
    const redundantUpdatePatterns = [
      // Same value set multiple times
      new RegExp(`${hook.setter}\\s*\\(\\s*${hook.name}\\s*\\)`, 'g'),
      // Setting in rapid succession
      new RegExp(`${hook.setter}\\([^;]+\\)[^;]*${hook.setter}\\(`, 'g')
    ];
    
    let redundantUpdates = 0;
    
    for (const pattern of redundantUpdatePatterns) {
      const matches = code.match(pattern);
      if (matches) {
        redundantUpdates += matches.length;
      }
    }
    
    return {
      stateName: hook.name,
      updateCount,
      redundantUpdates
    };
  });
} 