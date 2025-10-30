# RocketSAMM: Decentralized Exchange Platform

This repository contains the RocketSAMM front-end interfaces, including the Web App, Wallet Mobile App, and Wallet Extension. RocketSAMM is a decentralized exchange protocol for Ethereum-based assets.

## Interfaces

- Web: [app.rocketsamm.com](https://app.rocketsamm.com)
- Wallet (mobile + extension): Coming soon

## Install & Apps

```bash
git clone <your-repository-url>
bun install
bun lfg
bun web start
```

For instructions per application or package, see the README published for each application:

- [Web](apps/web/README.md)
- [Mobile](apps/mobile/README.md)
- [Extension](apps/extension/README.md)

## Contributing

For instructions on the best way to contribute, please review our [Contributing guide](CONTRIBUTING.md)!

## Socials / Contact

- X (Formerly Twitter): [@RocketSAMM](https://x.com/RocketSAMM)
- Email: [contact@rocketsamm.com](mailto:contact@rocketsamm.com)

## RocketSAMM Links

- Website: [rocketsamm.com](https://rocketsamm.com/)
- Docs: [docs.rocketsamm.com](https://docs.rocketsamm.com/)

## Protocol Information

RocketSAMM is built on proven decentralized exchange technology, supporting:
- V2 liquidity pools with automatic market-making
- Token swaps across multiple blockchain networks
- Decentralized liquidity provision

## Production & Release Process

RocketSAMM continuously develops and improves all front-end interfaces.
At the end of each development cycle:

1. We publish the latest production-ready code.

2. Releases are automatically tagged — view them in the Releases tab.

## 🗂 Directory Structure

| Folder      | Contents                                                                       |
| ----------- | ------------------------------------------------------------------------------ |
| `apps/`     | The home for each standalone application.                                      |
| `config/`   | Shared infrastructure packages and configurations.                             |
| `packages/` | Shared code packages covering UI, shared functionality, and shared utilities.  |
