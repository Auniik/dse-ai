# DSE-AI CLI - Quick Start Guide

## Installation

```bash
cd /Users/anik/dev/auniik/dse-ai
npm run link
```

This will make `dse-ai` available globally on your system.

## Prerequisites

Make sure the DSentiment API server is running:

```bash
cd /Users/anik/dev/auniik/dsentiment
python main.py
```

The API will be available at `http://localhost:8991`

## Usage Examples

### 1. Configure API URL (Optional)

If your API is running on a different host/port:

```bash
# Interactive config
dse-ai config

# Direct config
dse-ai config --url http://localhost:8991

# Show current config
dse-ai config --show
```

### 2. Get Latest Stock Data

```bash
# Get all latest stock prices
dse-ai latest

# Output as JSON (for AI tools)
dse-ai latest --json

# Output as Markdown
dse-ai latest --markdown
```

### 3. Get DSEX Market Data

```bash
# Get all DSEX data
dse-ai dsex

# Filter by specific symbol
dse-ai dsex GRAMEEN
dse-ai dsex BRAC

# JSON output
dse-ai dsex GRAMEEN --json
```

### 4. Get Top 30 Stocks

```bash
# Get top 30 performing stocks
dse-ai top30

# JSON format
dse-ai top30 --json
```

### 5. Get Historical Data

```bash
# All instruments for date range
dse-ai historical --start 2024-01-01 --end 2024-01-31

# Specific instrument
dse-ai historical -s 2024-01-01 -e 2024-01-31 -i GRAMEEN

# Short form
dse-ai historical -s 2024-01-01 -e 2024-01-31 --inst BRAC

# JSON output
dse-ai historical -s 2024-01-01 -e 2024-01-31 --json
```

## Output Features

### Table Format (Default)
- Colored output for better readability
- Green text for positive changes
- Red text for negative changes
- Total record count at bottom

### JSON Format
- Perfect for AI tools and processing
- Use `--json` flag with any command

### Markdown Format
- Great for documentation
- Use `--markdown` flag with any command

## Help

```bash
# General help
dse-ai --help

# Command-specific help
dse-ai latest --help
dse-ai dsex --help
dse-ai top30 --help
dse-ai historical --help
dse-ai config --help
```

## Troubleshooting

### Connection Refused Error
Make sure the DSentiment API is running:
```bash
cd /Users/anik/dev/auniik/dsentiment
python main.py
```

### Wrong API URL
Check and update your config:
```bash
dse-ai config --show
dse-ai config --url http://localhost:8991
```

### Command Not Found
Link the package globally:
```bash
cd /Users/anik/dev/auniik/dse-ai
npm run link
```
