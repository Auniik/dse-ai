# DSE-AI Development Roadmap

**Project**: dse-ai - AI-friendly CLI for Dhaka Stock Exchange data analysis  
**Goal**: Provide comprehensive market data for AI-powered investment recommendations  
**Current Status**: 20 commands implemented! 95% Complete 🎉

---

## Progress Overview

- **Phase 0 (Foundation)**: ✅ 100% Complete (5/5)
- **Phase 1 (Quick Wins)**: ✅ 100% Complete (4/4)
- **Phase 2 (Fundamental Analysis)**: ✅ 75% Complete (3/4) - AGM skipped (PDF-only)
- **Phase 3 (Advanced Analysis)**: ✅ 75% Complete (3/4) - Monthly Reviews skipped (PDF-only)
- **Phase 4 (Specialized)**: ✅ 25% Complete (1/4) - Global Markets implemented
- **Bonus Features**: ✅ 4 Complete

**Overall Progress**: 86% (16/19 HTML-scrapable features + 4 bonus = 20 commands)**

**Features Skipped (PDF-only):**
- Phase 2.1: AGM/EGM (PDF files only)
- Phase 3.1: Monthly Reviews (PDF files only)
- Phase 4.4: Fortnightly Reports (PDF files only)

**Remaining Features:**
- Phase 4.1: IPO Results & Calendar
- Phase 4.2: DSES Shariah Index

---

## Phase 0: Foundation ✅ COMPLETE

Core market data commands - **Status: 5/5 Complete**

### Commands Implemented:
- [x] `dse-ai latest` - Latest share prices (7 sorting options)
  - [x] By trading code (default)
  - [x] By % change
  - [x] By value
  - [x] By volume
  - [x] By last trade price (LTP)
  - [x] Alphabetically
  - [x] Debt board (treasury bonds)
- [x] `dse-ai dsex [SYMBOL]` - DSEX market data with optional filtering
- [x] `dse-ai top30` - Top 30 performing stocks (DS30 Index)
- [x] `dse-ai top20` - Top 20 shares (by value/volume/trade)
- [x] `dse-ai historical` - Historical data for date ranges
- [x] `dse-ai gainers` - Top 10 daily gainers (Phase 1.1)
- [x] `dse-ai losers` - Top 10 daily losers (Phase 1.1)
- [x] `dse-ai company <SYMBOL>` - Company financials & fundamentals (Phase 1.2)
- [x] `dse-ai market-stats` (alias: `stats`) - Market statistics & overview (Phase 1.3)
- [x] `dse-ai circuit` - Circuit breaker status and limits (Phase 1.4)
- [x] `dse-ai sectors` - Sectoral P/E ratios and performance (Phase 2.3)
- [x] `dse-ai market-summary` (alias: `summary`) - Market summary & highest records (Phase 2.4)

### Features:
- [x] Full date/time headers from DSE website
- [x] Multiple output formats (table, JSON, markdown, TOON)
- [x] Color-coded tables (green/red for changes)
- [x] Refactored single-responsibility scrapers
- [x] Retry logic with exponential backoff
- [x] All tests passing

---

## Phase 1: Quick Wins - High Impact ✅ COMPLETE

**Priority**: HIGH  
**Target**: 4 new commands  
**Status**: 4/4 Complete  
**Estimated Effort**: 2-3 days

### 1.1 Top Gainers/Losers ✅
- [x] Command: `dse-ai gainers`
  - [x] Scrape `top_ten_gainer.php`
  - [x] Parse top 10 daily gainers with % change
  - [x] Add date header extraction
  - [x] Support all output formats
  - [x] Add tests
- [x] Command: `dse-ai losers`
  - [x] Scrape `top_ten_loser.php`
  - [x] Parse top 10 daily losers with % change
  - [x] Add date header extraction
  - [x] Support all output formats
  - [x] Add tests
- [x] Create `src/lib/scrapers/movers-scraper.ts`
- [x] Create `src/commands/gainers.ts`
- [x] Create `src/commands/losers.ts`
- [x] Update README with new commands
- [x] **AI Value**: Momentum trading signals, market sentiment

### 1.2 Company Financials & Fundamentals ✅
- [x] Command: `dse-ai company <SYMBOL>`
  - [x] Scrape `displayCompany.php?name={SYMBOL}`
  - [x] Parse company profile (name, sector, trading code)
  - [x] Extract financial metrics:
    - [x] P/E ratio (Basic & Diluted)
    - [x] EPS (Earnings Per Share - Basic & Diluted)
    - [x] NAV (Net Asset Value per share)
    - [x] Profit for year
    - [x] Market Cap & Free Float Cap
    - [x] Authorized/Paid-up Capital
  - [x] Parse dividend history (Cash, Bonus, Right Issue)
  - [x] Extract shareholding pattern (Sponsor/Govt/Institute/Foreign/Public)
  - [x] Parse AGM information (date, year ended)
  - [x] Extract contact details (website, email, phone)
  - [x] Support all output formats
  - [x] Add rich formatted table output
- [x] Create `src/lib/scrapers/company-scraper.ts`
- [x] Create `src/commands/company.ts`
- [x] Update `src/lib/api-client.ts`
- [x] Update README with company command
- [x] **AI Value**: Fundamental analysis, valuation metrics, dividend screening

### 1.3 Market Statistics ✅
- [x] Command: `dse-ai market-stats` (alias: `stats`)
  - [x] Scrape `market-statistics.php`
  - [x] Parse market overview data
  - [x] Extract category performance (A, B, N, Z, MF, CB, G-Sec)
  - [x] Parse market breadth (advanced/declined/unchanged by category)
  - [x] Extract total transactions (trades, volume, value)
  - [x] Parse market capitalization (equity, MF, debt)
  - [x] Extract block trade data (42+ daily transactions)
  - [x] Add --no-block flag to hide block trades
  - [x] Support all output formats
- [x] Create `src/lib/scrapers/market-stats-scraper.ts`
- [x] Create `src/commands/market-stats.ts`
- [x] Update `src/lib/api-client.ts`
- [x] Update README
- [x] **AI Value**: Market sentiment analysis, breadth indicators, large block detection

### 1.4 Circuit Breaker Status ✅
- [x] Command: `dse-ai circuit`
  - [x] Scrape `cbul.php`
  - [x] Parse all circuit breaker limits (650+ stocks)
  - [x] Filter stocks hitting circuit breakers
  - [x] Detect upper circuit hits
  - [x] Detect lower circuit hits
  - [x] Add flag: `--upper` for upper circuit only
  - [x] Add flag: `--lower` for lower circuit only
  - [x] Add flag: `--all` to show all limits
  - [x] Support all output formats
- [x] Create `src/lib/scrapers/circuit-scraper.ts`
- [x] Create `src/commands/circuit.ts`
- [x] Update `src/lib/api-client.ts`
- [x] Update README
- [x] **AI Value**: Volatility alerts, risk indicators, extreme price movement detection

---

## Phase 2: Fundamental Analysis 📊

**Priority**: HIGH  
**Target**: 4 new commands  
**Status**: 3/4 Complete (75%) - AGM skipped (PDF-only)  
**Estimated Effort**: 3-4 days

### 2.1 AGM/EGM and Record Dates [ ]
- [ ] Command: `dse-ai agm`
  - [ ] Scrape `CompAGM&RecordDate.php`
  - [ ] Parse upcoming AGMs/EGMs
  - [ ] Extract record dates
  - [ ] Parse dividend announcements
  - [ ] Add flag: `--upcoming` for future events only
  - [ ] Add flag: `--symbol <SYMBOL>` for company filter
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/agm-scraper.ts`
- [ ] Create `src/commands/agm.ts`
- [ ] Update README
- [ ] **AI Value**: Dividend capture strategies, corporate action tracking

### 2.2 Financial Statements Submission Status ✅ COMPLETE
- **Status**: Implemented - AJAX endpoint reverse-engineered successfully
- **URL**: `https://www.dsebd.org/ajax/load-financial-upload-status.php` (POST)
- [x] Command: `dse-ai compliance`
  - [x] AJAX POST to `ajax/load-financial-upload-status.php`
  - [x] Parse quarterly and annual submission status
  - [x] Extract compliance deadlines, submission dates, status
  - [x] Filter by symbol (--symbol)
  - [x] Filter by quarter (--q1, --q2, --q3, --annual)
  - [x] Filter by status (--non-submitted, --delayed)
  - [x] Status color coding (🟢 Submitted, 🟡 Delayed, 🔴 Non-Submission)
  - [x] Support all output formats (table/json/markdown/toon)
  - [x] Summary statistics display
- [x] Create `src/lib/scrapers/financial-compliance-scraper.ts`
- [x] Create `src/commands/compliance.ts`
- [x] Update README
- [x] **AI Value**: Risk assessment, regulatory compliance screening, deadline tracking

**Implementation Details:**
- **AJAX Endpoint**: POST to `ajax/load-financial-upload-status.php`
- **Parameters**: 
  - `tradeCode`: Company symbol (required)
  - `quarters[]`: Array of Q1, Q2, Q3, Annual (defaults to all if not specified)
- **Data**: 11 columns including deadlines, submission dates, status, website upload status
- **Discovery**: Simple POST request, no authentication needed


### 2.3 Company by Category/Sector ✅ 
- [x] Command: `dse-ai sectors`
  - [x] Scrape `sectoral_PE.php` for P/E ratios
  - [x] Scrape `ltp_industry.php?area={id}` for sector stocks
  - [x] Parse all 19 sectors with median P/E
  - [x] Extract companies per sector with performance
  - [x] Show sector-wise stock lists
  - [x] Add flag: `--sector <NAME>` for specific sector
  - [x] Add flag: `--area <ID>` for sector by area ID
  - [x] Support all output formats
- [x] Create `src/lib/scrapers/sector-scraper.ts`
- [x] Create `src/commands/sectors.ts`
- [x] Update `src/lib/api-client.ts`
- [x] Update README
- [x] **AI Value**: Sector rotation strategies, comparative sector analysis, identify sector leaders
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/sector-scraper.ts`
- [ ] Create `src/commands/sector.ts`
- [ ] Update README
- [ ] **AI Value**: Sector-wise analysis, peer comparison

### 2.4 Recent Market Information Daily Trends ✅
- [x] Command: `dse-ai market-summary` (alias: `summary`)
  - [x] Scrape `recent_market_information.php`
  - [x] Parse highest records (all-time peaks):
    - [x] Total trades, volume, value
    - [x] Market capitalization
    - [x] All indices (DSEX, DSES, DS30, DGEN)
  - [x] Parse daily market metrics (last 30 days):
    - [x] Total Trade count
    - [x] Total Volume
    - [x] Total Value
    - [x] Market Capitalization
    - [x] All index values
  - [x] Show historical trend (configurable days)
  - [x] Add flag: `--days <N>` for custom range (default: 10)
  - [x] Add flag: `--records` for only highest records
  - [x] Add flag: `--recent` for only daily data
  - [x] Support all output formats
- [x] Create `src/lib/scrapers/market-summary-scraper.ts`
- [x] Create `src/commands/market-summary.ts`
- [x] Update `src/lib/api-client.ts`
- [x] Update README
- [x] **AI Value**: Market activity trends, liquidity analysis, compare current vs historical peaks

---

## Phase 3: Advanced Analysis 🎯

**Priority**: MEDIUM  
**Target**: 4 new features  
**Status**: 3/4 Complete (75%) - Monthly Reviews skipped (PDF-only)  
**Estimated Effort**: 4-5 days

### 3.1 Monthly Reviews & Graphs ❌ SKIPPED (PDF-only)
- **Status**: Skipped - Data only available as PDF files
- **URL**: `mrg.php` - Only contains PDF download links
- **Reason**: Would require PDF parsing library (pdfplumber/tesseract)
- **Decision**: Skip for now, focus on HTML/text scrapable data

### 3.2 Block Transactions ✅ COMPLETE
- [x] Command: `dse-ai block-trades` (alias: `blocks`)
  - [x] Data source identified: `mst.txt` (plain text file)
  - [x] Parse block trades from fixed-width text format
  - [x] Extract: instrument code, max/min price, trades, quantity, value
  - [x] Add flag: `--min-value <AMOUNT>` for filtering (e.g., >= 20M Tk)
  - [x] Add flag: `--symbol <CODE>` for instrument filter
  - [x] Add flag: `--top <N>` to limit results (default: 20)
  - [x] Support all output formats (table/json/markdown/toon)
  - [x] Color-coded values (green: >=10M, yellow: >=5M)
- [x] Create `src/lib/scrapers/block-trades-scraper.ts`
- [x] Create `src/commands/block-trades.ts`
- [x] Update README with examples
- [x] **AI Value**: Track institutional activity & smart money flow

**Implementation Details:**
- **URL**: `https://www.dsebd.org/mst.txt`
- **Data**: 43 scrips, 124 trades, 5.5M shares, 617.7M Tk (on Feb 26)
- **Format**: Plain text (fixed-width) - easier than HTML!
- **Top Trades**: ORIONINFU (234.8M), GP (188.2M), RENATA (45.8M)
- **Use Case**: Identify where big institutional players are investing

### 3.3 Corporate Announcements & News Archive ✅ COMPLETE
- **Status**: Implemented - Uses simple HTTP GET (not AJAX)
- **URL**: `old_news.php` with query parameters
- **Implementation**: Simple HTML scraping, no AJAX required
- [x] Command: `dse-ai news`
  - [x] Scrape `old_news.php?startDate=X&endDate=Y&criteria=4` (date range)
  - [x] Scrape `old_news.php?inst=SYMBOL&criteria=3` (by company)
  - [x] Parse news items with trading code, title, content, date
  - [x] Support --days (last N days), --symbol (company filter)
  - [x] Support --start-date and --end-date for custom ranges
  - [x] Support --limit for pagination
  - [x] All output formats (table/json/markdown/toon)
- [x] Create `src/lib/scrapers/news-scraper.ts`
- [x] Create `src/commands/news.ts`
- [x] Update README with examples
- [x] **AI Value**: News sentiment analysis, event-driven trading signals

**Implementation Details:**
- **URL**: `https://dsebd.org/old_news.php`
- **Parameters**: 
  - `criteria=3`: Search by company symbol (inst parameter)
  - `criteria=4`: Search by date range (startDate, endDate)
- **Data**: Trading code, news title, news content, post date
- **Default**: Last 30 days of news

### 3.4 Going Concern Threat List ✅ COMPLETE
- [x] Command: `dse-ai risk-screen` (alias: `risk`)
  - [x] Scrape `going-concern-threat-list.php`
  - [x] Parse companies at bankruptcy risk
  - [x] Display trading code, company name, and threat status
  - [x] Support all output formats (table/json/markdown/toon)
  - [x] Color-coded risk warnings
- [x] Create `src/lib/scrapers/risk-scraper.ts`
- [x] Create `src/commands/risk-screen.ts`
- [x] Update README with examples
- [x] **AI Value**: Critical risk avoidance - flags companies facing bankruptcy/delisting

**Implementation Details:**
- **URL**: `https://dsebd.org/going-concern-threat-list.php`
- **Data**: Trading code, company name, going concern status
- **Output**: Currently shows 35 companies with threats
- **Use Case**: Automatically filter out high-risk companies from investment pool

---

## Phase 4: Specialized Features 🌟

**Priority**: LOW  
**Target**: 4 new features  
**Status**: 1/4 Complete (25%) - 1 implemented (global markets), 2 pending, 1 PDF-only  
**Estimated Effort**: 3-4 days

### 4.1 IPO Results & Calendar [ ]
- [ ] Command: `dse-ai ipo`
  - [ ] Scrape `ipo_result.php`
  - [ ] Parse recent IPO listings
  - [ ] Extract allocation results
  - [ ] Show upcoming IPO calendar
  - [ ] Add flag: `--results` for past IPOs
  - [ ] Add flag: `--upcoming` for future IPOs
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/ipo-scraper.ts`
- [ ] Create `src/commands/ipo.ts`
- [ ] Update README
- [ ] **AI Value**: New investment opportunities, listing day analysis

### 4.2 DSES Shariah Index [ ]
- [ ] Command: `dse-ai shariah`
  - [ ] Identify DSES data source
  - [ ] Parse Shariah-compliant stocks
  - [ ] Show DSES index performance
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/shariah-scraper.ts`
- [ ] Create `src/commands/shariah.ts`
- [ ] Update README
- [ ] **AI Value**: Ethical investing, niche market analysis

### 4.3 Comparison of Markets ✅ COMPLETE (Bonus Feature)
- **Status**: Implemented as `global-markets` command
- [x] Command: `dse-ai global-markets` (alias: `global`)
  - [x] Scrape `markets.php`
  - [x] Parse DSE vs other exchanges comparison
  - [x] Support all output formats
  - [x] Filter by region and country
- [x] Create `src/lib/scrapers/global-markets-scraper.ts`
- [x] Create `src/commands/global-markets.ts`
- [x] Update README
- [x] **AI Value**: Relative market performance, global context for DSE

**Note**: This was implemented as a bonus feature but fulfills the Phase 4.3 requirements.

### 4.4 Fortnightly Capital Market Reports [ ]
- [ ] Command: `dse-ai fortnightly`
  - [ ] Scrape `Fortnightly_Capital_Market.php`
  - [ ] Parse bi-weekly market reports
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/fortnightly-scraper.ts`
- [ ] Create `src/commands/fortnightly.ts`
- [ ] Update README
- [ ] **AI Value**: Medium-term trend analysis

---

## Phase 5: AI Integration & Analysis (Future)

**Priority**: FUTURE  
**Status**: Not Started  
**Estimated Effort**: 2-3 weeks

### 5.1 AI Analysis Engine [ ]
- [ ] Create analysis module
- [ ] Implement momentum scoring algorithm
- [ ] Implement fundamental scoring algorithm
- [ ] Implement risk scoring algorithm
- [ ] Create portfolio recommendation engine
- [ ] Add command: `dse-ai analyze`

### 5.2 Smart Recommendations [ ]
- [ ] Daily top picks command
- [ ] Risk alerts command
- [ ] Dividend opportunities command
- [ ] Sector rotation signals
- [ ] Value picks identification
- [ ] Smart money flow tracking

### 5.3 Portfolio Builder [ ]
- [ ] Portfolio optimization algorithm
- [ ] Risk-adjusted recommendations
- [ ] Diversification scoring
- [ ] Add command: `dse-ai portfolio`

---

## Bonus Features 🎁

### Market Overview from mst.txt ✅ COMPLETE
- [x] Command: `dse-ai market-overview` (alias: `overview`)
  - [x] Parse category statistics (All, A, B, N, Z, MF, CB, G-Sec)
  - [x] Extract total transactions (trades, volume, value)
  - [x] Parse market capitalization breakdown
  - [x] Add flags: `--categories`, `--transactions`, `--market-cap`
  - [x] Support all output formats (table/json/markdown/toon)
  - [x] Color-coded tables with percentages
- [x] Create `src/lib/scrapers/market-overview-scraper.ts`
- [x] Create `src/commands/market-overview.ts`
- [x] Update README with examples
- [x] **AI Value**: Complete market snapshot in one command

**Implementation Details:**
- **Data Source**: Same `mst.txt` file used for block trades
- **Efficiency**: One HTTP call gets both block trades AND market overview
- **Market Cap**: 7.18 Trillion Tk total (50.3% equity, 49.4% debt)
- **Market Activity**: 239 advanced vs 93 declined (strong bullish day)
- **Use Case**: Daily market health check, sentiment analysis

### Marginable Securities ✅ COMPLETE
- [x] Command: `dse-ai marginable` (alias: `margin`)
  - [x] Scrape `marginable-securities.php`
  - [x] Parse all margin-eligible securities
  - [x] Extract: trading code, company name, category
  - [x] Add flag: `--category <CAT>` for filtering
  - [x] Add flag: `--symbol <CODE>` for searching
  - [x] Support all output formats (table/json/markdown/toon)
  - [x] Show category breakdown
- [x] Create `src/lib/scrapers/marginable-scraper.ts`
- [x] Create `src/commands/marginable.ts`
- [x] Update README with examples
- [x] **AI Value**: Identify stocks available for leveraged trading

**Implementation Details:**
- **URL**: `https://www.dsebd.org/marginable-securities.php`
- **Total**: 123 securities eligible for margin financing
- **Breakdown**: 117 Category A, 6 Category B
- **Use Case**: Filter stocks eligible for margin trading/financing
- **Common Searches**: Banks, pharma, telecom all marginable

### Global Markets Comparison ✅ COMPLETE
- [x] Command: `dse-ai global-markets` (alias: `global`)
  - [x] Scrape `markets.php`
  - [x] Parse international market indices
  - [x] Extract: country, index, monthly/yearly changes, GDP, inflation, interest rates
  - [x] Add flag: `--region <NAME>` for filtering by region
  - [x] Add flag: `--country <NAME>` for searching specific country
  - [x] Support all output formats (table/json/markdown/toon)
  - [x] Group display by region
  - [x] Highlight Bangladesh data
- [x] Create `src/lib/scrapers/global-markets-scraper.ts`
- [x] Create `src/commands/global-markets.ts`
- [x] Update README with examples
- [x] **AI Value**: Compare DSE performance with global markets

**Implementation Details:**
- **URL**: `https://www.dsebd.org/markets.php`
- **Regions**: Asia Pacific, Asian Giants, Europe, USA
- **Countries**: 15+ markets including Bangladesh, India, Pakistan, USA, UK, etc.
- **Data**: Stock indices, GDP growth, inflation, interest rates
- **Bangladesh Metrics**: DSEX 4,865 (-2.28% MoM, -6.73% YoY), GDP 11%, Inflation -15.18%
- **Use Case**: Benchmark DSE against regional and global markets

### Actuarial Valuation Status ✅ COMPLETE
- [x] Command: `dse-ai actuarial` (alias: `insurance`)
  - [x] Scrape `actuarial-valuation-status.php`
  - [x] Parse insurance companies' actuarial valuation status
  - [x] Extract: trading code, company name, compliance status
  - [x] Add flag: `--compliant` for compliant companies only
  - [x] Add flag: `--non-compliant` for non-compliant companies only
  - [x] Support all output formats (table/json/markdown/toon)
  - [x] Show compliance rate statistics
- [x] Create `src/lib/scrapers/actuarial-scraper.ts`
- [x] Create `src/commands/actuarial.ts`
- [x] Update README with examples
- [x] **AI Value**: Compliance check for insurance sector investments

**Implementation Details:**
- **URL**: `https://www.dsebd.org/actuarial-valuation-status.php`
- **Total**: 15 life insurance companies
- **Compliance**: 10 compliant (66.7%), 5 non-compliant (33.3%)
- **Non-Compliant**: FAREASTLIF, PADMALIFE, PRIMELIFE, PROGRESLIF, SUNLIFEINS
- **Use Case**: Risk screening for insurance sector, regulatory compliance check

---

## Testing & Quality

### Test Coverage Goals
- [ ] Phase 1: 80% coverage for new scrapers
- [ ] Phase 2: 80% coverage for new scrapers
- [ ] Phase 3: 80% coverage for new scrapers
- [ ] Phase 4: 80% coverage for new scrapers
- [ ] Integration tests for all commands
- [ ] E2E tests for critical flows

### Documentation
- [ ] Update README for each new command
- [ ] Add examples for all commands
- [ ] Create CONTRIBUTING.md
- [ ] Add API documentation
- [ ] Create video tutorials (future)

---

## Release Planning

### v0.2.0 - Phase 1 Complete
- Target: Add gainers, losers, company financials, market stats, circuit breaker
- ETA: TBD

### v0.3.0 - Phase 2 Complete
- Target: Add AGM, compliance, sector, market summary
- ETA: TBD

### v0.4.0 - Phase 3 Complete
- Target: Add monthly reviews, block trades, announcements, risk screening
- ETA: TBD

### v0.5.0 - Phase 4 Complete
- Target: Add IPO, shariah, market comparison, fortnightly reports
- ETA: TBD

### v1.0.0 - AI Integration
- Target: Complete AI analysis and recommendations
- ETA: TBD

---

## Notes

- All scrapers must follow single-responsibility principle
- All commands must support 4 output formats: table, JSON, markdown, TOON
- Extract full page headers from DSE website (not constructed)
- Maintain backward compatibility
- Update tests for every new feature
- Keep dependencies minimal

---

**Last Updated**: 2026-02-28  
**Current Version**: v0.1.0
