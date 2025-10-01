// Test setup file for Jest
// Mock common browser APIs and game dependencies

// Mock DOM methods
global.document = document;
global.window = window;

// Mock common game dependencies
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock game state for testing
global.mockGameState = {
  player: {
    cash: 1000,
    netWorth: 5000
  },
  resources: {
    hoes: 10,
    thugs: 5,
    crack: 100,
    weed: 50,
    beer: 200,
    condoms: 300
  },
  supplies: {
    thugHappiness: 80,
    hoeHappiness: 75
  },
  heat: {
    level: 25,
    corruption: 10
  }
};

// Mock common game functions
global.mockGameFunctions = {
  showNotification: jest.fn(),
  addConsoleMessage: jest.fn(),
  updateUI: jest.fn(),
  saveLocalGameState: jest.fn(),
  closeModal: jest.fn()
};
