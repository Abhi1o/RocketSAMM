# RocketSAMM Web App - Vercel Deployment Guide

This guide will help you deploy the RocketSAMM web application to Vercel.

---

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket
3. **Bun Runtime**: Vercel supports Bun (required for this project)

---

## Quick Start Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Add New Project"

2. **Import Git Repository**
   - Connect your GitHub/GitLab/Bitbucket account
   - Select your RocketSAMM repository
   - Click "Import"

3. **Configure Project Settings**

   Use these **exact settings**:

   **Framework Preset**: `Vite`

   **Root Directory**: `.` (leave as default - monorepo root)

   **Build & Development Settings**:
   ```
   Build Command: cd apps/web && bun run build:production
   Output Directory: apps/web/dist
   Install Command: bun install
   ```

   **Node.js Version**: `22.x` (or `22.13.1` specifically)

4. **Add Environment Variables** (see section below)

5. **Click "Deploy"**

---

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from repo root)
vercel

# For production deployment
vercel --prod
```

---

## Environment Variables Configuration

### Required Environment Variables

Add these in **Vercel Dashboard → Project Settings → Environment Variables**:

#### **Production API Keys** (Required)

```bash
# AWS/GraphQL API Endpoint
REACT_APP_AWS_API_ENDPOINT=https://interface.gateway.uniswap.org/v1/graphql

# Infura Key (for blockchain RPC)
REACT_APP_INFURA_KEY=099fc58e0de9451d80b18d7c74caa7c1

# Analytics
REACT_APP_ANALYTICS_ENABLED=true

# Amplitude Proxy
REACT_APP_AMPLITUDE_PROXY_URL=https://api.uniswap.org/v1/amplitude-proxy

# Statsig Proxy
REACT_APP_STATSIG_PROXY_URL=https://api.uniswap.org/v1/statsig-proxy

# WalletConnect Project ID
REACT_APP_WALLET_CONNECT_PROJECT_ID=c6c9bacd35afa3eb9e6cccf6d8464395

# Uniswap API
REACT_APP_UNISWAP_API_URL=https://api.uniswap.org/v2

# Temp API URL
REACT_APP_TEMP_API_URL=https://temp.api.uniswap.org/v1
```

#### **Optional Environment Variables**

```bash
# MoonPay Integration
REACT_APP_MOONPAY_API=https://api.moonpay.com
REACT_APP_MOONPAY_PUBLISHABLE_KEY=pk_test_DycfESRid31UaSxhI5yWKe1r5E5kKSz
REACT_APP_MOONPAY_LINK=https://us-central1-uniswap-mobile.cloudfunctions.net/signMoonpayLinkV2?platform=web&env=staging

# Sentry Error Tracking
REACT_APP_SENTRY_DSN=https://a3c62e400b8748b5a8d007150e2f38b7@o1037921.ingest.sentry.io/4504255148851200

# QuickNode RPC URLs
REACT_APP_QUICKNODE_MAINNET_RPC_URL=https://magical-alien-tab.quiknode.pro/669e87e569a8277d3fbd9e202f9df93189f19f4c
REACT_APP_BNB_RPC_URL=https://rough-sleek-hill.bsc.quiknode.pro/413cc98cbc776cda8fdf1d0f47003583ff73d9bf

# Build Environment
CLOUDFLARE_ENV=production
ROLLDOWN_OPTIONS_VALIDATION=loose
```

### How to Add Environment Variables in Vercel:

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `REACT_APP_INFURA_KEY`)
   - **Value**: Variable value
   - **Environment**: Select `Production`, `Preview`, and `Development` (all three)
4. Click "Save"

**Pro Tip**: You can bulk import from `.env.defaults` file:
- Copy the contents of `.env.defaults`
- Paste into Vercel's bulk import feature
- Vercel will parse and add all variables

---

## Vercel Configuration File

The `vercel.json` file is already configured with:

```json
{
  "buildCommand": "cd apps/web && bun run build:production",
  "outputDirectory": "apps/web/dist",
  "installCommand": "bun install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ],
  "headers": [...]
}
```

This ensures:
- ✅ Correct build directory (apps/web)
- ✅ Bun package manager is used
- ✅ Production optimizations
- ✅ SPA routing (all routes go to index.html)
- ✅ Proper caching headers for assets

---

## Build Settings Breakdown

### Build Command
```bash
cd apps/web && bun run build:production
```
- Navigates to the web app directory
- Runs production build with Vite/Rolldown
- Creates optimized bundle

### Output Directory
```
apps/web/dist
```
- Vite outputs built files to `dist/` folder
- Vercel serves files from this directory

### Install Command
```bash
bun install
```
- Uses Bun (faster than npm/yarn)
- Installs all monorepo dependencies

---

## Important Notes

### 1. Monorepo Structure
This is a **monorepo** with multiple apps:
- `apps/web/` - Web interface (what you're deploying)
- `apps/mobile/` - React Native app
- `apps/extension/` - Browser extension
- `packages/` - Shared code

Vercel needs to:
- Install dependencies from **root** (`bun install`)
- Build from **apps/web** directory
- Serve from **apps/web/dist**

### 2. Node.js Version
**Required**: Node.js 22.13.1 (specified in package.json)

In Vercel:
- Go to **Settings → General**
- Set **Node.js Version**: `22.x`

### 3. Bun Runtime Support
Vercel automatically detects `bun.lock` and uses Bun for:
- Installing dependencies
- Running build scripts

### 4. Build Time
First build may take **5-10 minutes** due to:
- Large monorepo
- TypeScript compilation
- Multiple packages to build
- NX caching setup

Subsequent builds are **faster** due to Vercel's caching.

---

## Deployment Steps Summary

### Step-by-Step Checklist

- [ ] **1. Push code to Git**
  ```bash
  git add .
  git commit -m "feat: RocketSAMM rebranding complete"
  git push origin main
  ```

- [ ] **2. Go to Vercel Dashboard**
  - Visit [vercel.com/new](https://vercel.com/new)

- [ ] **3. Import Repository**
  - Connect Git provider
  - Select RocketSAMM repo

- [ ] **4. Configure Build Settings**
  - Framework: `Vite`
  - Build Command: `cd apps/web && bun run build:production`
  - Output Directory: `apps/web/dist`
  - Install Command: `bun install`

- [ ] **5. Add Environment Variables**
  - Copy from `.env.defaults`
  - Add all `REACT_APP_*` variables
  - Select all environments (Production, Preview, Development)

- [ ] **6. Deploy**
  - Click "Deploy"
  - Wait 5-10 minutes for first build

- [ ] **7. Verify Deployment**
  - Visit deployed URL
  - Check console for errors
  - Test swap functionality
  - Verify wallet connections work

---

## Custom Domain Setup (Optional)

1. **Add Domain in Vercel**:
   - Go to **Settings → Domains**
   - Click "Add Domain"
   - Enter your domain (e.g., `rocketsamm.com`)

2. **Configure DNS**:
   - Add CNAME record pointing to Vercel:
     ```
     Type: CNAME
     Name: www (or @)
     Value: cname.vercel-dns.com
     ```

3. **Wait for SSL Certificate**:
   - Vercel auto-generates SSL (takes 1-5 minutes)
   - Your site will be available at `https://yourdomain.com`

---

## Troubleshooting

### Build Fails: "Module not found"
**Solution**: Ensure all workspace dependencies are linked
```bash
# Locally test build
bun install
bun g:build
cd apps/web && bun run build:production
```

### Build Fails: "Out of memory"
**Solution**: Increase Node.js memory in build settings
- Add environment variable: `NODE_OPTIONS=--max_old_space_size=4096`

### Build Timeout
**Solution**: Vercel has 45-minute build limit (free tier)
- Consider upgrading to Pro plan
- Or optimize build by removing unused dependencies

### Environment Variables Not Working
**Solution**:
- Check variable names start with `REACT_APP_`
- Verify they're added to all environments
- Redeploy after adding variables

### Blank Page After Deployment
**Solution**:
- Check browser console for errors
- Verify environment variables are set
- Check if API endpoints are accessible

### Wallet Not Connecting
**Solution**:
- Verify `REACT_APP_WALLET_CONNECT_PROJECT_ID` is set
- Check `REACT_APP_INFURA_KEY` is valid
- Ensure you're on a supported network

---

## Post-Deployment Checklist

- [ ] **Test Core Functionality**:
  - [ ] Homepage loads correctly
  - [ ] Swap interface works
  - [ ] Wallet connection works
  - [ ] Token search works
  - [ ] Pool pages load
  - [ ] NFT pages load

- [ ] **Check Branding**:
  - [ ] "RocketSAMM" appears instead of "Uniswap"
  - [ ] Logo displays correctly
  - [ ] Footer shows "RocketSAMM Team"
  - [ ] Browser tab shows "RocketSAMM Interface"

- [ ] **Performance**:
  - [ ] Run Lighthouse audit
  - [ ] Check Core Web Vitals in Vercel Analytics
  - [ ] Verify images/fonts load

- [ ] **Security**:
  - [ ] SSL certificate active (https://)
  - [ ] CSP headers configured
  - [ ] No sensitive data in console

---

## Useful Vercel Commands

```bash
# View deployment logs
vercel logs <deployment-url>

# List all deployments
vercel ls

# Remove a deployment
vercel rm <deployment-id>

# Open project in browser
vercel open

# View project info
vercel inspect
```

---

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vite Deployment Guide**: https://vitejs.dev/guide/static-deploy.html#vercel
- **Monorepo Deployment**: https://vercel.com/docs/monorepos

---

## Quick Reference: Environment Variables

Copy-paste ready for Vercel bulk import:

```env
REACT_APP_AWS_API_ENDPOINT=https://interface.gateway.uniswap.org/v1/graphql
REACT_APP_INFURA_KEY=099fc58e0de9451d80b18d7c74caa7c1
REACT_APP_ANALYTICS_ENABLED=true
REACT_APP_AMPLITUDE_PROXY_URL=https://api.uniswap.org/v1/amplitude-proxy
REACT_APP_STATSIG_PROXY_URL=https://api.uniswap.org/v1/statsig-proxy
REACT_APP_WALLET_CONNECT_PROJECT_ID=c6c9bacd35afa3eb9e6cccf6d8464395
REACT_APP_UNISWAP_API_URL=https://api.uniswap.org/v2
REACT_APP_TEMP_API_URL=https://temp.api.uniswap.org/v1
CLOUDFLARE_ENV=production
ROLLDOWN_OPTIONS_VALIDATION=loose
```

---

**Your RocketSAMM web app is now ready to deploy to Vercel!** 🚀
