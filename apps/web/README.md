# RocketSAMM Web Interface

## Accessing RocketSAMM

Visit [app.rocketsamm.com](https://app.rocketsamm.com) to access the RocketSAMM decentralized exchange interface.

## Running the interface locally

```bash
bun install
bun web start
```

## Development Server

Start the development server:

```bash
bun web dev
```

The app will be available at `http://localhost:3000`

## Building for Production

```bash
bun web build:production
```

## Translations

The interface supports 36+ languages. Translation files are located in `packages/uniswap/src/i18n/locales/translations/`.

To update translations:

```bash
bun i18n:extract  # Extract translation keys
```

## RocketSAMM V2 Protocol

RocketSAMM supports the V2 protocol for decentralized exchange:

- Swap tokens: <https://app.rocketsamm.com/swap>
- View liquidity pools: <https://app.rocketsamm.com/pools>
- Add liquidity: <https://app.rocketsamm.com/add>
- Explore tokens: <https://app.rocketsamm.com/explore/tokens>

## Deployment

For deployment instructions, see [VERCEL_DEPLOYMENT.md](../../VERCEL_DEPLOYMENT.md) in the root directory.
