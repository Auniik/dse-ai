# DSE-AI CLI Skill

This skill provides AI-friendly access to Dhaka Stock Exchange (DSE) data through a command-line interface.

## Available Commands

### Stock Data Commands (To be implemented)
- `dse-ai latest` - Get latest stock data for all instruments
- `dse-ai dsex [symbol]` - Get DSEX market data with optional symbol filter
- `dse-ai top30` - Get top 30 performing stocks
- `dse-ai historical --start DATE --end DATE [--inst SYMBOL]` - Get historical stock data

## Configuration

The CLI reads API base URL from:
1. Environment variable: `DSE_API_URL`
2. Config file: `~/.dse-ai/config.json`
3. Default: `http://localhost:8991`

Settings can be customized in `settings.yaml`:
- API base URL
- Timeout settings
- Output format preferences
- Cache configuration

## No Authentication Required

All DSE APIs are public and don't require authentication. The CLI can be used immediately without setup.

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
dse-ai latest
dse-ai dsex GRAMEEN
dse-ai top30
dse-ai historical --start 2024-01-01 --end 2024-01-31
```

## API Source

Data is fetched from DSentiment API (`/Users/anik/dev/auniik/dsentiment`) which scrapes:
- Dhaka Stock Exchange (dsebd.org)
- Real-time and historical stock market data
