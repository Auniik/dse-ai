# DSE-AI CLI Skill

This skill provides AI-friendly access to Dhaka Stock Exchange (DSE) data through a command-line interface.

## Data Source

**Direct web scraping** from dsebd.org - No API server or authentication required!

The CLI scrapes data directly from:
- Latest: https://dsebd.org/latest_share_price_scroll_l.php
- DSEX: https://dsebd.org/dseX_share.php
- Top 30: https://dsebd.org/dse30_share.php
- Top 20: https://dsebd.org/top_20_share.php
- Historical: https://dsebd.org/day_end_archive.php

## Available Commands

### Stock Data Commands
- `dse-ai latest` - Get latest stock data for all instruments
- `dse-ai dsex [symbol]` - Get DSEX market data with optional symbol filter
- `dse-ai top30` - Get top 30 performing stocks
- `dse-ai top20` - Get top 20 shares (3 tables: by value, volume, trade)
  - `--value` - Show only top 20 by value
  - `--volume` - Show only top 20 by volume
  - `--trade` - Show only top 20 by trade
- `dse-ai historical --start DATE --end DATE [--inst SYMBOL]` - Get historical stock data

### Output Options

All commands support:
- **Default**: Formatted table with colored output
- **JSON**: `--json` flag for programmatic processing
- **Markdown**: `--markdown` flag for documentation
- **TOON**: `--toon` flag for LLM-optimized compact format

## Features

- ✅ No authentication or setup required
- ✅ Direct scraping from official DSE website
- ✅ Automatic retry with exponential backoff
- ✅ Beautiful table formatting with color coding
- ✅ Multiple output formats (Table, JSON, Markdown)

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

## Implementation Details

Based on the Python implementation in `/Users/anik/dev/auniik/dsentiment/services/stock_service.py`:
- Uses cheerio for HTML parsing (like BeautifulSoup in Python)
- Implements retry logic with exponential backoff
- Parses table data from HTML responses
- No external API dependencies
