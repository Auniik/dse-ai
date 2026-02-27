# dse-ai

AI-friendly CLI for Dhaka Stock Exchange (DSE) APIs

Access real-time and historical stock data from the Dhaka Stock Exchange through a simple command-line interface.

## Installation

```bash
npm install -g dse-ai
```

## Usage

### Commands

```bash
# Get latest stock data for all instruments
dse-ai latest

# Get DSEX market data (with optional symbol filter)
dse-ai dsex
dse-ai dsex GRAMEEN

# Get top 30 performing stocks
dse-ai top30

# Get historical data for a date range
dse-ai historical --start 2024-01-01 --end 2024-01-31
dse-ai historical --start 2024-01-01 --end 2024-01-31 --inst GRAMEEN

# Configure API settings
dse-ai config --show
dse-ai config --url http://localhost:8991
dse-ai config  # Interactive mode
```

### Output Formats

All data commands support multiple output formats:

```bash
# Default: Formatted table (colored)
dse-ai latest

# JSON format
dse-ai latest --json

# Markdown format
dse-ai latest --markdown
```

## Configuration

Set the API base URL in three ways (priority order):

1. **Command:** `dse-ai config --url http://your-api:port`
2. **Environment:** `export DSE_API_URL=http://your-api:port`
3. **Default:** `http://localhost:8991`

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build

# Link globally for testing
npm run link

# Run tests
npm test
```

## API Requirements

This CLI requires a running DSentiment API server. Start it with:

```bash
cd /path/to/dsentiment
python main.py
```

The API will be available at `http://localhost:8991`

## License

Apache-2.0
