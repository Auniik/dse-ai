# DSE-AI Development Roadmap

**Project**: dse-ai - AI-friendly CLI for Dhaka Stock Exchange data analysis  
**Goal**: Provide comprehensive market data for AI-powered investment recommendations  
**Current Status**: Phase 1 at 50% (8 commands total) 🚀

---

## Progress Overview

- **Phase 0 (Foundation)**: ✅ 100% Complete (5/5)
- **Phase 1 (Quick Wins)**: 🟡 50% Complete (2/4)
- **Phase 2 (Fundamental Analysis)**: ⬜ 0% Complete (0/4)
- **Phase 3 (Advanced Analysis)**: ⬜ 0% Complete (0/4)
- **Phase 4 (Specialized)**: ⬜ 0% Complete (0/4)

**Overall Progress**: 38% (8/21 total features)

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

### Features:
- [x] Full date/time headers from DSE website
- [x] Multiple output formats (table, JSON, markdown, TOON)
- [x] Color-coded tables (green/red for changes)
- [x] Refactored single-responsibility scrapers
- [x] Retry logic with exponential backoff
- [x] All tests passing

---

## Phase 1: Quick Wins - High Impact 🔥

**Priority**: HIGH  
**Target**: 4 new commands  
**Status**: 2/4 Complete  
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
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/company-scraper.ts`
- [ ] Create `src/commands/company.ts`
- [ ] Add company data TypeScript interfaces
- [ ] Update README
- [ ] **AI Value**: Fundamental analysis, valuation metrics, investment scoring

### 1.3 Market Statistics [ ]
- [ ] Command: `dse-ai market-stats`
  - [ ] Scrape `market-statistics.php`
  - [ ] Parse market overview data
  - [ ] Extract sector performance
  - [ ] Parse index performance (DSEX, DSES, DS30)
  - [ ] Extract market breadth (advances/declines)
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/market-stats-scraper.ts`
- [ ] Create `src/commands/market-stats.ts`
- [ ] Update README
- [ ] **AI Value**: Sector rotation analysis, market health indicators

### 1.4 Circuit Breaker Status [ ]
- [ ] Command: `dse-ai circuit`
  - [ ] Scrape `cbul.php`
  - [ ] Parse stocks hitting upper circuit
  - [ ] Parse stocks hitting lower circuit
  - [ ] Add flag: `--upper` for upper circuit only
  - [ ] Add flag: `--lower` for lower circuit only
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/circuit-scraper.ts`
- [ ] Create `src/commands/circuit.ts`
- [ ] Update README
- [ ] **AI Value**: Volatility alerts, risk indicators

---

## Phase 2: Fundamental Analysis 📊

**Priority**: HIGH  
**Target**: 4 new commands  
**Status**: 0/4 Complete  
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

### 2.2 Financial Statements Submission Status [ ]
- [ ] Command: `dse-ai compliance`
  - [ ] Scrape `financial-statement-submission-status-extended.php`
  - [ ] Parse companies with pending submissions
  - [ ] Extract compliance status
  - [ ] Add flag: `--non-compliant` for risk screening
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/compliance-scraper.ts`
- [ ] Create `src/commands/compliance.ts`
- [ ] Update README
- [ ] **AI Value**: Risk assessment, regulatory compliance screening

### 2.3 Company by Category/Sector [ ]
- [ ] Command: `dse-ai sector [NAME]`
  - [ ] Scrape `by_industrylisting.php`
  - [ ] Parse all sectors/categories
  - [ ] Extract companies per sector
  - [ ] Show sector-wise performance
  - [ ] If NAME provided, show companies in that sector
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/sector-scraper.ts`
- [ ] Create `src/commands/sector.ts`
- [ ] Update README
- [ ] **AI Value**: Sector-wise analysis, peer comparison

### 2.4 Recent Market Information Daily Trends [ ]
- [ ] Command: `dse-ai market-summary`
  - [ ] Scrape `recent_market_information.php`
  - [ ] Parse daily market metrics:
    - [ ] Total Trade count
    - [ ] Total Volume
    - [ ] Total Value
    - [ ] Market Capitalization
  - [ ] Show historical trend (last 7-30 days)
  - [ ] Add flag: `--days <N>` for custom range
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/market-summary-scraper.ts`
- [ ] Create `src/commands/market-summary.ts`
- [ ] Update README
- [ ] **AI Value**: Market activity trends, liquidity analysis

---

## Phase 3: Advanced Analysis 🎯

**Priority**: MEDIUM  
**Target**: 4 new features  
**Status**: 0/4 Complete  
**Estimated Effort**: 4-5 days

### 3.1 Monthly Reviews & Graphs [ ]
- [ ] Command: `dse-ai monthly-review`
  - [ ] Scrape `mrg.php`
  - [ ] Parse monthly performance reports
  - [ ] Extract trend graphs data
  - [ ] Add flag: `--month <YYYY-MM>` for specific month
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/monthly-review-scraper.ts`
- [ ] Create `src/commands/monthly-review.ts`
- [ ] Update README
- [ ] **AI Value**: Long-term trend analysis, market cycle identification

### 3.2 Block Transactions [ ]
- [ ] Command: `dse-ai block-trades`
  - [ ] Identify data source (check market statistics)
  - [ ] Parse large block trades
  - [ ] Extract institutional activity
  - [ ] Add flag: `--min-value <AMOUNT>` for filtering
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/block-trades-scraper.ts`
- [ ] Create `src/commands/block-trades.ts`
- [ ] Update README
- [ ] **AI Value**: Institutional activity tracking, smart money flow

### 3.3 Corporate Announcements [ ]
- [ ] Command: `dse-ai announcements`
  - [ ] Scrape `corporate-announcement.php`
  - [ ] Scrape `news_archive.php`
  - [ ] Parse company announcements
  - [ ] Extract material events
  - [ ] Add flag: `--symbol <SYMBOL>` for company filter
  - [ ] Add flag: `--recent` for last 7 days
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/announcements-scraper.ts`
- [ ] Create `src/commands/announcements.ts`
- [ ] Update README
- [ ] **AI Value**: Event-driven trading, news sentiment

### 3.4 Going Concern Threat List [ ]
- [ ] Command: `dse-ai risk-screen`
  - [ ] Identify going concern data source
  - [ ] Parse companies at bankruptcy risk
  - [ ] Extract delisting threats
  - [ ] Combine with compliance data
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/risk-scraper.ts`
- [ ] Create `src/commands/risk-screen.ts`
- [ ] Update README
- [ ] **AI Value**: Critical risk avoidance

---

## Phase 4: Specialized Features 🌟

**Priority**: LOW  
**Target**: 4 new features  
**Status**: 0/4 Complete  
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

### 4.3 Comparison of Markets [ ]
- [ ] Command: `dse-ai compare-markets`
  - [ ] Scrape `markets.php`
  - [ ] Parse DSE vs other exchanges comparison
  - [ ] Support all output formats
  - [ ] Add tests
- [ ] Create `src/lib/scrapers/compare-scraper.ts`
- [ ] Create `src/commands/compare-markets.ts`
- [ ] Update README
- [ ] **AI Value**: Relative market performance

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
