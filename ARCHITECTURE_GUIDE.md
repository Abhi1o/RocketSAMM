# RocketSAMM Architecture & Features Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Monorepo Structure](#monorepo-structure)
4. [Complete Feature List](#complete-feature-list)
5. [Architectural Flows](#architectural-flows)
6. [Data Flow & Sources](#data-flow--sources)
7. [State Management](#state-management)
8. [Key Integration Points](#key-integration-points)

---

## 🎯 Project Overview

**RocketSAMM** is a decentralized exchange (DEX) platform built on the Uniswap protocol. It's a monorepo containing three main applications:

- **Web App** (`apps/web/`) - Main DEX interface for swapping, liquidity provision, and portfolio management
- **Mobile App** (`apps/mobile/`) - React Native wallet app for iOS/Android
- **Browser Extension** (`apps/extension/`) - Wallet extension for browser-based Web3 interactions

All three apps share common packages for UI, business logic, and utilities.

---

## 🛠 Technology Stack

### Frontend Technologies

#### Core Frameworks
- **TypeScript** - Type-safe development across all apps
- **React 18** - UI framework (Web & Extension)
- **React Native** - Mobile app framework
- **Vite** - Web build tool (primary)
- **Webpack** - Legacy build support
- **WXT** - Extension build system (new)

#### UI & Styling
- **Tamagui** - Cross-platform UI component library
- **Styled Components** - CSS-in-JS styling
- **Rive** - Advanced animations
- **React Native Reanimated** - Native animations

#### State Management
- **Redux Toolkit** - Global state management
- **Redux-Saga** - Side effects management
- **Redux-Persist** - State persistence
- **Jotai** - Lightweight atomic state
- **React Query (@tanstack/react-query)** - Server state & caching

#### Web3 & Blockchain
- **Wagmi** - React Hooks for Ethereum (Web)
- **Ethers.js v5** - Ethereum library
- **Viem** - TypeScript Ethereum library
- **WalletConnect** - Multi-wallet connection
- **Web3-React** - Legacy Web3 integration

#### Data & API
- **Apollo Client** - GraphQL client
- **Axios** - HTTP client
- **GraphQL Code Generator** - Auto-generate types

#### Testing
- **Vitest** - Unit testing
- **Playwright** - E2E testing (Web)
- **Maestro** - E2E testing (Mobile)
- **React Native Testing Library** - Component testing
- **Jest** - Test framework (Mobile & Extension)

#### Build & Dev Tools
- **NX** - Monorepo orchestration
- **Bun** - Fast package manager & runtime
- **Biome** - Fast linter & formatter
- **TypeScript** - Type checking

---

## 📁 Monorepo Structure

```
RocketSAMM/
├── apps/                      # Main applications
│   ├── web/                   # Web DEX interface
│   ├── mobile/                # iOS/Android wallet app
│   └── extension/             # Browser wallet extension
│
├── packages/                  # Shared packages
│   ├── ui/                    # Cross-platform UI components
│   ├── uniswap/              # Core business logic
│   ├── wallet/               # Wallet functionality
│   ├── utilities/            # Common utilities
│   ├── api/                  # API clients (GraphQL, REST)
│   ├── config/               # Configuration utilities
│   ├── sessions/             # Session management
│   ├── eslint-config/        # Linting configuration
│   └── biome-config/         # Code formatting config
│
└── config/                    # Shared build configurations
    ├── tsconfig/              # TypeScript configs
    └── jest-presets/          # Test configurations
```

---

## 🎨 Complete Feature List

### 🌐 Web Application Features

#### 1. **Token Swapping**
   - Spot trading (buy/sell tokens)
   - Limit orders
   - Send tokens to addresses
   - Multi-chain support (Ethereum, Arbitrum, Optimism, Base, etc.)
   - Slippage tolerance control
   - Gas optimization
   - Price impact warnings

#### 2. **Liquidity Provision**
   - **V2 Pools**: Simple liquidity provision
   - **V3 Positions**: Concentrated liquidity with custom ranges
   - **V4 Positions**: Next-gen liquidity with hooks (coming soon)
   - Add/Remove liquidity
   - Increase position size
   - Fee earnings tracking
   - Position migration (V2 → V3 → V4)

#### 3. **Portfolio Management**
   - Multi-chain token balances
   - Portfolio value tracking (USD)
   - Token holdings visualization
   - DeFi positions (liquidity pools, staking)
   - NFT gallery
   - Activity history
   - Transaction history

#### 4. **Explore & Discovery**
   - Token discovery and search
   - Top tokens by volume/TVL
   - Price charts and analytics
   - Token details pages
   - Pool analytics
   - Trending tokens

#### 5. **Wallet Management**
   - Multi-wallet support
   - WalletConnect integration
   - MetaMask integration
   - Coinbase Wallet
   - Passkey authentication (WebAuthn)
   - Account switching
   - Gas fee estimation

#### 6. **NFT Features**
   - NFT portfolio viewing
   - NFT collection browsing
   - NFT details and metadata
   - Profile galleries

#### 7. **Fiat On/Off Ramp**
   - Buy crypto with fiat
   - Multiple payment providers
   - Credit/debit card support
   - Bank transfer support

#### 8. **Advanced Features**
   - UniswapX integration (MEV protection)
   - Cross-chain bridging
   - Batch transactions
   - Smart wallet integration (ERC-4337)
   - EIP-7702 delegation support

### 📱 Mobile Application Features

#### 1. **Wallet Basics**
   - Create new wallet
   - Import existing wallet (seed phrase)
   - Biometric authentication (Face ID, Touch ID)
   - PIN/password protection
   - Multiple accounts management
   - View-only wallets

#### 2. **Cloud Backup**
   - iCloud backup (iOS)
   - Google Drive backup (Android)
   - Encrypted seed phrase storage
   - Password-protected backups
   - Backup reminders

#### 3. **Token Management**
   - View token balances
   - Search tokens
   - Add custom tokens
   - Token favorites
   - Hide tokens
   - Price tracking

#### 4. **Swapping**
   - Token swaps
   - Multi-chain swaps
   - Slippage control
   - Gas settings
   - Swap history

#### 5. **Send & Receive**
   - Send tokens
   - Receive via QR code
   - ENS name support
   - Unitag support (Uniswap usernames)
   - Address book
   - Recent recipients

#### 6. **WalletConnect**
   - Scan dApp QR codes
   - Connect to dApps
   - Approve transactions
   - Sign messages
   - Session management

#### 7. **Notifications**
   - Transaction notifications
   - Price alerts
   - System notifications
   - Push notifications

#### 8. **Settings**
   - Language selection
   - Currency preference
   - Privacy settings
   - Security settings
   - Testnet mode
   - Developer options

#### 9. **Onboarding**
   - Educational screens
   - Security tips
   - Feature introduction
   - Unitag creation

#### 10. **NFTs**
   - View NFT collection
   - NFT details
   - NFT images and metadata

### 🧩 Browser Extension Features

#### 1. **Wallet Operations**
   - Create/import wallet
   - Biometric unlock (Windows Hello, Touch ID)
   - Multiple accounts
   - Account switching
   - Passkey authentication

#### 2. **dApp Integration**
   - Ethereum provider injection
   - Connect to dApps
   - Sign transactions
   - Sign messages
   - Approve permissions
   - Request handling

#### 3. **Token Features**
   - View balances
   - Token search
   - Swap tokens
   - Send tokens
   - Receive tokens

#### 4. **Transaction Management**
   - Transaction history
   - Pending transactions
   - Transaction details
   - Gas customization
   - Nonce management

#### 5. **Settings**
   - Network management
   - Connected sites
   - Auto-lock timer
   - Language settings
   - Currency settings

#### 6. **Side Panel UI**
   - Persistent side panel
   - Full app interface
   - Quick access
   - Popup fallback

#### 7. **Unitags**
   - Claim Unitag username
   - Unitag profile
   - Search by Unitag

---

## 🔄 Architectural Flows

### Flow 1: Token Swap (Complete Flow)

This is the most important feature. Here's the complete architectural flow:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                              │
│  Components: SwapForm, CurrencyInputPanel, SwapReviewModal              │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         STATE MANAGEMENT LAYER                            │
│  Store: swapFormStore (input amounts, selected tokens)                  │
│  Hook: useDerivedSwapInfo() - Combines all swap state                   │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         TRADE FETCHING LAYER                              │
│  Hook: useTrade()                                                         │
│  Service: createEVMTradeService() or createSolanaTradeService()         │
│  - Validates input                                                        │
│  - Builds quote request                                                   │
│  - Fetches route from Trading API                                        │
│  - Returns TradeWithGasEstimates                                         │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         TRANSACTION PREPARATION                           │
│  Hook: useSwapTxAndGasInfo()                                             │
│  - Gets token approval status                                            │
│  - Prepares swap transaction request                                     │
│  - Calculates gas estimates                                              │
│  - Generates transaction steps                                           │
│  Store: swapTxStore                                                      │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         REVIEW & CONFIRMATION                             │
│  Screen: SwapReviewScreen                                                │
│  - Shows swap details                                                     │
│  - Price impact warnings                                                  │
│  - Gas fee display                                                        │
│  - Security checks (token safety, address validation)                   │
│  Hook: useAcceptedTrade() - Freezes trade when user confirms            │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         EXECUTION LAYER                                   │
│  Service: createExecuteSwapService()                                     │
│  Callback: swapCallback() or wrapCallback()                              │
│                                                                           │
│  STEP 1: Token Approval (if needed)                                      │
│    - Calls approve() on ERC-20 contract                                  │
│    - Or uses Permit2 signature                                           │
│                                                                           │
│  STEP 2: Execute Swap                                                     │
│    - Submits transaction via provider                                    │
│    - Transaction types:                                                   │
│      • UniswapX (signed order, no gas)                                   │
│      • Router swap (classic DEX)                                         │
│      • Wrap/Unwrap (ETH ↔ WETH)                                         │
│      • Bridge (cross-chain)                                              │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         BLOCKCHAIN LAYER                                  │
│  Provider: JsonRpcProvider (Ethers.js) or Public Client (Viem)          │
│  - Signs transaction with user's private key                             │
│  - Broadcasts to blockchain network                                      │
│  - Returns transaction hash                                              │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         TRANSACTION MONITORING                            │
│  Store: Redux transactions slice                                         │
│  - Stores pending transaction                                            │
│  - Polls for transaction status                                          │
│  - Updates on confirmation                                               │
│  - Shows notification                                                     │
│  Activity: Transaction appears in portfolio activity                     │
└──────────────────────────────────────────────────────────────────────────┘
```

**Data Sources in Swap Flow:**
1. **Trading API** (`api.uniswap.org/v2`) - Quote routing, prices, gas estimates
2. **RPC Providers** - Blockchain interaction (Infura, Alchemy, custom)
3. **Token Lists** - Token metadata, logos, safety info
4. **GraphQL API** - Token prices, market data, balances

---

### Flow 2: Wallet Creation & Management

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         ONBOARDING START                                  │
│  User opens app/extension for first time                                │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
                ▼                                   ▼
┌────────────────────────────┐      ┌────────────────────────────────┐
│   CREATE NEW WALLET        │      │   IMPORT EXISTING WALLET       │
└─────────────┬──────────────┘      └────────────────┬───────────────┘
              │                                       │
              ▼                                       ▼
┌────────────────────────────┐      ┌────────────────────────────────┐
│  Generate Mnemonic         │      │  Enter Seed Phrase             │
│  - 12/24 word phrase       │      │  - Validate words              │
│  - BIP39 standard          │      │  - BIP39 validation            │
│  Native Module:            │      │  - Parse mnemonic              │
│  RNEthersRS (Rust)        │      │                                │
└─────────────┬──────────────┘      └────────────────┬───────────────┘
              │                                       │
              └───────────────┬───────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         KEYRING STORAGE                                   │
│  Class: Keyring                                                          │
│  - Derives private keys from mnemonic (BIP32/BIP44)                     │
│  - Stores encrypted in secure storage:                                   │
│    • iOS: Keychain                                                       │
│    • Android: Android Keystore                                          │
│    • Web: Browser extension storage (encrypted)                         │
│  - Generates addresses (EVM checksummed)                                │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         ACCOUNT CREATION                                  │
│  Redux Action: addAccount()                                              │
│  Store: wallet slice                                                     │
│  Account Object:                                                         │
│    {                                                                     │
│      address: "0x...",                                                   │
│      type: "SignerMnemonic",                                            │
│      derivationIndex: 0,                                                │
│      name: "Account 1",                                                 │
│      pending: false                                                     │
│    }                                                                     │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         BACKUP SETUP (Optional)                           │
│  Mobile: Cloud Backup                                                    │
│  - iOS: iCloud Keychain                                                 │
│  - Android: Google Drive                                                │
│  - Encrypted with user password                                         │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         WALLET READY                                      │
│  - Fetch balances (GraphQL)                                              │
│  - Load transaction history                                              │
│  - Subscribe to notifications                                            │
│  - Connect to WalletConnect (if pending)                                │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### Flow 3: dApp Connection (Extension/Mobile)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         DAPP INITIATES CONNECTION                         │
│  Web: ethereum.request({ method: "eth_requestAccounts" })               │
│  Mobile: WalletConnect URI scan                                          │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         CONNECTION REQUEST                                │
│  Extension: Content script receives request                              │
│    - WindowEthereumProxy intercepts                                      │
│    - Forwards to background script                                       │
│    - Background creates popup/sidepanel                                  │
│                                                                           │
│  Mobile: WalletConnect                                                   │
│    - Parse session proposal                                              │
│    - Show connection modal                                               │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         USER APPROVAL                                     │
│  UI Shows:                                                               │
│    - dApp name & URL                                                     │
│    - Requested permissions                                               │
│    - Account to connect                                                  │
│    - Chain/network                                                       │
│  User: Approve or Reject                                                 │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         CONNECTION ESTABLISHED                            │
│  Store: dappRequests slice                                               │
│  - Save connected dApp info                                              │
│  - Store session data                                                    │
│  - Grant permissions                                                     │
│                                                                           │
│  Extension: Inject provider into page                                    │
│  Mobile: Respond to WalletConnect                                        │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         TRANSACTION REQUESTS                              │
│  dApp → Wallet:                                                          │
│    - eth_sendTransaction                                                 │
│    - eth_signTypedData_v4                                               │
│    - personal_sign                                                       │
│    - wallet_addEthereumChain                                            │
│                                                                           │
│  Each request:                                                           │
│    1. Queued in background                                              │
│    2. User prompted in UI                                               │
│    3. Transaction details displayed                                     │
│    4. User approves/rejects                                             │
│    5. Signed/executed if approved                                       │
│    6. Result returned to dApp                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### Flow 4: Portfolio Data Loading

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         USER OPENS PORTFOLIO                              │
│  Screen: Portfolio / Home Screen                                        │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         GRAPHQL QUERIES                                   │
│  Apollo Client → GraphQL API (api.uniswap.org/v1/graphql)              │
│                                                                           │
│  Query 1: portfolios()                                                   │
│    - Fetches token balances for address                                 │
│    - Multiple chains in parallel                                        │
│    - Returns: tokens[], totalValue                                      │
│                                                                           │
│  Query 2: tokens()                                                       │
│    - Token metadata for holdings                                        │
│    - Logos, names, symbols                                              │
│    - Market data (price, 24h change)                                    │
│                                                                           │
│  Query 3: assetActivities()                                             │
│    - Recent transactions                                                │
│    - Swaps, transfers, approvals                                        │
│    - Timestamps and details                                             │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         DATA TRANSFORMATION                               │
│  Hooks: usePortfolioBalances()                                           │
│  - Aggregates balances across chains                                    │
│  - Calculates USD values                                                │
│  - Sorts by value                                                       │
│  - Filters out spam tokens                                              │
│  - Groups NFTs                                                          │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         CACHING & UPDATES                                 │
│  Apollo Cache:                                                           │
│    - Stores query results                                               │
│    - Normalized by ID                                                   │
│    - Automatic cache updates                                            │
│                                                                           │
│  Polling:                                                                │
│    - Refresh every 30s for balances                                     │
│    - Real-time for pending transactions                                 │
│                                                                           │
│  Redux Store:                                                            │
│    - portfolio slice                                                     │
│    - Cached balance info                                                │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         UI RENDERING                                      │
│  Components:                                                             │
│    - PortfolioBalance (total value)                                     │
│    - TokenBalanceList (token list)                                      │
│    - ActivityTab (transaction history)                                  │
│    - NFTsTab (NFT gallery)                                              │
│  All with loading states & error handling                                │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### Flow 5: Transaction Signing & Submission

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         TRANSACTION CREATED                               │
│  Context: Swap, Send, Approve, or dApp Request                          │
│  Input: Transaction Request Object                                       │
│    {                                                                     │
│      from: address,                                                     │
│      to: contractAddress,                                               │
│      data: encodedCalldata,                                             │
│      value: amount,                                                     │
│      gasLimit: estimate,                                                │
│      gasPrice / maxFeePerGas                                            │
│    }                                                                     │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         SIGNATURE GENERATION                              │
│  SignerManager.getSignerForAccount(account)                              │
│    → NativeSigner (mobile/extension) or Web Signer (web)                │
│                                                                           │
│  Mobile/Extension:                                                       │
│    - Retrieve encrypted private key from secure storage                 │
│    - Decrypt with user auth (biometric/password)                        │
│    - Sign transaction using RNEthersRS (Rust)                           │
│                                                                           │
│  Web:                                                                    │
│    - Delegate to wallet provider (MetaMask, WalletConnect, etc.)        │
│    - Provider shows native confirmation                                 │
│    - Returns signature                                                   │
│                                                                           │
│  Output: Signed Transaction (RLP encoded)                                │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         TRANSACTION BROADCAST                             │
│  Provider.sendTransaction(signedTx)                                      │
│    → JsonRpcProvider or Public Client                                   │
│    → RPC Endpoint (Infura, Alchemy, etc.)                               │
│    → Ethereum Network                                                    │
│                                                                           │
│  Returns: Transaction Hash                                               │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         TRANSACTION TRACKING                              │
│  Redux Action: addTransaction()                                          │
│  Store: transactions slice                                               │
│  Transaction Object:                                                     │
│    {                                                                     │
│      hash: "0x...",                                                     │
│      chainId: 1,                                                        │
│      status: "pending",                                                 │
│      typeInfo: { type: "swap", ... },                                   │
│      addedTime: timestamp                                               │
│    }                                                                     │
└────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         STATUS MONITORING                                 │
│  Saga: watchTransaction()                                                │
│    - Poll provider.getTransactionReceipt(hash)                          │
│    - Every 3 seconds                                                    │
│    - Timeout after 5 minutes                                            │
│                                                                           │
│  On Confirmation:                                                        │
│    - Update transaction status to "confirmed"                           │
│    - Parse logs for events                                              │
│    - Update balances                                                    │
│    - Show notification                                                   │
│                                                                           │
│  On Failure:                                                             │
│    - Update status to "failed"                                          │
│    - Show error notification                                            │
│    - Log error details                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow & Sources

### Data Sources

#### 1. **Trading API** (`api.uniswap.org/v2`)
- **Purpose**: Swap routing & quotes
- **Endpoints**:
  - `POST /quote` - Get swap quote
  - `POST /swap` - Get swap transaction
  - `POST /bridge-quote` - Cross-chain quotes
- **Usage**: Real-time swap prices, gas estimates, optimal routes

#### 2. **GraphQL API** (`api.uniswap.org/v1/graphql`)
- **Purpose**: Token data, balances, analytics
- **Key Queries**:
  - `portfolios()` - User balances
  - `tokens()` - Token metadata
  - `assetActivities()` - Transaction history
  - `topTokens()` - Popular tokens
  - `searchTokens()` - Token search
  - `v3Pool()` / `v4Pool()` - Pool data
- **Usage**: Portfolio display, token lists, price charts

#### 3. **Jupiter API** (`quote-api.jup.ag/v6`)
- **Purpose**: Solana token swaps
- **Endpoints**:
  - `GET /quote` - Solana swap quotes
  - `POST /swap` - Solana swap transaction
- **Usage**: Cross-chain swaps involving Solana

#### 4. **Unitags API** (Internal)
- **Purpose**: Uniswap username service
- **Features**:
  - Claim username
  - Resolve username to address
  - Update profile
- **Usage**: Human-readable addresses

#### 5. **Content API** (Internal)
- **Purpose**: Educational content, announcements
- **Usage**: Help articles, feature flags, app updates

#### 6. **On-Ramp Providers**
- **MoonPay, Coinbase Pay, etc.**
- **Purpose**: Fiat → Crypto purchases
- **Usage**: Buy crypto with credit card

#### 7. **RPC Providers**
- **Infura, Alchemy, QuickNode**
- **Purpose**: Blockchain interaction
- **Methods**:
  - `eth_sendRawTransaction`
  - `eth_getBalance`
  - `eth_call`
  - `eth_estimateGas`
  - `eth_getTransactionReceipt`
- **Usage**: All blockchain reads/writes

#### 8. **Token Lists**
- **Uniswap Default List, Community Lists**
- **Format**: JSON (EIP-20 Token List standard)
- **Content**: Token addresses, decimals, logos, names
- **Usage**: Token selector, validation

---

### Data Flow Patterns

#### Pattern 1: Server State (React Query)
```typescript
// Fetching from API with caching
const { data, isLoading } = useQuery({
  queryKey: ['token', chainId, address],
  queryFn: () => fetchToken(chainId, address),
  staleTime: 30_000, // 30 seconds
})
```

#### Pattern 2: GraphQL (Apollo Client)
```typescript
// Fetching with GraphQL
const { data } = useQuery(TokenQuery, {
  variables: { chain, address },
  pollInterval: 30_000, // Auto-refresh
})
```

#### Pattern 3: Redux (Global State)
```typescript
// Reading from Redux
const account = useSelector(selectActiveAccount)
const transactions = useSelector(selectTransactions)

// Writing to Redux
dispatch(addTransaction(txDetails))
```

#### Pattern 4: Jotai (Lightweight State)
```typescript
// Simple atomic state
const [darkMode, setDarkMode] = useAtom(darkModeAtom)
```

---

## 🗄️ State Management

### Redux Store Structure

```
Root State
├── wallet                    # Wallet accounts
│   ├── accounts             # { [address]: Account }
│   ├── activeAccountAddress # Currently selected account
│   └── settings             # User preferences
│
├── transactions             # Transaction history
│   └── [chainId]           # Transactions by chain
│       └── [hash]          # Transaction details
│
├── swap                     # Swap form state
│   ├── input               # Input token & amount
│   ├── output              # Output token & amount
│   └── independentField    # Which field user edited
│
├── lists                    # Token lists
│   ├── byUrl               # Loaded token lists
│   └── activeListUrls      # Enabled lists
│
├── user                     # User preferences
│   ├── slippageTolerance
│   ├── deadline
│   └── userDarkMode
│
├── application              # App-level state
│   ├── openModal           # Current modal
│   └── chainId             # Selected network
│
├── portfolio               # Portfolio data cache
│   └── balances            # Token balances
│
├── favorites               # Favorited tokens & wallets
│   ├── tokens
│   └── watchedAddresses
│
└── notifications           # Notification settings
    └── pushEnabled
```

### State Persistence

- **Redux-Persist**: Saves state to storage
  - **Web**: `localStorage`
  - **Mobile**: `MMKV` (fast native storage)
  - **Extension**: `chrome.storage.local`

- **What's Persisted**:
  - Wallet accounts (encrypted)
  - User preferences
  - Transaction history
  - Token lists
  - Favorites

- **What's NOT Persisted**:
  - Swap form state (session only)
  - Pending transactions (refetched)
  - API responses (cached separately)

---

## 🔗 Key Integration Points

### Smart Contracts

1. **Uniswap V2 Router** (`0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`)
   - Swap tokens
   - Add/remove liquidity

2. **Uniswap V3 SwapRouter** (`0xE592427A0AEce92De3Edee1F18E0157C05861564`)
   - Exact input/output swaps
   - Multi-hop routes

3. **Uniswap V3 NonfungiblePositionManager** (`0xC36442b4a4522E871399CD717aBDD847Ab11FE88`)
   - Create/modify liquidity positions
   - Collect fees

4. **Permit2** (`0x000000000022D473030F116dDEE9F6B43aC78BA3`)
   - Token approval signatures
   - Gasless approvals

5. **Universal Router** (`0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B`)
   - Multi-step transactions
   - V2, V3, NFT in one call

6. **UniswapX Reactor** (Multiple contracts)
   - Order submission
   - Dutch auction fills

### Native Modules (Mobile)

1. **RNEthersRS** (Rust)
   - Cryptographic operations
   - Key derivation
   - Transaction signing

2. **RNCloudStorageBackupsManager**
   - iCloud/Google Drive integration
   - Encrypted backups

3. **RNWalletConnect**
   - WalletConnect protocol
   - Deep linking

4. **Biometric**
   - Face ID / Touch ID
   - Secure authentication

---

## 🎨 UI Component Architecture

### Tamagui-based Design System

All apps use **Tamagui** for cross-platform UI:

```typescript
// Example: Button component
import { Button, Text } from 'ui/src'

<Button
  theme="accent"
  size="large"
  onPress={handlePress}
>
  <Text variant="buttonLabel1">Swap</Text>
</Button>
```

### Component Hierarchy

```
packages/ui/src/
├── components/
│   ├── Button/
│   ├── Text/
│   ├── Input/
│   ├── Icons/
│   ├── TokenImage/
│   ├── CurrencyLogo/
│   └── ...
├── theme/
│   ├── colors.ts
│   ├── tokens.ts
│   └── typography.ts
└── hooks/
    └── useSporeColors()
```

### Styling Approach

```typescript
// Always use styled from ui/src
import { styled } from 'ui/src'

const Container = styled('div', {
  backgroundColor: '$surface1',
  padding: '$spacing16',
  borderRadius: '$rounded16',
})
```

---

## 🔐 Security Architecture

### Key Security Features

1. **Encrypted Storage**
   - Private keys never leave secure storage
   - AES-256 encryption
   - OS-level keychain/keystore

2. **Biometric Authentication**
   - Optional Face ID/Touch ID
   - Fallback to PIN/password

3. **Transaction Validation**
   - Simulate before signing
   - Check for malicious contracts
   - Blockaid integration for security scanning

4. **Token Safety Checks**
   - Spam detection
   - Honeypot detection
   - Warning flags

5. **dApp Permissions**
   - Explicit user approval
   - Scoped permissions
   - Session management

---

## 🚀 Build & Deployment

### Development Workflow

```bash
# 1. Install dependencies
bun install

# 2. Set up environment
bun lfg  # Downloads env vars from 1Password

# 3. Start development servers
bun web dev          # Web on localhost:3000
bun mobile ios       # iOS simulator
bun extension start  # Extension dev server

# 4. Run tests
bun g:test           # All tests
bun g:typecheck      # Type checking
bun g:lint           # Linting

# 5. Build for production
bun web build:production
bun mobile ios:release
bun extension build:production
```

### Deployment Targets

- **Web**: Vercel (static hosting + serverless functions)
- **Mobile**: App Store (iOS) + Google Play (Android)
- **Extension**: Chrome Web Store

---

## 📝 Summary

### Key Takeaways

1. **Monorepo Architecture**: Three apps sharing common business logic
2. **Trading API**: Core for swap routing and quotes
3. **GraphQL API**: Primary data source for balances, tokens, analytics
4. **Redux + Sagas**: Complex state management with side effects
5. **Native Performance**: Rust-based crypto operations on mobile
6. **Multi-chain Support**: Ethereum, L2s, Solana
7. **Security First**: Encrypted storage, secure signing, transaction validation

### Common Patterns

- **Hooks over HOCs**: Modern React patterns
- **Type Safety**: TypeScript everywhere
- **Code Sharing**: Maximum reuse via packages
- **Progressive Enhancement**: Works without wallet, enhanced with wallet
- **Error Boundaries**: Graceful error handling
- **Loading States**: Skeleton loaders, optimistic updates

---

## 🎓 Learning Path for New Developers

1. **Start Here**: Read this guide + `CLAUDE.md` in each app
2. **Explore**: Navigate codebase with VS Code
3. **Run Locally**: Get web app running first
4. **Read Code**: Start with a feature (e.g., swap)
5. **Make Changes**: Fix a small bug or improve UI
6. **Run Tests**: Ensure nothing breaks
7. **Deep Dive**: Pick one area (state, blockchain, UI) to master

### Recommended Files to Read

1. `packages/uniswap/src/features/transactions/swap/` - Swap flow
2. `packages/wallet/src/features/wallet/` - Wallet management
3. `packages/api/src/clients/graphql/` - Data fetching
4. `apps/web/src/pages/Swap/` - Swap UI
5. `packages/ui/src/components/` - UI components

---

**Need Help?** Check the inline documentation, TypeScript types, and test files for more details!

