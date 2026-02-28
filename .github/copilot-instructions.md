# Copilot Instructions for dse-ai

## Overview

dse-ai is a TypeScript CLI that scrapes stock market data directly from the Dhaka Stock Exchange website (dsebd.org). It uses web scraping (cheerio) instead of APIs, with no authentication required.

## Build & Test Commands

```bash
# Build TypeScript to dist/
npm run build

# Run in dev mode (auto-compile with tsx)
npm run dev

# Test commands
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only

# Link for local testing
npm run link                # Builds and links globally as 'dse-ai'
```

## Architecture

### Data Flow
1. **Commands** (`src/commands/*.ts`) - CLI command definitions using commander.js
2. **API Client** (`src/lib/api-client.ts`) - Fetches and parses HTML from dsebd.org
3. **Formatter** (`src/lib/formatter.ts`) - Converts data to table/JSON/markdown
4. **CLI Entry** (`src/cli.ts`) - Registers commands and parses argv

### Web Scraping Pattern
- Uses `cheerio` to parse HTML tables from dsebd.org
- Implements retry logic with exponential backoff (3 retries, 2^n seconds)
- Extracts headers from `<th>` tags, data from `<td>` rows
- No API server dependency - scrapes directly from source

### Command Structure
All commands follow this pattern:
```typescript
export function commandName(program: Command): void {
  program
    .command('name [args]')
    .description('...')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .action(async (args, options) => {
      const spinner = ora('Loading...').start();
      try {
        const client = new DseApiClient();
        const data = await client.getMethod();
        spinner.succeed('Done!');
        // Format output based on options
      } catch (error) {
        spinner.fail('Failed');
        process.exit(1);
      }
    });
}
```

## Key Conventions

### Import Extensions
TypeScript files **must** import with `.js` extension (not `.ts`) due to NodeNext module resolution:
```typescript
import { DseApiClient } from '../lib/api-client.js';  // ✓ Correct
import { DseApiClient } from '../lib/api-client';     // ✗ Won't compile
```

### Output Formatting
- Default: Colored tables via `cli-table3`
- `--json`: Raw JSON array for programmatic use
- `--markdown`: Pipe-separated markdown tables
- `--toon`: TOON format (Token-Oriented Object Notation) for LLM efficiency
- Change detection: Automatically colors positive values green, negative red

### Scraping Targets
Fixed URLs in `api-client.ts`:
- Latest: `/latest_share_price_scroll_l.php`
- DSEX: `/dseX_share.php`
- Top 30: `/dse30_share.php`
- Historical: `/day_end_archive.php` (with query params)

### Error Handling
- Always use `ora` spinner for async operations
- Exit with code 1 on errors
- Log errors with `chalk.red()`

## Testing

Tests use vitest. Place in `tests/unit/` or `tests/integration/`.

Run single test file:
```bash
npx vitest run tests/unit/api-client.test.ts
```

## Dependencies

Minimal runtime deps:
- `commander` - CLI framework
- `cheerio` - HTML parsing (like BeautifulSoup)
- `chalk` - Terminal colors
- `cli-table3` - Table formatting
- `ora` - Loading spinners

No authentication, config files, or API keys needed.

# Code Constraints:
- No needs comments inside the codebase. codebase should be self-explanatory with clear function and variable names.
- No console logs except for final output
- Use async/await for all async operations
- Strict TypeScript types with interfaces
- Use single responsibility principle for functions and classes
- No external state or side effects outside of CLI output
- Act as a Pair Programmer and TypeScript expert with 10+ years of experience in writing clean, maintainable code.
- Always follow best practices for TypeScript and Node.js development.
- Do not use any deprecated or experimental features. Stick to stable APIs and patterns.
