# dse-ai

AI-friendly CLI for Dhaka Stock Exchange (DSE) APIs

Access real-time and historical stock data from the Dhaka Stock Exchange through a simple command-line interface.

## Installation

```bash
npm install -g dse-ai
```

## Usage

```bash
# Get latest stock data
dse-ai latest

# Get DSEX data (with optional symbol filter)
dse-ai dsex [symbol]

# Get top 30 stocks
dse-ai top30

# Get historical data
dse-ai historical --start 2024-01-01 --end 2024-01-31 [--inst SYMBOL]
```

## Configuration

Set the API base URL (default: http://localhost:8991):

```bash
export DSE_API_URL=http://your-api-server:port
```

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

## License

Apache-2.0
