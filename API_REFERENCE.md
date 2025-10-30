# RocketSAMM API & Data Sources Reference

Quick reference guide for all APIs and data sources used in RocketSAMM.

---

## 🌐 Main APIs

### 1. Trading API (Uniswap Routing)

**Base URL**: `https://api.uniswap.org/v2`

#### Endpoints

##### Get Quote
```http
POST /quote
Content-Type: application/json

{
  "tokenInChainId": 1,
  "tokenIn": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "tokenOutChainId": 1,
  "tokenOut": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  "amount": "1000000000", // 1000 USDC (6 decimals)
  "type": "EXACT_INPUT",
  "slippageTolerance": "0.5",
  "protocols": "v2,v3,mixed"
}
```

**Response**:
```json
{
  "quoteId": "abc-123",
  "chainId": 1,
  "tokenIn": { "address": "0x...", "decimals": 6 },
  "tokenOut": { "address": "0x...", "decimals": 18 },
  "amountIn": "1000000000",
  "amountOut": "412345678901234567",
  "priceImpactPercentage": "0.12",
  "gasEstimate": "150000",
  "gasFee": "0.0025",
  "route": [
    {
      "type": "v3-pool",
      "tokenIn": "0x...",
      "tokenOut": "0x...",
      "fee": "3000"
    }
  ],
  "routeString": "USDC --[V3 0.3%]--> WETH",
  "quoteGasAdjusted": "411845678901234567"
}
```

##### Get Swap Transaction
```http
POST /swap
Content-Type: application/json

{
  "quoteId": "abc-123",
  "permitData": {
    "signature": "0x...",
    "amount": "1000000000",
    "expiration": 1234567890
  },
  "slippageTolerance": "0.5",
  "deadline": 1234567890,
  "simulate": true
}
```

**Response**:
```json
{
  "to": "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD", // Universal Router
  "data": "0x...", // Encoded calldata
  "value": "0", // ETH value to send
  "gasLimit": "150000",
  "gasPrice": "50000000000",
  "chainId": 1
}
```

##### Bridge Quote (Cross-chain)
```http
POST /bridge-quote
Content-Type: application/json

{
  "tokenInChainId": 1,
  "tokenIn": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "tokenOutChainId": 10, // Optimism
  "tokenOut": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
  "amount": "1000000000",
  "type": "EXACT_INPUT"
}
```

---

### 2. GraphQL API (Token Data & Analytics)

**Base URL**: `https://api.uniswap.org/v1/graphql`

**Headers**:
```
Content-Type: application/json
Origin: https://app.rocketsamm.com
```

#### Key Queries

##### Get Portfolio Balances
```graphql
query Portfolios($addresses: [String!]!, $chains: [Chain!]!) {
  portfolios(ownerAddresses: $addresses, chains: $chains) {
    id
    ownerAddress
    tokenBalances {
      id
      quantity
      denominatedValue {
        currency
        value
      }
      token {
        id
        chain
        address
        name
        symbol
        decimals
        project {
          id
          name
          logoUrl
          safetyLevel
        }
      }
      tokenProjectMarket {
        pricePercentChange24h {
          value
        }
      }
    }
    tokensTotalDenominatedValue {
      value
    }
  }
}
```

**Variables**:
```json
{
  "addresses": ["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"],
  "chains": ["ETHEREUM", "ARBITRUM", "OPTIMISM", "BASE", "POLYGON"]
}
```

##### Get Token Details
```graphql
query Token($chain: Chain!, $address: String) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    decimals
    name
    symbol
    market(currency: USD) {
      id
      price {
        value
      }
      volume24H: volume(duration: DAY) {
        value
      }
      priceHigh52W: priceHighLow(duration: YEAR, highLow: HIGH) {
        value
      }
      priceLow52W: priceHighLow(duration: YEAR, highLow: LOW) {
        value
      }
    }
    project {
      id
      name
      description
      logoUrl
      homepageUrl
      twitterName
      markets(currencies: [USD]) {
        marketCap {
          value
        }
        fullyDilutedValuation {
          value
        }
      }
    }
  }
}
```

##### Get Transaction History
```graphql
query TransactionList($address: String!, $chains: [Chain!]!) {
  portfolios(ownerAddresses: [$address], chains: $chains) {
    id
    assetActivities(pageSize: 100, page: 1, chains: $chains) {
      id
      timestamp
      chain
      details {
        ... on TransactionDetails {
          id
          hash
          to
          from
          type
          status
          assetChanges {
            __typename
            asset {
              id
              name
              symbol
              address
              chain
            }
            quantity
          }
        }
      }
    }
  }
}
```

##### Search Tokens
```graphql
query SearchTokens($searchQuery: String!, $chains: [Chain!]) {
  searchTokens(searchQuery: $searchQuery, chains: $chains) {
    id
    address
    chain
    decimals
    name
    symbol
    project {
      id
      name
      logoUrl
      safetyLevel
      markets(currencies: [USD]) {
        price {
          value
        }
        pricePercentChange24h {
          value
        }
      }
    }
  }
}
```

##### Get Top Tokens
```graphql
query TopTokens($chain: Chain, $page: Int, $pageSize: Int, $orderBy: TokenSortableField) {
  topTokens(chain: $chain, page: $page, pageSize: $pageSize, orderBy: $orderBy) {
    id
    address
    chain
    name
    symbol
    market {
      id
      totalValueLocked {
        value
      }
      volume(duration: DAY) {
        value
      }
    }
    project {
      id
      logoUrl
      markets(currencies: [USD]) {
        price {
          value
        }
        pricePercentChange24h {
          value
        }
        marketCap {
          value
        }
      }
    }
  }
}
```

---

### 3. Jupiter API (Solana Swaps)

**Base URL**: `https://quote-api.jup.ag/v6`

#### Get Quote
```http
GET /quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50
```

**Response**:
```json
{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "inAmount": "100000000",
  "outAmount": "10234567",
  "priceImpactPct": 0.01,
  "routePlan": [
    {
      "swapInfo": {
        "ammKey": "...",
        "label": "Orca",
        "inputMint": "...",
        "outputMint": "...",
        "inAmount": "100000000",
        "outAmount": "10234567",
        "feeAmount": "25000",
        "feeMint": "..."
      },
      "percent": 100
    }
  ]
}
```

#### Execute Swap
```http
POST /swap
Content-Type: application/json

{
  "quoteResponse": { ... }, // Quote from above
  "userPublicKey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "wrapAndUnwrapSol": true,
  "dynamicComputeUnitLimit": true
}
```

---

### 4. Unitags API (Uniswap Usernames)

**Base URL**: `https://unitags-api.uniswap.org`

#### Check Availability
```http
GET /check?username=alice
```

**Response**:
```json
{
  "available": true,
  "username": "alice"
}
```

#### Claim Unitag
```http
POST /claim
Content-Type: application/json

{
  "username": "alice",
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0x..."
}
```

#### Resolve Unitag
```http
GET /resolve?username=alice
```

**Response**:
```json
{
  "username": "alice",
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "metadata": {
    "avatar": "https://...",
    "twitter": "@alice"
  }
}
```

---

### 5. Fiat On-Ramp APIs

#### MoonPay
**Base URL**: `https://api.moonpay.com`

```http
GET /v3/currencies
GET /v3/ip_address
POST /v3/transactions
```

#### Coinbase Pay
**Base URL**: `https://pay.coinbase.com`

```http
POST /v1/charges
GET /v1/charges/:charge_id
```

---

## 🔗 RPC Providers

### Ethereum Mainnet

**Infura**:
```
https://mainnet.infura.io/v3/YOUR_PROJECT_ID
```

**Alchemy**:
```
https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

**QuickNode**:
```
https://YOUR_ENDPOINT.quiknode.pro/YOUR_API_KEY/
```

### Common RPC Methods

#### Get Balance
```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": ["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "latest"],
  "id": 1
}
```

#### Send Transaction
```json
{
  "jsonrpc": "2.0",
  "method": "eth_sendRawTransaction",
  "params": ["0xf86c..."], // Signed transaction
  "id": 1
}
```

#### Get Transaction Receipt
```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionReceipt",
  "params": ["0x..."], // Transaction hash
  "id": 1
}
```

#### Estimate Gas
```json
{
  "jsonrpc": "2.0",
  "method": "eth_estimateGas",
  "params": [{
    "from": "0x...",
    "to": "0x...",
    "data": "0x..."
  }],
  "id": 1
}
```

#### Call Contract (Read)
```json
{
  "jsonrpc": "2.0",
  "method": "eth_call",
  "params": [{
    "to": "0x...",
    "data": "0x70a08231000000000000000000000000742d35Cc6634C0532925a3b844Bc9e7595f0bEb" // balanceOf(address)
  }, "latest"],
  "id": 1
}
```

---

## 📜 Smart Contract ABIs

### ERC-20 Token

**Key Functions**:
```solidity
function balanceOf(address account) external view returns (uint256)
function transfer(address to, uint256 amount) external returns (bool)
function approve(address spender, uint256 amount) external returns (bool)
function allowance(address owner, address spender) external view returns (uint256)
function transferFrom(address from, address to, uint256 amount) external returns (bool)
```

### Uniswap V3 SwapRouter

**Address**: `0xE592427A0AEce92De3Edee1F18E0157C05861564`

**Key Functions**:
```solidity
function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut)
function exactOutputSingle(ExactOutputSingleParams calldata params) external payable returns (uint256 amountIn)
function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut)
function exactOutput(ExactOutputParams calldata params) external payable returns (uint256 amountIn)
```

### Universal Router

**Address**: `0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD`

**Key Functions**:
```solidity
function execute(bytes calldata commands, bytes[] calldata inputs) external payable
```

**Command Types**:
- `0x00`: V3 Swap Exact In
- `0x01`: V3 Swap Exact Out
- `0x08`: Wrap ETH
- `0x09`: Unwrap WETH
- `0x0b`: Permit2 Permit
- `0x0c`: Permit2 Transfer From

### Permit2

**Address**: `0x000000000022D473030F116dDEE9F6B43aC78BA3`

**Key Functions**:
```solidity
function permit(address owner, PermitSingle memory permitSingle, bytes calldata signature) external
function transferFrom(address from, address to, uint160 amount, address token) external
```

---

## 🗂️ Token Lists

### Uniswap Default List
**URL**: `https://tokens.uniswap.org`

**Format**:
```json
{
  "name": "Uniswap Default List",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": {
    "major": 10,
    "minor": 0,
    "patch": 0
  },
  "tokens": [
    {
      "chainId": 1,
      "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "name": "USD Coin",
      "symbol": "USDC",
      "decimals": 6,
      "logoURI": "https://..."
    }
  ]
}
```

---

## 🔔 Push Notifications (Firebase)

### Firebase Cloud Messaging

**Endpoint**: `https://fcm.googleapis.com/v1/projects/PROJECT_ID/messages:send`

**Notification Types**:
- Transaction confirmed
- Transaction failed
- Price alert
- New token in wallet
- Security alert

---

## 📊 Analytics & Monitoring

### Datadog

**RUM (Real User Monitoring)**:
```typescript
import { DdRum } from '@datadog/mobile-react-native'

DdRum.startView('SwapScreen', 'Swap', { tokenIn: 'USDC', tokenOut: 'ETH' })
DdRum.stopView('SwapScreen')
```

### Statsig (Feature Flags)

```typescript
import { useFeatureFlag } from 'uniswap/src/features/gating/hooks'

const isEnabled = useFeatureFlag(FeatureFlags.UniswapX)
```

---

## 🔐 Security APIs

### Blockaid (Transaction Scanning)

**Endpoint**: `https://api.blockaid.io/v1/ethereum/scan`

**Request**:
```json
{
  "chain": "ethereum",
  "transaction": {
    "from": "0x...",
    "to": "0x...",
    "data": "0x...",
    "value": "0"
  }
}
```

**Response**:
```json
{
  "result": "warning",
  "reason": "Token has transfer fee",
  "severity": "medium",
  "details": {
    "feeBps": 300
  }
}
```

### TRM Labs (Address Screening)

**Endpoint**: `https://api.trmlabs.com/public/v1/sanctions/screening`

**Request**:
```json
{
  "address": "0x...",
  "chain": "ethereum"
}
```

---

## ⚡ Rate Limits

| API | Rate Limit | Notes |
|-----|------------|-------|
| Trading API | 100 req/min | Per IP |
| GraphQL API | 1000 req/min | Per origin |
| Jupiter API | 60 req/min | Per IP |
| RPC Providers | Varies | Check provider |
| Unitags API | 30 req/min | Per IP |

---

## 🛠️ Development Tools

### GraphQL Playground
- **Web**: https://api.uniswap.org/v1/graphql
- Test queries in browser

### Ethers.js / Viem
```typescript
// Ethers.js
import { ethers } from 'ethers'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

// Viem
import { createPublicClient, http } from 'viem'
const client = createPublicClient({
  transport: http(RPC_URL)
})
```

### Token Address Finder
- **Ethereum**: https://etherscan.io/tokens
- **Arbitrum**: https://arbiscan.io/tokens
- **Base**: https://basescan.org/tokens

---

## 📖 Useful Links

- **Uniswap Docs**: https://docs.uniswap.org
- **Ethers.js Docs**: https://docs.ethers.org
- **Viem Docs**: https://viem.sh
- **GraphQL Docs**: https://graphql.org
- **WalletConnect Docs**: https://docs.walletconnect.com
- **EIP Standards**: https://eips.ethereum.org

---

This reference covers all major APIs and data sources used throughout RocketSAMM. Keep it handy for development!

