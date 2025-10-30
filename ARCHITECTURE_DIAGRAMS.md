# RocketSAMM Architecture - Visual Diagrams

This document contains visual flow diagrams for understanding the RocketSAMM architecture.

---

## 🔄 Swap Transaction Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as Swap UI
    participant Store as Redux Store
    participant Trade as Trade Service
    participant API as Trading API
    participant TX as Transaction Service
    participant Blockchain

    User->>UI: Enter token amounts
    UI->>Store: Update swap form state
    Store->>Trade: useTrade() hook
    Trade->>API: POST /quote request
    API-->>Trade: Quote response (routes, gas)
    Trade-->>Store: Update trade state
    Store-->>UI: Display quote

    User->>UI: Click "Swap" button
    UI->>UI: Show review modal
    User->>UI: Confirm swap
    
    UI->>TX: Execute swap
    
    alt Token needs approval
        TX->>Blockchain: Send approval tx
        Blockchain-->>TX: Approval confirmed
    end
    
    TX->>Blockchain: Send swap transaction
    Blockchain-->>TX: Transaction hash
    TX->>Store: Add pending transaction
    Store-->>UI: Show pending state
    
    loop Poll for confirmation
        TX->>Blockchain: Check receipt
        Blockchain-->>TX: Status
    end
    
    Blockchain-->>TX: Confirmed!
    TX->>Store: Update transaction status
    Store-->>UI: Show success
    UI->>User: Display confirmation
```

---

## 👛 Wallet Creation Flow

```mermaid
flowchart TD
    Start([User Opens App]) --> Choice{New or Import?}
    
    Choice -->|Create New| Generate[Generate Mnemonic<br/>12 or 24 words]
    Choice -->|Import| Input[Enter Seed Phrase<br/>Validate BIP39]
    
    Generate --> ShowPhrase[Display Seed Phrase<br/>User confirms backup]
    ShowPhrase --> Verify[Verify: User re-enters words]
    
    Verify --> Derive
    Input --> Derive
    
    Derive[Derive Private Key<br/>BIP32/BIP44] --> Store[Store in Secure Storage]
    
    Store -->|iOS| Keychain[iOS Keychain]
    Store -->|Android| AndroidStore[Android Keystore]
    Store -->|Web| Browser[Browser Storage<br/>Encrypted]
    
    Keychain --> CreateAccount
    AndroidStore --> CreateAccount
    Browser --> CreateAccount
    
    CreateAccount[Create Account Object<br/>Add to Redux] --> SetActive[Set as Active Account]
    
    SetActive --> CloudBackup{Enable Cloud Backup?}
    CloudBackup -->|Yes| Backup[Encrypt & Upload<br/>iCloud/Google Drive]
    CloudBackup -->|No| LoadData
    Backup --> LoadData
    
    LoadData[Fetch Balances<br/>Load Transaction History] --> Ready([Wallet Ready!])
```

---

## 🌐 dApp Connection Flow (Extension)

```mermaid
sequenceDiagram
    participant Website as dApp Website
    participant Content as Content Script
    participant Background as Background Script
    participant UI as Extension UI
    participant User
    participant Store as Redux Store

    Website->>Content: ethereum.request({<br/>method: "eth_requestAccounts"<br/>})
    Content->>Background: Forward request
    Background->>Store: Check if already connected
    
    alt Already connected
        Store-->>Background: Return accounts
        Background-->>Content: Accounts
        Content-->>Website: Accounts array
    else Not connected
        Background->>UI: Open sidepanel/popup
        UI->>User: Show connection request<br/>- dApp name/URL<br/>- Permissions<br/>- Account to connect
        User->>UI: Approve or Reject
        
        alt User approves
            UI->>Store: Save connection
            Store->>Store: Store dApp permissions
            Store-->>Background: Connection approved
            Background->>Content: Inject provider
            Background-->>Content: Return accounts
            Content-->>Website: Accounts array
        else User rejects
            Background-->>Content: Error: User rejected
            Content-->>Website: Error
        end
    end
    
    Note over Website,Store: Connection established
    
    Website->>Content: ethereum.request({<br/>method: "eth_sendTransaction",<br/>params: [tx]<br/>})
    Content->>Background: Forward transaction
    Background->>UI: Show transaction review
    UI->>User: Review transaction details
    User->>UI: Approve transaction
    UI->>Background: Sign & send
    Background->>Background: Sign with private key
    Background->>Content: Transaction hash
    Content->>Website: Transaction hash
```

---

## 📊 Portfolio Data Loading

```mermaid
flowchart TD
    Start([User Opens Portfolio]) --> Init[Initialize Apollo Client]
    
    Init --> Q1[Query: portfolios<br/>ownerAddresses]
    Init --> Q2[Query: tokens<br/>contracts]
    Init --> Q3[Query: assetActivities<br/>address]
    
    Q1 -->|GraphQL API| Balances[Token Balances<br/>Multiple chains]
    Q2 -->|GraphQL API| Metadata[Token Metadata<br/>Logos, names, prices]
    Q3 -->|GraphQL API| Activity[Transaction History<br/>Swaps, transfers]
    
    Balances --> Cache[Apollo Cache<br/>Normalized storage]
    Metadata --> Cache
    Activity --> Cache
    
    Cache --> Transform[Transform Data<br/>- Aggregate chains<br/>- Calculate USD values<br/>- Sort by value<br/>- Filter spam]
    
    Transform --> Redux[Update Redux<br/>portfolio slice]
    
    Redux --> Render[Render Components]
    
    Render --> Display1[Portfolio Balance<br/>Total USD value]
    Render --> Display2[Token List<br/>With balances & prices]
    Render --> Display3[Activity Feed<br/>Recent transactions]
    Render --> Display4[NFT Gallery<br/>User's NFTs]
    
    Display1 --> Poll{Polling Active?}
    Display2 --> Poll
    Display3 --> Poll
    Display4 --> Poll
    
    Poll -->|Every 30s| Q1
```

---

## 🔐 Transaction Signing Flow

```mermaid
flowchart TD
    Start([Transaction Request]) --> Type{Transaction Type}
    
    Type -->|Swap| SwapTx[Prepare Swap TX<br/>Encode calldata]
    Type -->|Send| SendTx[Prepare Transfer TX]
    Type -->|Approve| ApproveTx[Prepare Approval TX]
    Type -->|dApp Request| DappTx[From dApp]
    
    SwapTx --> Simulate
    SendTx --> Simulate
    ApproveTx --> Simulate
    DappTx --> Simulate
    
    Simulate[Simulate Transaction<br/>Estimate gas] --> Valid{Valid?}
    
    Valid -->|No| Error[Show Error<br/>Transaction will fail]
    Valid -->|Yes| Review[Show Review Screen]
    
    Review --> UserAction{User Action}
    UserAction -->|Reject| Cancel([Transaction Cancelled])
    UserAction -->|Approve| Auth{Auth Required?}
    
    Auth -->|Yes| Biometric[Request Biometric<br/>Face ID / Touch ID]
    Auth -->|No| GetKey
    
    Biometric --> BiometricResult{Success?}
    BiometricResult -->|No| Cancel
    BiometricResult -->|Yes| GetKey
    
    GetKey[Retrieve Private Key<br/>From secure storage] --> Platform{Platform?}
    
    Platform -->|Mobile/Extension| Native[Sign with RNEthersRS<br/>Rust native module]
    Platform -->|Web| Provider[Delegate to wallet provider<br/>MetaMask, WalletConnect]
    
    Native --> Signed[Signed Transaction<br/>RLP encoded]
    Provider --> Signed
    
    Signed --> Broadcast[Broadcast to Blockchain<br/>Via RPC provider]
    
    Broadcast --> Hash[Receive TX Hash]
    
    Hash --> Store[Store in Redux<br/>transactions slice<br/>Status: "pending"]
    
    Store --> Monitor[Monitor Transaction]
    
    Monitor --> Poll{Poll RPC<br/>Every 3s}
    
    Poll -->|Pending| Monitor
    Poll -->|Confirmed| Success[Update Status<br/>"confirmed"]
    Poll -->|Failed| Failed[Update Status<br/>"failed"]
    
    Success --> Notify1[Show Success Notification]
    Failed --> Notify2[Show Error Notification]
    
    Notify1 --> End([Complete])
    Notify2 --> End
```

---

## 🏗️ Monorepo Package Dependencies

```mermaid
graph TD
    subgraph "Applications"
        Web[apps/web]
        Mobile[apps/mobile]
        Extension[apps/extension]
    end
    
    subgraph "Core Packages"
        UI[packages/ui<br/>UI Components & Theme]
        Uniswap[packages/uniswap<br/>Business Logic]
        Wallet[packages/wallet<br/>Wallet Management]
        API[packages/api<br/>API Clients]
        Utilities[packages/utilities<br/>Common Utils]
        Config[packages/config<br/>Configuration]
    end
    
    Web --> UI
    Web --> Uniswap
    Web --> Wallet
    Web --> API
    Web --> Utilities
    Web --> Config
    
    Mobile --> UI
    Mobile --> Uniswap
    Mobile --> Wallet
    Mobile --> API
    Mobile --> Utilities
    Mobile --> Config
    
    Extension --> UI
    Extension --> Uniswap
    Extension --> Wallet
    Extension --> API
    Extension --> Utilities
    Extension --> Config
    
    Uniswap --> API
    Uniswap --> Utilities
    
    Wallet --> Uniswap
    Wallet --> Utilities
    Wallet --> API
    
    UI --> Utilities
    
    style Web fill:#e1f5ff
    style Mobile fill:#e1f5ff
    style Extension fill:#e1f5ff
    style UI fill:#ffe1f5
    style Uniswap fill:#ffe1f5
    style Wallet fill:#ffe1f5
```

---

## 🔄 State Management Architecture

```mermaid
flowchart TB
    subgraph "UI Layer"
        Components[React Components<br/>Hooks, Context]
    end
    
    subgraph "State Management Layer"
        Redux[Redux Store<br/>Global State]
        Jotai[Jotai Atoms<br/>Lightweight State]
        ReactQuery[React Query<br/>Server State]
        Apollo[Apollo Client<br/>GraphQL Cache]
    end
    
    subgraph "Data Layer"
        API1[Trading API<br/>Quotes & Routes]
        API2[GraphQL API<br/>Tokens & Balances]
        API3[RPC Providers<br/>Blockchain]
        Local[Local Storage<br/>Persistence]
    end
    
    Components -->|useSelector<br/>useDispatch| Redux
    Components -->|useAtom| Jotai
    Components -->|useQuery<br/>useMutation| ReactQuery
    Components -->|useQuery<br/>useMutation| Apollo
    
    Redux -->|Redux-Saga<br/>Side Effects| API1
    Redux -->|Redux-Saga| API3
    Redux -->|Redux-Persist| Local
    
    ReactQuery --> API1
    Apollo --> API2
    
    API3 -->|Blockchain<br/>Interaction| Ethereum[Ethereum Network]
    
    style Components fill:#e1f5ff
    style Redux fill:#ffe1e1
    style Jotai fill:#fff4e1
    style ReactQuery fill:#e1ffe1
    style Apollo fill:#f0e1ff
```

---

## 🌍 Multi-Chain Architecture

```mermaid
flowchart LR
    App[RocketSAMM App] --> ChainSelector{Select Chain}
    
    ChainSelector -->|Ethereum| ETH[Ethereum Mainnet<br/>ChainId: 1]
    ChainSelector -->|Arbitrum| ARB[Arbitrum One<br/>ChainId: 42161]
    ChainSelector -->|Optimism| OP[Optimism<br/>ChainId: 10]
    ChainSelector -->|Base| BASE[Base<br/>ChainId: 8453]
    ChainSelector -->|Polygon| POLY[Polygon<br/>ChainId: 137]
    ChainSelector -->|Solana| SOL[Solana]
    
    ETH --> Provider1[RPC Provider<br/>Infura/Alchemy]
    ARB --> Provider2[RPC Provider<br/>Infura/Alchemy]
    OP --> Provider3[RPC Provider<br/>Infura/Alchemy]
    BASE --> Provider4[RPC Provider<br/>Infura/Alchemy]
    POLY --> Provider5[RPC Provider<br/>Infura/Alchemy]
    SOL --> Provider6[Solana RPC<br/>Helius/QuickNode]
    
    Provider1 --> Router1[Smart Contracts<br/>V2, V3, V4 Routers]
    Provider2 --> Router2[Smart Contracts<br/>V2, V3, V4 Routers]
    Provider3 --> Router3[Smart Contracts<br/>V2, V3, V4 Routers]
    Provider4 --> Router4[Smart Contracts<br/>V2, V3, V4 Routers]
    Provider5 --> Router5[Smart Contracts<br/>V2, V3, V4 Routers]
    Provider6 --> Jupiter[Jupiter Aggregator<br/>Solana DEX]
    
    style ETH fill:#627eea
    style ARB fill:#28a0f0
    style OP fill:#ff0420
    style BASE fill:#0052ff
    style POLY fill:#8247e5
    style SOL fill:#14f195
```

---

## 🔌 Extension Architecture

```mermaid
flowchart TD
    subgraph "Web Page Context"
        Website[dApp Website<br/>JavaScript]
        InjectedScript[Injected Script<br/>Window.ethereum]
    end
    
    subgraph "Content Script Context"
        ContentScript[Content Script<br/>Message Relay]
    end
    
    subgraph "Extension Background Context"
        Background[Background Script<br/>Service Worker]
        Store[Redux Store]
        SignerMgr[Signer Manager]
        ProviderMgr[Provider Manager]
    end
    
    subgraph "Extension UI Context"
        Sidepanel[Side Panel UI<br/>React App]
        Popup[Popup UI<br/>React App]
    end
    
    subgraph "Storage"
        ChromeStorage[Chrome Storage API<br/>Encrypted State]
        SecureStorage[Secure Storage<br/>Private Keys]
    end
    
    Website -->|window.ethereum.request| InjectedScript
    InjectedScript -->|postMessage| ContentScript
    ContentScript -->|chrome.runtime.sendMessage| Background
    
    Background -->|Query State| Store
    Background -->|Sign TX| SignerMgr
    Background -->|RPC Call| ProviderMgr
    
    Background -->|User Action Needed| Sidepanel
    Background -->|User Action Needed| Popup
    
    Sidepanel -->|User Response| Background
    Popup -->|User Response| Background
    
    Store -->|Persist| ChromeStorage
    SignerMgr -->|Keys| SecureStorage
    
    Background -->|Response| ContentScript
    ContentScript -->|postMessage| InjectedScript
    InjectedScript -->|Promise resolve| Website
    
    style Website fill:#e1f5ff
    style Background fill:#ffe1e1
    style Sidepanel fill:#e1ffe1
    style ChromeStorage fill:#fff4e1
```

---

## 📱 Mobile App Architecture

```mermaid
flowchart TD
    subgraph "React Native Layer"
        App[App.tsx<br/>Root Component]
        Navigation[React Navigation<br/>Screen Management]
        Screens[Screens<br/>Home, Swap, Send, etc.]
        Components[Shared Components<br/>Buttons, Inputs, etc.]
    end
    
    subgraph "State Layer"
        Redux[Redux Store<br/>Global State]
        Sagas[Redux Sagas<br/>Side Effects]
        Apollo[Apollo Client<br/>GraphQL]
    end
    
    subgraph "Native Modules (iOS/Android)"
        RNEthers[RNEthersRS<br/>Rust - Crypto Ops]
        Biometric[Biometric Module<br/>Face ID / Touch ID]
        CloudBackup[Cloud Backup<br/>iCloud / Google Drive]
        WalletConnect[WalletConnect Module<br/>Deep Links]
        MMKV[MMKV Storage<br/>Fast Key-Value]
    end
    
    subgraph "External Services"
        GraphQLAPI[GraphQL API<br/>Token Data]
        TradingAPI[Trading API<br/>Swap Quotes]
        RPC[RPC Providers<br/>Blockchain]
        Firebase[Firebase<br/>Notifications]
    end
    
    App --> Navigation
    Navigation --> Screens
    Screens --> Components
    
    Components --> Redux
    Components --> Apollo
    
    Redux --> Sagas
    Sagas --> RNEthers
    Sagas --> CloudBackup
    Sagas --> WalletConnect
    
    Redux --> MMKV
    
    Apollo --> GraphQLAPI
    Sagas --> TradingAPI
    Sagas --> RPC
    
    Firebase --> App
    
    Screens --> Biometric
    
    style RNEthers fill:#ff9999
    style Biometric fill:#ff9999
    style CloudBackup fill:#ff9999
    style WalletConnect fill:#ff9999
```

---

## 🎯 Trading API Integration

```mermaid
sequenceDiagram
    participant App
    participant TradeService
    participant TradingAPI
    participant Router as Smart Contract Router

    App->>TradeService: getTrade(tradeArgs)
    
    TradeService->>TradeService: Validate input<br/>Check amounts, currencies
    
    TradeService->>TradingAPI: POST /quote<br/>{<br/>  tokenIn, tokenOut,<br/>  amount, type,<br/>  slippage, protocols<br/>}
    
    TradingAPI->>TradingAPI: Find optimal route<br/>- Check V2, V3, V4 pools<br/>- Compare gas costs<br/>- Consider UniswapX
    
    TradingAPI-->>TradeService: Quote Response<br/>{<br/>  route, priceImpact,<br/>  gasEstimate,<br/>  quoteId<br/>}
    
    TradeService-->>App: TradeWithGasEstimates
    
    App->>App: User reviews & confirms
    
    App->>TradeService: Execute swap
    
    TradeService->>TradingAPI: POST /swap<br/>{<br/>  quoteId,<br/>  slippage,<br/>  deadline<br/>}
    
    TradingAPI-->>TradeService: Swap Response<br/>{<br/>  to, data, value,<br/>  gasLimit<br/>}
    
    TradeService->>Router: Send Transaction
    Router-->>TradeService: Transaction Hash
    TradeService-->>App: Success
```

---

## 🗂️ GraphQL Data Flow

```mermaid
flowchart LR
    subgraph "Client"
        Component[React Component]
        Hook[useQuery Hook]
        Cache[Apollo Cache<br/>InMemoryCache]
    end
    
    subgraph "Network"
        HttpLink[HTTP Link]
    end
    
    subgraph "Server"
        GraphQLAPI[GraphQL API<br/>api.uniswap.org/v1/graphql]
        Resolvers[Resolvers]
        DataSources[Data Sources<br/>- Subgraphs<br/>- Databases<br/>- REST APIs]
    end
    
    Component -->|query| Hook
    Hook -->|1. Check cache| Cache
    
    Cache -->|Cache miss| HttpLink
    Cache -->|Cache hit| Hook
    
    HttpLink -->|2. GraphQL query| GraphQLAPI
    GraphQLAPI --> Resolvers
    Resolvers --> DataSources
    
    DataSources -->|Data| Resolvers
    Resolvers -->|Response| GraphQLAPI
    GraphQLAPI -->|3. JSON response| HttpLink
    
    HttpLink -->|4. Update cache| Cache
    Cache -->|5. Return data| Hook
    Hook -->|6. Render| Component
    
    style Cache fill:#ffe1e1
    style Component fill:#e1f5ff
    style GraphQLAPI fill:#e1ffe1
```

---

## 🔒 Security Flow

```mermaid
flowchart TD
    Start([Transaction Request]) --> Check1{Security Checks}
    
    Check1 -->|Token Safety| TokenCheck[Check Token<br/>- Spam detection<br/>- Honeypot check<br/>- Blockaid scan]
    Check1 -->|Address Validation| AddressCheck[Validate Address<br/>- Checksum format<br/>- Not contract<br/>- Not blacklisted]
    Check1 -->|Contract Validation| ContractCheck[Simulate Transaction<br/>- Will it revert?<br/>- Unexpected changes?<br/>- Malicious code?]
    
    TokenCheck --> Warnings{Any Warnings?}
    AddressCheck --> Warnings
    ContractCheck --> Warnings
    
    Warnings -->|Yes| ShowWarning[Show Warning Modal<br/>User must acknowledge]
    Warnings -->|No| Sign
    
    ShowWarning --> UserDecision{User Proceeds?}
    UserDecision -->|No| Cancel([Transaction Cancelled])
    UserDecision -->|Yes| Sign
    
    Sign[Request Signature] --> AuthCheck{Auth Required?}
    
    AuthCheck -->|Yes| Biometric[Biometric Auth<br/>Face ID / Touch ID]
    AuthCheck -->|No| GetKey
    
    Biometric --> AuthResult{Success?}
    AuthResult -->|No| Cancel
    AuthResult -->|Yes| GetKey
    
    GetKey[Retrieve Private Key] --> KeyLocation{Where?}
    
    KeyLocation -->|iOS| Keychain[iOS Keychain<br/>Secure Enclave]
    KeyLocation -->|Android| KeyStore[Android KeyStore<br/>Hardware-backed]
    KeyLocation -->|Web| Provider[External Provider<br/>MetaMask, etc.]
    
    Keychain --> SignTx
    KeyStore --> SignTx
    Provider --> SignTx
    
    SignTx[Sign Transaction] --> Encrypted[Encrypted Signature]
    
    Encrypted --> Broadcast[Broadcast to Network]
    
    Broadcast --> Monitor[Monitor Transaction]
    
    Monitor --> Success([Transaction Complete])
    
    style TokenCheck fill:#ffe1e1
    style AddressCheck fill:#ffe1e1
    style ContractCheck fill:#ffe1e1
    style Biometric fill:#e1ffe1
    style Keychain fill:#e1f5ff
    style KeyStore fill:#e1f5ff
```

---

## 📈 Performance Optimization Strategies

```mermaid
mindmap
  root((Performance))
    React Optimization
      React.memo
      useMemo
      useCallback
      Code Splitting
      Lazy Loading
    State Management
      Redux Reselect
      Normalized State
      Avoid Re-renders
      Jotai for Simple State
    Data Fetching
      Apollo Cache
      React Query Cache
      Stale-While-Revalidate
      Polling Intervals
      Prefetching
    Mobile Specific
      FlashList not FlatList
      Reanimated for Animations
      Native Modules for Heavy Ops
      MMKV not AsyncStorage
      Image Caching
    Bundle Size
      Tree Shaking
      Dynamic Imports
      Remove Unused Code
      Compress Assets
      Minimize Dependencies
    Network
      GraphQL Batch Requests
      HTTP/2
      Compression
      CDN for Static Assets
      Service Workers Web
```

---

## 🎨 Component Communication Patterns

```mermaid
flowchart TB
    subgraph "Props Down"
        Parent[Parent Component]
        Parent -->|Props| Child1[Child Component]
        Parent -->|Props| Child2[Child Component]
    end
    
    subgraph "Callbacks Up"
        Child1 -->|Event Handler| Parent
        Child2 -->|Event Handler| Parent
    end
    
    subgraph "Context API"
        Provider[Context Provider]
        Provider -.->|Context| Consumer1[Consumer 1]
        Provider -.->|Context| Consumer2[Consumer 2]
        Provider -.->|Context| Consumer3[Consumer 3]
    end
    
    subgraph "Redux"
        Component1[Component A]
        Component2[Component B]
        ReduxStore[Redux Store]
        Component1 -->|dispatch| ReduxStore
        ReduxStore -->|useSelector| Component2
    end
    
    subgraph "Event Bus"
        Emitter[Event Emitter]
        Listener1[Listener 1]
        Listener2[Listener 2]
        Emitter -.->|Event| Listener1
        Emitter -.->|Event| Listener2
    end
    
    style Parent fill:#e1f5ff
    style Provider fill:#ffe1e1
    style ReduxStore fill:#e1ffe1
    style Emitter fill:#fff4e1
```

---

These diagrams provide a visual representation of the key architectural flows in RocketSAMM. Use them alongside the main architecture guide for a comprehensive understanding of the system!

