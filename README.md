# dse-ai

AI-friendly CLI for Dhaka Stock Exchange (DSE) data

Scrapes real-time and historical stock data directly from the Dhaka Stock Exchange website (dsebd.org).

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

## Features

- 🌐 **Direct scraping** from dsebd.org - No API server required
- 📊 **Beautiful tables** with colored output
- 🔄 **Automatic retry** with exponential backoff
- 📄 **Multiple formats** - Table, JSON, Markdown
- 🎨 **Color coding** - Green for positive, red for negative changes

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

## Data Source

All data is scraped directly from:
- Latest: https://dsebd.org/latest_share_price_scroll_l.php
- DSEX: https://dsebd.org/dseX_share.php
- Top 30: https://dsebd.org/dse30_share.php
- Historical: https://dsebd.org/day_end_archive.php

## License

Apache-2.0
