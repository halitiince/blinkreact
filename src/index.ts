#!/usr/bin/env node

import { Command } from 'commander';
import { analyzeComponent } from './analyzer/index';
import { version } from '../package.json';
import chalk from 'chalk';

const program = new Command();

program
  .name('blinkreact')
  .description('Analyze React component performance')
  .version(version)
  .argument('<component-file>', 'React component file to analyze')
  .action(async (componentFile) => {
    try {
      console.log(chalk.blue(`\n🔍 BlinkReact - Analyzing ${componentFile}...\n`));
      await analyzeComponent(componentFile);
    } catch (error: unknown) {
      console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : String(error)}\n`));
      process.exit(1);
    }
  });

program.parse(process.argv); 