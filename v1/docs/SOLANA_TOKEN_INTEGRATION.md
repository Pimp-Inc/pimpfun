# Solana Token Ownership Check Documentation

This documentation covers the new Solana Token Ownership Check feature that allows you to verify whether a connected wallet owns specific SPL tokens (both legacy Token Program and Token-2022).

## Overview

The feature includes:
- **SolanaTokenChecker**: Core module for checking token ownership
- **SolanaTokenAPI**: API-style wrapper with validation and error handling
- **Browser compatibility**: Works with CDN-loaded Solana libraries
- **Caching**: Built-in mint info caching for performance
- **Auto-detection**: Automatic detection of Token Program vs Token-2022

## Installation

### Dependencies

Add the required Solana libraries to your HTML:

```html
<!-- Solana libraries for token checking -->
<script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"></script>
<script src="https://unpkg.com/@solana/spl-token@latest/lib/index.iife.min.js"></script>
<script src="solana-token-checker.js"></script>
<script src="solana-token-api.js"></script>
```

Or install via npm for Node.js projects:

```bash
npm install @solana/web3.js @solana/spl-token
```

## Basic Usage

### Quick Token Check

```javascript
// Check if wallet owns a specific token
const hasToken = await SolanaTokenAPIHelpers.hasToken(
  'walletAddress', 
  'mintAddress',
  'https://api.mainnet-beta.solana.com' // optional RPC URL
);

if (hasToken) {
  console.log('User has access!');
  // Grant access to gated content
} else {
  console.log('User does not own required token');
  // Deny access
}
```

### Get Token Balance

```javascript
// Get the exact token balance
const balance = await SolanaTokenAPIHelpers.getTokenBalance(
  'walletAddress',
  'mintAddress'
);

console.log(`User has ${balance} tokens`);
```

### Minimum Token Requirements

```javascript
// Check if user has at least 100 tokens
const hasMinimum = await SolanaTokenAPIHelpers.hasMinimumTokens(
  'walletAddress',
  'mintAddress',
  100 // minimum amount
);
```

## API Usage

### Initialize API

```javascript
// Initialize with default mainnet RPC
const tokenAPI = new SolanaTokenAPI();

// Or with custom RPC
const tokenAPI = new SolanaTokenAPI('https://api.devnet.solana.com');

// Or set network after initialization
tokenAPI.setNetwork('devnet'); // 'mainnet', 'devnet', 'testnet', or custom URL
```

### Check Token Ownership

```javascript
// Basic token check
const response = await tokenAPI.checkSolanaToken({
  walletAddress: 'user_wallet_address',
  mintAddress: 'token_mint_address',
  useToken2022: false // optional, default false
});

if (response.success && response.hasAccount && response.uiAmount > 0) {
  console.log('User owns tokens:', response.uiAmount);
  console.log('Decimals:', response.decimals);
  console.log('Program type:', response.programType);
} else {
  console.log('User does not own tokens');
}
```

### Auto-detect Token Program

```javascript
// Automatically detect if token uses Token-2022 or legacy Token program
const response = await tokenAPI.checkSolanaTokenAuto({
  walletAddress: 'user_wallet_address',
  mintAddress: 'token_mint_address'
});

console.log('Program type:', response.programType); // 'Token' or 'Token-2022'
```

### Check Multiple Tokens

```javascript
const response = await tokenAPI.checkMultipleSolanaTokens({
  walletAddress: 'user_wallet_address',
  tokens: [
    { mintAddress: 'token1_mint_address', useToken2022: false },
    { mintAddress: 'token2_mint_address', useToken2022: true },
    { mintAddress: 'token3_mint_address' } // auto-detect program
  ]
});

response.tokens.forEach((token, index) => {
  console.log(`Token ${index + 1}: ${token.hasAccount ? token.uiAmount : 0} tokens`);
});
```

## Advanced Usage

### Using SolanaTokenChecker Directly

```javascript
// Initialize checker
const checker = new SolanaTokenChecker('https://api.mainnet-beta.solana.com');

// Check token balance
const result = await checker.checkTokenBalance(
  'walletAddress',
  'mintAddress',
  false // useToken2022
);

// Auto-detect program and check
const autoResult = await checker.checkTokenBalanceAuto(
  'walletAddress',
  'mintAddress'
);

// Detect token program
const isToken2022 = await checker.detectTokenProgram('mintAddress');
```

### Error Handling

```javascript
const response = await tokenAPI.checkSolanaToken({
  walletAddress: 'user_wallet_address',
  mintAddress: 'token_mint_address'
});

if (!response.success) {
  console.error('API Error:', response.error);
  switch (response.statusCode) {
    case 400:
      console.log('Invalid request parameters');
      break;
    case 500:
      console.log('Server/RPC error');
      break;
  }
  return;
}

if (response.warning) {
  console.warn('Warning:', response.warning);
}

// Use response data
if (response.hasAccount) {
  console.log('Token balance:', response.uiAmount);
}
```

### Cache Management

```javascript
// Get cache statistics
const health = tokenAPI.getHealth();
console.log('Cache stats:', health.cache);

// Clear cache if needed
tokenAPI.clearCache();
```

## Integration Examples

### Wallet Integration

```javascript
// Using with SimpleWallet (included in this project)
const wallet = new SimpleWallet();

async function checkUserAccess() {
  // Connect wallet
  const connection = await wallet.connectPhantom();
  
  if (!connection.success) {
    console.log('Wallet connection failed');
    return false;
  }

  // Check if user owns required token
  const tokenCheck = await SolanaTokenAPIHelpers.hasToken(
    wallet.getPublicKey(),
    'your_token_mint_address'
  );

  return tokenCheck;
}

// Usage
checkUserAccess().then(hasAccess => {
  if (hasAccess) {
    // Enable premium features
    enablePremiumFeatures();
  } else {
    // Show token purchase options
    showTokenPurchaseModal();
  }
});
```

### Access Gating

```javascript
// Gate access to specific content/features
async function gateContentAccess(requiredTokenMint, minimumAmount = 1) {
  const wallet = new SimpleWallet();
  
  if (!wallet.isConnected()) {
    throw new Error('Wallet not connected');
  }

  const balance = await SolanaTokenAPIHelpers.getTokenBalance(
    wallet.getPublicKey(),
    requiredTokenMint
  );

  const hasAccess = balance >= minimumAmount;
  
  return {
    hasAccess,
    currentBalance: balance,
    requiredAmount: minimumAmount
  };
}
```

### Multi-Token Tier System

```javascript
// Example: Different access tiers based on token ownership
const ACCESS_TIERS = {
  BRONZE: { mint: 'bronze_token_mint', required: 1 },
  SILVER: { mint: 'silver_token_mint', required: 1 },
  GOLD: { mint: 'gold_token_mint', required: 1 }
};

async function getUserAccessTier(walletAddress) {
  const tokens = Object.entries(ACCESS_TIERS).map(([tier, config]) => ({
    tier,
    mintAddress: config.mint,
    required: config.required
  }));

  const tokenAPI = new SolanaTokenAPI();
  const response = await tokenAPI.checkMultipleSolanaTokens({
    walletAddress,
    tokens: tokens.map(t => ({ mintAddress: t.mintAddress }))
  });

  // Find highest tier user has access to
  for (const [index, token] of response.tokens.entries()) {
    const tierInfo = tokens[index];
    if (token.hasAccount && token.uiAmount >= tierInfo.required) {
      return tierInfo.tier;
    }
  }

  return 'FREE'; // Default tier
}
```

## Response Formats

### Success Response

```javascript
{
  success: true,
  hasAccount: true,
  uiAmount: 1.5,
  rawAmount: "1500000",
  decimals: 6,
  programType: "Token",
  ata: "associated_token_account_address",
  statusCode: 200
}
```

### No Token Account Response

```javascript
{
  success: true,
  hasAccount: false,
  uiAmount: 0,
  rawAmount: "0",
  decimals: 6,
  programType: "Token",
  ata: "would_be_ata_address",
  statusCode: 200
}
```

### Error Response

```javascript
{
  success: false,
  error: "walletAddress is required",
  statusCode: 400
}
```

## Best Practices

### 1. Error Handling
Always check the `success` field and handle errors appropriately:

```javascript
const response = await tokenAPI.checkSolanaToken(requestData);
if (!response.success) {
  // Handle error
  return;
}
// Process successful response
```

### 2. RPC Selection
Use reliable RPC providers for production:

```javascript
// Good RPC providers
const rpcUrls = {
  helius: 'https://mainnet.helius-rpc.com/?api-key=YOUR_KEY',
  quicknode: 'https://your-endpoint.quiknode.pro/YOUR_KEY/',
  alchemy: 'https://solana-mainnet.g.alchemy.com/v2/YOUR_KEY'
};
```

### 3. Cache Management
Monitor cache usage and clear when needed:

```javascript
const health = tokenAPI.getHealth();
if (health.cache.expiredEntries > 100) {
  tokenAPI.clearCache();
}
```

### 4. Network Configuration
Use appropriate networks for testing:

```javascript
// Development
tokenAPI.setNetwork('devnet');

// Production
tokenAPI.setNetwork('mainnet');
```

### 5. User Experience
Provide clear feedback to users:

```javascript
async function checkAccess() {
  try {
    showLoading('Checking token ownership...');
    
    const hasAccess = await SolanaTokenAPIHelpers.hasToken(
      walletAddress,
      tokenMint
    );
    
    hideLoading();
    
    if (hasAccess) {
      showSuccess('Access granted!');
    } else {
      showInfo('You need to own the required token for access.');
    }
  } catch (error) {
    hideLoading();
    showError('Failed to check token ownership. Please try again.');
  }
}
```

## Testing

The module includes comprehensive tests covering:
- Token balance checking for both Token programs
- Error handling for invalid addresses
- Cache functionality
- API endpoint validation
- Integration scenarios

Run tests with:
```bash
npm test -- --testPathPattern=SolanaTokenChecker
```

## Security Considerations

1. **Client-side only**: This implementation is client-side only. For server-side gating, implement server-side validation.

2. **RPC trust**: Results depend on the RPC provider. Use trusted, reliable providers.

3. **Wallet verification**: Always verify wallet ownership through wallet signatures when implementing access control.

4. **Rate limiting**: Be mindful of RPC rate limits when checking multiple tokens.

## Future Enhancements

- Integration with Metaplex Metadata for token name/symbol display
- UI components for token balance display
- Multiple token support with batch requests
- WebSocket subscriptions for real-time balance updates
- Integration with popular wallet adapters