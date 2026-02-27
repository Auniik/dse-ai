# DSE-AI CLI Skill

This skill provides AI-friendly access to DSentiment APIs through a command-line interface.

## Available Commands

### Authentication
- `dse-ai auth` - Authenticate with DSentiment API
- `dse-ai whoami` - Display current authentication information
- `dse-ai logout` - Remove stored credentials

## Configuration

The CLI stores authentication credentials in `~/.dse-ai/auth.json`.

Settings can be customized in `settings.yaml`:
- API base URL
- Timeout settings
- Output format preferences
- Cache configuration

## Development

```bash
# Install dependencies
npm install

# Run in dev mode
npm run dev

# Build
npm run build

# Run tests
npm test

# Link globally for testing
npm run link
```

## Testing the CLI

After linking globally:
```bash
dse-ai --help
dse-ai auth
dse-ai whoami
```

## Next Steps

Add commands for DSentiment API endpoints based on the functionality in `/Users/anik/dev/auniik/dsentiment`.
