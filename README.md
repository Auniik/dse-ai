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
dse-ai latest                   # By trading code (default)
dse-ai latest --by-change       # Sort by % change
dse-ai latest --by-value        # Sort by value
dse-ai latest --by-volume       # Sort by volume
dse-ai latest --by-ltp          # Sort by last trade price
dse-ai latest --alpha           # Sort alphabetically
dse-ai latest --debt            # Show debt board (treasury bonds)

# Get DSEX market data (with optional symbol filter)
dse-ai dsex
dse-ai dsex GRAMEEN

# Get top 30 performing stocks
dse-ai top30

# Get top 20 shares (3 tables: value, volume, trade)
dse-ai top20                  # Show all 3 tables
dse-ai top20 --value          # Only by value
dse-ai top20 --volume         # Only by volume
dse-ai top20 --trade          # Only by trade

# Get top 10 gainers and losers
dse-ai gainers                # Top 10 gainers of the day
dse-ai losers                 # Top 10 losers of the day

# Get company financial information
dse-ai company CITYBANK       # Get detailed company info
dse-ai company GP             # Get Grameenphone details

# Get market statistics and overview
dse-ai market-stats           # Full market overview with block trades
dse-ai stats                  # Alias for market-stats
dse-ai stats --no-block       # Hide block trades table

# Get circuit breaker status
dse-ai circuit                # Show circuit breaker hits
dse-ai circuit --upper        # Show only upper circuit hits
dse-ai circuit --lower        # Show only lower circuit hits
dse-ai circuit --all          # Show all circuit breaker limits

# Get sector-wise data
dse-ai sectors                # Show all sectors with median P/E ratios
dse-ai sectors --sector Bank  # Show all Bank sector stocks
dse-ai sectors --area 11      # Show stocks by area ID

# Get market summary and trends
dse-ai market-summary         # Show highest records + recent 10 days
dse-ai summary                # Alias
dse-ai summary --records      # Show only highest records
dse-ai summary --recent --days 30  # Show recent 30 days

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

# TOON format (compact for LLMs)
dse-ai latest --toon
```

## Features

- 🌐 **Direct scraping** from dsebd.org - No API server required
- 📊 **Beautiful tables** with colored output
- 🔄 **Automatic retry** with exponential backoff
- 📄 **Multiple formats** - Table, JSON, Markdown, TOON
- 🎨 **Color coding** - Green for positive, red for negative changes
- 🤖 **LLM-optimized** - TOON format reduces token usage for AI tools

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
- Latest (7 views):
  - https://dsebd.org/latest_share_price_scroll_l.php (by trading code - default)
  - https://dsebd.org/latest_share_price_scroll_by_change.php (by % change)
  - https://dsebd.org/latest_share_price_scroll_by_value.php (by value)
  - https://dsebd.org/latest_share_price_scroll_by_volume.php (by volume)
  - https://dsebd.org/latest_share_price_scroll_by_ltp.php (by last trade price)
  - https://dsebd.org/latest_share_price_alpha.php (alphabetically)
  - https://dsebd.org/latest_share_price_scroll_treasury_bond.php (debt board)
- DSEX: https://dsebd.org/dseX_share.php
- Top 30: https://dsebd.org/dse30_share.php
- Top 20: https://dsebd.org/top_20_share.php (3 tables: by value, volume, trade)
- Historical: https://dsebd.org/day_end_archive.php

## License

Apache-2.0
