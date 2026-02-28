# DSE Website - Potential Data Sources for Investment Analysis

## Currently Implemented ✅

### 1. Latest Share Prices (7 views)
- **URL**: `latest_share_price_scroll_l.php` (by trading code)
- **URL**: `latest_share_price_scroll_by_change.php` (by % change)
- **URL**: `latest_share_price_scroll_by_value.php` (by value)
- **URL**: `latest_share_price_scroll_by_volume.php` (by volume)
- **URL**: `latest_share_price_scroll_by_ltp.php` (by last trade price)
- **URL**: `latest_share_price_alpha.php` (alphabetically)
- **URL**: `latest_share_price_scroll_treasury_bond.php` (debt board)
- **Data**: LTP, High, Low, Close, YCP, Change, Trade count, Value, Volume
- **AI Value**: Real-time price movements, momentum indicators

### 2. DSEX Market Data
- **URL**: `dseX_share.php`
- **Data**: All DSEX index constituents with trading data
- **AI Value**: Index composition analysis, market breadth

### 3. Top 30 Stocks (DS30)
- **URL**: `dse30_share.php`
- **Data**: Top 30 performing stocks
- **AI Value**: Blue-chip analysis, market leaders

### 4. Top 20 Shares (3 tables)
- **URL**: `top_20_share.php`
- **Data**: Top 20 by Value, Volume, and Trade count
- **AI Value**: Liquidity analysis, active trading patterns

### 5. Historical Data
- **URL**: `day_end_archive.php`
- **Data**: Historical price data for date ranges
- **AI Value**: Trend analysis, backtesting

---

## High Priority - Not Yet Implemented 🔥

### 6. Top 10 Gainers/Losers
- **URL**: `top_ten_gainer.php`
- **URL**: `top_ten_loser.php`
- **Data**: Daily top performers and worst performers
- **AI Value**: Momentum trading signals, market sentiment

### 7. Market Statistics
- **URL**: `market-statistics.php`
- **Data**: Comprehensive market overview, sector performance
- **AI Value**: Sector rotation analysis, market health indicators

### 8. Circuit Breaker Status
- **URL**: `cbul.php`
- **Data**: Stocks hitting circuit breakers (upper/lower limits)
- **AI Value**: Volatility alerts, risk indicators

### 9. Company Financials & Fundamentals
- **URL**: `displayCompany.php?name={SYMBOL}`
- **Data**: 
  - Company profile
  - Financial statements
  - P/E ratio, EPS, NAV, Book Value
  - Dividend history
  - Shareholding pattern
  - Board of Directors
  - Authorized capital, paid-up capital
- **AI Value**: Fundamental analysis, valuation metrics, investment scoring

### 10. AGM/EGM and Record Dates
- **URL**: `CompAGM&RecordDate.php`
- **Data**: Upcoming AGMs, dividend announcements, record dates
- **AI Value**: Dividend capture strategies, corporate action tracking

### 11. IPO Results
- **URL**: `ipo_result.php`
- **Data**: Recent IPO listings and allocation results
- **AI Value**: New investment opportunities, listing day analysis

### 12. Financial Statements Submission Status
- **URL**: `financial-statement-submission-status-extended.php`
- **Data**: Companies that haven't submitted financials (compliance risk)
- **AI Value**: Risk assessment, regulatory compliance screening

### 13. Monthly Reviews & Graphs
- **URL**: `mrg.php`
- **Data**: Monthly market performance reports and trend graphs
- **AI Value**: Long-term trend analysis, market cycle identification

### 14. Fortnightly Capital Market
- **URL**: `Fortnightly_Capital_Market.php`
- **Data**: Bi-weekly market analysis reports
- **AI Value**: Medium-term trend analysis

### 15. Recent Market Information
- **URL**: `recent_market_information.php`
- **Data**: Daily summary of Total Trade, Volume, Value, Market Cap
- **AI Value**: Market activity trends, liquidity analysis

### 16. Comparison of Markets
- **URL**: `markets.php`
- **Data**: Compare DSE with other exchanges
- **AI Value**: Relative market performance

### 17. Block Transactions
- **URL**: Likely available in market statistics
- **Data**: Large block trades
- **AI Value**: Institutional activity tracking, smart money flow

### 18. DSE Shariah Index (DSES)
- **URL**: Check dses related pages
- **Data**: Shariah-compliant stocks performance
- **AI Value**: Ethical investing, niche market analysis

---

## Medium Priority 📊

### 19. Company by Category/Sector
- **URL**: `by_industrylisting.php`
- **Data**: Companies grouped by industry sectors
- **AI Value**: Sector-wise analysis, peer comparison

### 20. Closed/Non-operational Companies
- **URL**: Check listing status pages
- **Data**: Suspended or delisted companies
- **AI Value**: Risk avoidance, watchlist

### 21. Corporate Announcements
- **URL**: `corporate-announcement.php`
- **URL**: `news_archive.php`
- **Data**: Company announcements, material events
- **AI Value**: Event-driven trading, news sentiment

### 22. Actuarial Valuation Status
- **URL**: `actuarial-valuation-status.php`
- **Data**: Insurance/financial companies' valuation status
- **AI Value**: Sector-specific compliance

### 23. IPO/RPO/Rights Proceeds Utilisation
- **Data**: How companies are using raised capital
- **AI Value**: Management efficiency assessment

### 24. Going Concern Threat List
- **Data**: Companies at risk of bankruptcy/delisting
- **AI Value**: Critical risk avoidance

---

## Data Analysis Use Cases 🎯

### For AI Investment Analysis:

#### 1. **Momentum Trading Signals**
- Combine: Top Gainers/Losers + Circuit Breaker + Volume analysis
- AI can identify: Breakout stocks, momentum reversal patterns

#### 2. **Fundamental Scoring**
- Combine: Company financials + P/E ratio + Dividend history + NAV
- AI can calculate: Investment grade score, undervalued stocks

#### 3. **Liquidity & Risk Assessment**
- Combine: Volume data + Circuit breaker + Market cap + Financial submission status
- AI can identify: Safe liquid stocks vs risky illiquid stocks

#### 4. **Sector Rotation Strategy**
- Combine: Market statistics + Category data + Monthly reviews
- AI can identify: Emerging sectors, cyclical patterns

#### 5. **Dividend Capture Strategy**
- Combine: AGM/Record dates + Dividend history + Price trends
- AI can identify: High-yield dividend opportunities

#### 6. **Smart Money Tracking**
- Combine: Block transactions + Top by Value/Volume + Institutional holdings
- AI can identify: Where big money is flowing

#### 7. **Event-Driven Trading**
- Combine: Corporate announcements + AGM dates + IPO calendar
- AI can identify: Event catalysts for price movements

#### 8. **Risk Screening**
- Combine: Going concern list + Financial submission status + Circuit breaker frequency
- AI can create: Risk-adjusted portfolio recommendations

#### 9. **Market Timing**
- Combine: Recent market info + Index trends + Sector performance
- AI can identify: Entry/exit points, market cycles

#### 10. **Peer Comparison & Valuation**
- Combine: Company financials + Sector data + P/E ratios
- AI can identify: Best-in-sector stocks, relative valuation

---

## Recommended Implementation Priority

### Phase 1 (Quick Wins - High Impact):
1. Top 10 Gainers/Losers
2. Company Financial Data (`displayCompany.php`)
3. Market Statistics
4. Circuit Breaker Status

### Phase 2 (Fundamental Analysis):
5. AGM/Record Dates
6. Financial Statement Submission Status
7. Company by Category/Sector
8. Recent Market Information daily trends

### Phase 3 (Advanced Analysis):
9. Monthly Reviews & Graphs
10. Block Transactions
11. Corporate Announcements
12. Going Concern Threat List

### Phase 4 (Specialized):
13. IPO Results & Calendar
14. DSES Shariah Index
15. Comparison of Markets
16. Fortnightly Reports

---

## Command Structure Recommendations

```bash
# New commands to add:
dse-ai gainers              # Top 10 gainers
dse-ai losers               # Top 10 losers
dse-ai company SYMBOL       # Company detailed info & financials
dse-ai market-stats         # Market statistics overview
dse-ai circuit              # Circuit breaker status
dse-ai agm                  # Upcoming AGMs and dividends
dse-ai sector [NAME]        # Sector-wise analysis
dse-ai block-trades         # Block transactions
dse-ai announcements        # Recent corporate announcements
dse-ai risk-screen          # Risk screening (going concern + non-compliant)
dse-ai market-summary       # Daily market summary
dse-ai ipo                  # IPO calendar and results
```

---

## AI Analysis Capabilities

With complete data access, AI can provide:

1. **Daily Recommendations**: 
   - "Top 5 stocks to buy today based on momentum + fundamentals"
   
2. **Risk Alerts**: 
   - "Stocks to avoid: Circuit breaker hits + financial non-compliance"
   
3. **Dividend Opportunities**: 
   - "Upcoming dividend stocks with record dates in next 30 days"
   
4. **Sector Rotation**: 
   - "Banking sector showing strength, textile declining - rotation signal"
   
5. **Value Picks**: 
   - "Undervalued stocks: Low P/E + High dividend yield + Strong fundamentals"
   
6. **Smart Money Flow**: 
   - "Institutional buying detected in: BANK, PHARMA sectors"
   
7. **Market Timing**: 
   - "Market breadth improving - Entry signal confirmed"
   
8. **Portfolio Builder**: 
   - "Balanced portfolio: 60% large-cap, 30% mid-cap, 10% high-growth"

