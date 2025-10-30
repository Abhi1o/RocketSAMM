# RocketSAMM Quick Start Guide

Welcome to RocketSAMM! This guide will help you get started with the codebase quickly.

---

## 🚀 Getting Started in 5 Minutes

### Prerequisites

1. **Bun** (v1.0+) - Fast package manager
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Node.js** (v18+) - Required for some tools
   ```bash
   # Check version
   node --version
   ```

3. **Git** - Version control
   ```bash
   git --version
   ```

### Initial Setup

```bash
# 1. Clone the repository (if not already done)
git clone <your-repository-url>
cd RocketSAMM

# 2. Install dependencies
bun install

# 3. Check local environment
bun local:check

# 4. Set up environment variables (requires 1Password CLI)
bun lfg
# If you don't have 1Password, create .env files manually

# 5. Start the web app
bun web dev
```

**That's it!** Open http://localhost:3000 in your browser.

---

## 📱 Running Mobile App

### iOS (macOS only)

```bash
# 1. Install Xcode from App Store

# 2. Install CocoaPods dependencies
cd apps/mobile
bun pod

# 3. Start iOS simulator
bun ios
```

### Android

```bash
# 1. Install Android Studio

# 2. Set ANDROID_HOME in your shell profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 3. Start Android emulator from Android Studio

# 4. Run the app
cd apps/mobile
bun android
```

---

## 🧩 Running Browser Extension

```bash
# 1. Start development server
cd apps/extension
bun start

# 2. Load extension in Chrome
# - Open chrome://extensions/
# - Enable "Developer mode"
# - Click "Load unpacked"
# - Select: apps/extension/.output/chrome-mv3
```

---

## 🗺️ Project Structure - Quick Tour

```
RocketSAMM/
│
├── apps/
│   ├── web/                    # 🌐 Main web app
│   │   ├── src/
│   │   │   ├── pages/         # All page components
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── state/         # Redux slices
│   │   │   └── hooks/         # Custom React hooks
│   │   └── package.json
│   │
│   ├── mobile/                # 📱 iOS & Android app
│   │   ├── src/
│   │   │   ├── screens/       # Screen components
│   │   │   ├── components/    # Reusable components
│   │   │   ├── features/      # Feature modules
│   │   │   └── app/           # Redux store, navigation
│   │   └── package.json
│   │
│   └── extension/             # 🧩 Browser extension
│       ├── src/
│       │   ├── entrypoints/   # Entry points (background, content, sidepanel)
│       │   ├── app/           # React components
│       │   └── store/         # Redux store
│       └── package.json
│
└── packages/                   # 📦 Shared code
    ├── ui/                     # UI components & theme
    ├── uniswap/               # Core business logic
    ├── wallet/                # Wallet management
    ├── api/                   # API clients
    └── utilities/             # Helper functions
```

---

## 🎯 Your First Task - Understanding a Feature

Let's trace through the **Token Swap** feature to understand how everything works.

### Step 1: Find the Swap Page

**File**: `apps/web/src/pages/Swap/index.tsx`

This is the main swap page. Open it and you'll see:
- `SwapPage` component (entry point)
- `Swap` component (main swap form)
- Currency input panels
- Swap button

### Step 2: Follow the State

**File**: `packages/uniswap/src/features/transactions/swap/stores/swapFormStore/`

This directory contains:
- `hooks/` - React hooks for swap state
- `swapFormStore.ts` - Zustand store for swap form
- Look at `useDerivedSwapInfo.ts` - This hook combines all swap state

### Step 3: See How Quotes Are Fetched

**File**: `packages/uniswap/src/features/transactions/swap/services/tradeService/evmTradeService.ts`

Key function: `getTrade()`
- Takes input (tokens, amount)
- Calls Trading API
- Returns quote with gas estimates

### Step 4: Check the API Call

**File**: `packages/uniswap/src/features/transactions/swap/repositories/TradingApiRepository.ts`

This makes the actual HTTP call to the Trading API.

### Step 5: See Transaction Execution

**File**: `packages/uniswap/src/features/transactions/swap/services/executeSwapService.ts`

This handles:
- Token approvals
- Transaction signing
- Broadcasting to blockchain

---

## 🔍 Common Development Tasks

### Task: Add a New UI Component

```bash
# 1. Create component in packages/ui
cd packages/ui/src/components
mkdir MyComponent
touch MyComponent/MyComponent.tsx

# 2. Write component using Tamagui
cat > MyComponent/MyComponent.tsx << 'EOF'
import { Button, Text } from 'ui/src'

export function MyComponent() {
  return (
    <Button onPress={() => console.log('Clicked!')}>
      <Text>Click Me</Text>
    </Button>
  )
}
EOF

# 3. Export from index
echo "export * from './MyComponent/MyComponent'" >> index.ts

# 4. Use in web app
# Import: import { MyComponent } from 'ui/src'
```

### Task: Add a New Redux Slice

```bash
# 1. Create slice file
cd apps/web/src/state
mkdir myFeature
touch myFeature/slice.ts

# 2. Write slice
cat > myFeature/slice.ts << 'EOF'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MyFeatureState {
  value: number
}

const initialState: MyFeatureState = {
  value: 0
}

const myFeatureSlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload
    }
  }
})

export const { increment, setValue } = myFeatureSlice.actions
export const myFeatureReducer = myFeatureSlice.reducer
EOF

# 3. Add to root reducer
# Edit apps/web/src/state/webReducer.ts
# Add: myFeature: myFeatureReducer

# 4. Use in component
# import { useDispatch, useSelector } from 'react-redux'
# const value = useSelector(state => state.myFeature.value)
# dispatch(increment())
```

### Task: Add a GraphQL Query

```bash
# 1. Add query to GraphQL file
cd packages/api/src/clients/graphql
echo "
query MyNewQuery(\$address: String!) {
  token(chain: ETHEREUM, address: \$address) {
    id
    name
    symbol
  }
}
" >> queries.graphql

# 2. Generate types
cd ../../../..
bun g:build

# 3. Use in component
# import { useMyNewQueryQuery } from 'api/src'
# const { data } = useMyNewQueryQuery({ variables: { address: '0x...' } })
```

---

## 🐛 Debugging Tips

### Web App Debugging

1. **React DevTools**
   - Install: https://chrome.google.com/webstore/detail/react-developer-tools
   - Inspect component tree
   - View props and state

2. **Redux DevTools**
   - Install: https://chrome.google.com/webstore/detail/redux-devtools
   - See all dispatched actions
   - Time-travel debugging

3. **Network Tab**
   - Open Chrome DevTools (F12)
   - Go to Network tab
   - Filter by "XHR" to see API calls
   - Click request to see details

### Mobile App Debugging

1. **React Native Debugger**
   - Enable: Shake device → "Debug"
   - Opens Chrome DevTools

2. **Reactotron** (already configured)
   - Download: https://github.com/infinitered/reactotron/releases
   - Open Reactotron app
   - See Redux actions, API calls, logs

3. **Native Logs**
   - iOS: `npx react-native log-ios`
   - Android: `npx react-native log-android`

### Extension Debugging

1. **Background Script**
   - Go to `chrome://extensions/`
   - Click "Inspect views: background page"

2. **Content Script**
   - Open any webpage
   - Open DevTools (F12)
   - Console shows content script logs

3. **Side Panel**
   - Open side panel
   - Right-click → "Inspect"

---

## ✅ Testing Your Changes

### Run All Tests
```bash
bun g:test
```

### Run Tests for Specific Package
```bash
# Web only
cd apps/web
bun test

# UI package
cd packages/ui
bun test

# Uniswap package
cd packages/uniswap
bun test
```

### Type Checking
```bash
bun g:typecheck
```

### Linting
```bash
bun g:lint
bun g:lint:fix  # Auto-fix issues
```

### Format Code
```bash
bun g:format:fix
```

### Run All Quality Checks
```bash
bun g:fix  # Lint + format
bun g:typecheck
bun g:test
```

---

## 📝 Making Your First Change

Let's make a simple change to see the whole flow:

### 1. Change Swap Button Text

**File**: `packages/uniswap/src/features/transactions/swap/review/SwapReviewScreen/SwapReviewFooter/SubmitSwapButton.tsx`

Find the button text and change it:
```typescript
// Before
<Text>Swap</Text>

// After
<Text>Execute Swap</Text>
```

### 2. See the Change

```bash
# Web auto-reloads
# Just save the file and check browser

# Mobile needs rebuild
cd apps/mobile
bun ios  # or bun android
```

### 3. Add a Console Log

```typescript
export function SubmitSwapButton() {
  console.log('SubmitSwapButton rendered!')
  
  const handlePress = () => {
    console.log('Swap button clicked!')
    // existing code...
  }
  
  // rest of component...
}
```

### 4. Check Logs

- **Web**: Open browser console (F12)
- **Mobile**: Check Metro bundler terminal
- **Extension**: Right-click side panel → Inspect

### 5. Test It

1. Go to swap page
2. Enter token amounts
3. Click swap button
4. See your logs!

---

## 🎓 Learning Resources

### Essential Files to Read

1. **Architecture**
   - `ARCHITECTURE_GUIDE.md` - Complete architecture
   - `ARCHITECTURE_DIAGRAMS.md` - Visual flows
   - `API_REFERENCE.md` - API endpoints

2. **Project Docs**
   - `CLAUDE.md` - Project guidelines
   - `README.md` - Project overview
   - `CONTRIBUTING.md` - Contribution guide

3. **App-Specific**
   - `apps/web/CLAUDE.md` - Web app specifics
   - `apps/mobile/CLAUDE.md` - Mobile app specifics
   - `apps/extension/CLAUDE.md` - Extension specifics

### Key Concepts to Understand

1. **React & TypeScript**
   - Components, hooks, props
   - Type safety, interfaces
   - Functional programming

2. **Redux & State Management**
   - Actions, reducers, selectors
   - Redux Toolkit (createSlice)
   - Middleware (sagas)

3. **Blockchain & Web3**
   - Ethereum, accounts, transactions
   - Smart contracts, ABIs
   - Gas, nonces, signatures

4. **GraphQL**
   - Queries, mutations
   - Apollo Client
   - Caching strategies

### Recommended Learning Path

**Week 1: Setup & Basics**
- ✅ Get project running locally
- ✅ Explore file structure
- ✅ Make small UI changes
- ✅ Read this guide + ARCHITECTURE_GUIDE.md

**Week 2: Feature Deep Dive**
- 🔍 Pick one feature (e.g., Swap)
- 🔍 Trace it from UI → State → API → Blockchain
- 🔍 Read all related files
- 🔍 Add console.logs to understand flow

**Week 3: Make Real Changes**
- 🛠 Fix a bug
- 🛠 Add a small feature
- 🛠 Write tests
- 🛠 Submit PR

---

## 💡 Pro Tips

### 1. Use TypeScript Effectively
```typescript
// Hover over variables to see types
const trade = useTrade(args)
//    ^? TradeWithGasEstimates

// Go to definition: Cmd+Click (Mac) or Ctrl+Click (Windows)
// This helps navigate the codebase quickly
```

### 2. Search the Codebase
```bash
# Find all usages of a function
grep -r "useTrade" apps/web/src

# Find file by name
find . -name "SwapButton*"

# Search in specific directory
grep -r "executeSwap" packages/uniswap/src/features/transactions
```

### 3. Use Git Effectively
```bash
# See recent changes
git log --oneline -10

# See what changed in a file
git log -p apps/web/src/pages/Swap/index.tsx

# Blame (see who wrote each line)
git blame apps/web/src/pages/Swap/index.tsx
```

### 4. Read Tests
```bash
# Tests are great documentation
# Find test file
find . -name "*Swap*.test.*"

# Tests show how to use the code
cat packages/uniswap/src/features/transactions/swap/__tests__/useTrade.test.ts
```

---

## ❓ Common Questions

### Q: How do I add a new token?
**A:** Tokens come from token lists. Edit the token list URL in `constants/lists.ts`.

### Q: How do I change the default slippage?
**A:** Edit `packages/uniswap/src/features/transactions/swap/constants.ts`

### Q: Where are private keys stored?
**A:** 
- **iOS**: Keychain
- **Android**: Android Keystore
- **Extension**: Chrome Storage (encrypted)
- **Web**: External wallet (MetaMask, etc.)

### Q: How do I test with testnet?
**A:** 
1. Change network in app settings
2. Use testnet RPC URLs
3. Get testnet ETH from faucet
4. Enable testnet mode in mobile app

### Q: How do I add a new blockchain network?
**A:** 
1. Add chain config to `packages/uniswap/src/features/chains/chainInfo.ts`
2. Add RPC URLs to config
3. Update routing API to support chain
4. Update GraphQL queries for new chain

### Q: Where are translations stored?
**A:** `packages/uniswap/src/i18n/locales/en-US.json` (and other locales)

---

## 🆘 Getting Help

1. **Read the Docs**: Start with the guides in this repo
2. **Search Issues**: Check if someone already asked your question
3. **Check Tests**: Tests show expected behavior
4. **Use TypeScript**: Hover over things to see types
5. **Add Logs**: `console.log` is your friend
6. **Ask for Help**: Don't struggle alone!

---

## 🎉 You're Ready!

You now have everything you need to start contributing to RocketSAMM. Happy coding! 🚀

**Next Steps**:
1. Read `ARCHITECTURE_GUIDE.md` for deep understanding
2. Pick a feature and trace through the code
3. Make a small change
4. Run tests and submit a PR

**Remember**: Everyone was new once. Take your time, ask questions, and enjoy the journey! 💪

