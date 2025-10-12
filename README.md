# 🗽 PIMP.FUN Empire City

![Game Banner](v1/images/favicon.ico)

**A strategic web-based game where you build your criminal empire across the 5 boroughs of New York City. Manage resources, expand territory, and dominate the streets in this text-based strategy game.**

[![Tests](https://img.shields.io/badge/tests-154%20passing-brightgreen)]() [![Coverage](https://img.shields.io/badge/coverage-94%25-brightgreen)]() [![License](https://img.shields.io/badge/license-MIT-blue)]()

---

## 🚀 Quick Start

### Play Now
1. **Option 1**: Navigate to the `v1/` directory and double-click `start.bat` (Windows users)
2. **Option 2**: Open `v1/index.html` directly in your web browser  
3. **Option 3**: Use the development server:
   ```bash
   cd v1/
   npm install && npm start
   ```

### System Requirements
- **Browser**: Modern web browser (Chrome, Firefox, Edge, Safari)
- **JavaScript**: Must be enabled
- **Storage**: Local storage support for game saves
- **Network**: Internet connection for multiplayer features (optional for single-player)

## 📁 Repository Structure

```
pimpfun/
├── README.md              # This file - Repository overview and documentation
├── v1/                    # Main game application directory
│   ├── index.html         # Game entry point
│   ├── package.json       # Project configuration and dependencies
│   ├── start.bat          # Windows quick-start launcher
│   ├── simple-wallet.js   # Phantom wallet integration
│   ├── supabase-config.js # Database configuration
│   ├── store-systems.js   # Enhanced store system module
│   ├── src/               # Core game modules
│   │   ├── modules/
│   │   │   ├── StoreSystem.js      # Store logic and validation
│   │   │   └── GameStateManager.js # Game state management
│   │   └── utils/
│   │       └── GameUtils.js        # Utility functions
│   ├── tests/             # Comprehensive test suite (154 tests)
│   │   ├── setup.js              # Test configuration
│   │   ├── StoreSystem.test.js    # Store system tests
│   │   ├── GameStateManager.test.js # Game state tests
│   │   ├── SimpleWallet.test.js   # Wallet integration tests
│   │   ├── GameUtils.test.js      # Utility function tests
│   │   ├── GameConstants.test.js  # Constants validation tests
│   │   ├── CrackOperations.test.js # Game operations tests
│   │   └── SupabaseConfig.test.js # Database config tests
│   ├── docs/              # Game data and documentation
│   │   ├── api/           # API documentation
│   │   ├── DEVELOPER_GUIDE.md # Development documentation
│   │   ├── heat.JSON      # Heat system configuration
│   │   ├── ho_names.JSON  # Character name database
│   │   └── NPC_Hood_pimps.JSON # NPC configuration data
│   └── images/            # Game assets and graphics
└── .git/                  # Git version control
```

## 🎮 Game Features

### Core Gameplay
- **🗽 5 NYC Districts**: Explore Uptown, Midtown, Brooklyn, Harbor Docks, and Financial District
- **👥 168+ NPCs**: Battle against Street Pimps, District Bosses, and Kingpins across 3 difficulty tiers
- **🛒 4 Specialized Stores**: Corner Store, Pew Pew Jimmy's Gun Shop, Reggie's Plug, Tony's Chop Shop
- **💰 Complex Economy**: Dynamic cash management, net worth tracking, and daily profit systems
- **🚔 Heat Management**: Avoid police attention through bribes, charity work, and strategic play
- **⚔️ Strategic Combat**: Turn-based battles with loot rewards and tactical depth
- **🔄 Time-Based Mechanics**: Resource regeneration and daily business cycles

### Technical Features
- **📱 Cross-Platform**: Responsive design works on desktop, tablet, and mobile
- **💾 Dual Storage**: Local storage with optional cloud sync via Supabase
- **🔗 Blockchain Integration**: Optional Phantom wallet support for Web3 features
- **⚡ Real-Time Updates**: Live resource tracking and instant notifications
- **🎨 Modern Interface**: Clean, cyberpunk-inspired design with Tailwind CSS
- **🔒 Secure**: Input validation, state integrity checks, and secure wallet integration

## 🛠️ Development

### Prerequisites
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher
- **Git**: For version control

### Setup Instructions
```bash
# Clone the repository
git clone https://github.com/Pimp-Inc/pimpfun.git
cd pimpfun/v1

# Install dependencies
npm install

# Run the test suite
npm test

# Start development server
npm run dev
```

### Available Commands
| Command | Description |
|---------|-------------|
| `npm test` | Run the complete test suite (154 tests) |
| `npm run test:watch` | Run tests in watch mode for development |
| `npm run test:coverage` | Generate detailed coverage report |
| `npm run lint` | Check code style and quality |
| `npm run dev` | Start development server with live reload |
| `npm start` | Start production server |

## 🧪 Testing & Quality

The project maintains **94%+ test coverage** with a comprehensive suite of 154 unit tests.

### Test Suites
- **StoreSystem**: Store functionality, purchase validation, quantity management
- **GameStateManager**: Game state persistence, calculations, data migration  
- **SimpleWallet**: Wallet connection, authentication, transaction handling
- **GameUtils**: Utility functions, formatting, validation helpers
- **SupabaseConfig**: Database integration and configuration
- **GameConstants**: Game constants and configuration validation
- **CrackOperations**: Core game operation mechanics

### Running Tests
```bash
cd v1/

# Run all tests
npm test

# Development mode with auto-reload
npm run test:watch

# Generate detailed HTML coverage report
npm run test:coverage
open coverage/lcov-report/index.html
```

### Latest Test Results
```
Test Suites: 7 passed, 7 total
Tests:       154 passed, 154 total
Coverage:    94%+ across all core modules
```

## 🏗️ Architecture

This project uses a **modular architecture** for maintainability and scalability:

### Modular Design Benefits
- ✅ **Separated concerns** - Each module has a single responsibility
- ✅ **Comprehensive testing** - 94%+ test coverage on all core modules  
- ✅ **Easy maintenance** - Clear code organization and documentation
- ✅ **Extensible** - Simple to add new features and functionality

### Core Modules

**🛒 StoreSystem.js** - Manages all store interactions:
- Quantity selection and validation
- Purchase processing and cost calculation  
- Bulk discount computation
- Inventory management

**💾 GameStateManager.js** - Handles game state and persistence:
- State initialization and validation
- Net worth and statistics calculation
- Save/load functionality with migration support
- Turn regeneration and time-based mechanics

**🔧 GameUtils.js** - Provides utility functions:
- Currency and number formatting
- Mathematical calculations and validation
- Data manipulation helpers
- Common game functions

## 🎲 Game Systems

### 🛒 Store System
**Enhanced Shopping Experience** - All stores feature intuitive quantity selectors with bulk purchase options.

**Available Locations:**
- **Corner Store**: Essential supplies (beer, protection, medicine)
- **Pew Pew Jimmy's**: Weapons and security equipment  
- **Reggie's Plug**: Premium cannabis products
- **Tony's Chop Shop**: Vehicles and transportation

### 🚔 Heat Management
**Police Attention System** - Your actions generate heat that affects gameplay difficulty.

**Heat Reduction Options:**
- **Police Bribes**: Quick but expensive (percentage of net worth)
- **Charity Work**: Community service events with entertaining storylines
- **Special Items**: Rare NFT keys provide permanent heat reduction bonuses

### 💰 Resource Management
**Core Resources:**
- **💵 Cash**: Primary currency for all transactions
- **👥 Workforce**: Generates passive income and handles operations  
- **📦 Inventory**: Consumables, weapons, vehicles, and special items
- **🏢 Assets**: Properties and businesses that provide ongoing revenue

## 🚀 Deployment

### Production Ready
The application is fully prepared for deployment with:
- ✅ **Comprehensive testing** - 154 passing tests with 94%+ coverage
- ✅ **Performance optimization** - Fast loading and efficient resource usage
- ✅ **Cross-browser compatibility** - Works on all modern browsers
- ✅ **Mobile responsive** - Optimized for all screen sizes
- ✅ **Error handling** - Graceful degradation and user feedback

### Hosting Options
- **Static Hosting**: GitHub Pages, Netlify, Vercel, or any web server
- **CDN**: Cloudflare, AWS CloudFront for global distribution  
- **Custom Domain**: Full DNS configuration support

### Performance Metrics
- **Load Time**: < 2 seconds on standard broadband
- **Bundle Size**: Optimized for fast initial loading
- **Memory Usage**: Efficient resource management
- **Accessibility**: WCAG compliant interface design

## 🛡️ Security & Database

### Security Features
- **Input Validation**: All user inputs are sanitized and validated
- **State Integrity**: Game state validation prevents tampering
- **Wallet Security**: Secure Phantom wallet integration
- **Data Protection**: Encrypted storage for sensitive information

### Database Integration
- **Supabase**: Real-time multiplayer with cloud synchronization
- **Local Storage**: Offline play with automatic sync when online
- **Cross-Device**: Seamless game state sync across devices
- **Backup**: Automatic save state protection

## 📚 Documentation

### Main Documentation
- **[README.md](README.md)** - This file, repository overview
- **[v1/README.md](v1/README.md)** - Detailed game documentation
- **[v1/docs/DEVELOPER_GUIDE.md](v1/docs/DEVELOPER_GUIDE.md)** - Development guide
- **[v1/docs/api/README.md](v1/docs/api/README.md)** - API documentation

### Getting Started
1. Read this repository overview
2. Navigate to the [v1/README.md](v1/README.md) for detailed game information
3. Check [v1/docs/DEVELOPER_GUIDE.md](v1/docs/DEVELOPER_GUIDE.md) for development setup
4. Review [v1/docs/api/README.md](v1/docs/api/README.md) for API details

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Navigate** to the v1 directory (`cd v1/`)
4. **Add tests** for new functionality
5. **Ensure** all tests pass (`npm test`)
6. **Submit** a pull request

### Code Standards
- **Modern JavaScript** (ES6+)
- **Jest Testing** - All new code must include tests
- **ESLint** - Follow established code style
- **Documentation** - Comprehensive inline comments and JSDoc

### Repository Structure Guidelines
- All game code and functionality should be in the `v1/` directory
- Tests must maintain 94%+ coverage
- Documentation should be updated for any API changes
- Follow the existing modular architecture

## 📞 Support

### Bug Reports
Please [open an issue](https://github.com/Pimp-Inc/pimpfun/issues) with:
- Clear steps to reproduce the problem
- Browser and device information
- Console error messages (if any)
- Expected vs actual behavior

### Feature Requests
We love hearing your ideas! Submit feature requests through GitHub Issues with the "enhancement" label.

### Development Questions
For development-related questions, please review:
1. This README for repository overview
2. [v1/docs/DEVELOPER_GUIDE.md](v1/docs/DEVELOPER_GUIDE.md) for detailed development info
3. [v1/docs/api/README.md](v1/docs/api/README.md) for API documentation

## 📄 License

MIT License - See [LICENSE](LICENSE) file for full details.

---

## 🎯 Roadmap

### Upcoming Features
- [ ] **Advanced Crew Management** - Detailed character progression system
- [ ] **Enhanced Combat** - Tactical battle mechanics with special abilities
- [ ] **Territory Expansion** - Additional districts and locations to explore
- [ ] **Seasonal Events** - Time-limited challenges and rewards
- [ ] **Achievement System** - Unlockable goals and progression tracking

### Technical Improvements  
- [ ] **TypeScript Migration** - Enhanced type safety and developer experience
- [ ] **PWA Support** - Offline play and app-like installation
- [ ] **WebGL Graphics** - Enhanced visual effects and animations
- [ ] **Advanced Caching** - Improved performance and load times

---

## 🏆 Project Status

**✅ Production Ready** - This repository contains a fully functional, well-tested game with:
- **154 passing tests** with 94%+ coverage
- **Modular architecture** with separated concerns
- **Comprehensive documentation** at multiple levels
- **Modern development workflow** with automated testing
- **Professional code quality** ready for production deployment

---

**🗽 Welcome to Empire City - Build Your Criminal Empire!**

*Ready for production deployment with comprehensive testing and professional code quality.*

## 🚀 Getting Started

**New to the project?** Start here:
1. 📖 Read this README for repository overview
2. 🎮 Try the game: `cd v1/ && npm install && npm start`
3. 🧪 Run tests: `cd v1/ && npm test`
4. 📚 Read detailed docs: [v1/README.md](v1/README.md)
5. 🛠️ Development guide: [v1/docs/DEVELOPER_GUIDE.md](v1/docs/DEVELOPER_GUIDE.md)
