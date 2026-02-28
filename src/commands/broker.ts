import { Command } from 'commander';
import chalk from 'chalk';
import { spawn, execSync } from 'child_process';

export function createBrokerCommand() {
  const command = new Command('broker');

  command.description('Broker integrations for portfolio management');

  const shantaCommand = new Command('shanta');
  shantaCommand
    .description('Shanta Securities Limited integration (requires shanta-ai CLI)')
    .allowUnknownOption()
    .allowExcessArguments()
    .action((_options, cmd) => {
      try {
        execSync('which shanta-ai', { stdio: 'pipe' });
      } catch (error) {
        console.log(chalk.red('\n❌ shanta-ai CLI not found'));
        console.log(chalk.gray('💡 Install shanta-ai to use this feature\n'));
        process.exit(1);
      }

      const args = cmd.args;
      const child = spawn('shanta-ai', args, {
        stdio: 'inherit',
        shell: false
      });

      child.on('exit', (code) => {
        process.exit(code || 0);
      });

      child.on('error', (error) => {
        console.error(chalk.red(`Failed to execute shanta-ai: ${error.message}`));
        process.exit(1);
      });
    });

  command.addCommand(shantaCommand);

  return command;
}
