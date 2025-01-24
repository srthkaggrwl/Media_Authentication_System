module.exports = {
  networks: {
    // Local development network using Ganache
    ganache: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Ganache CLI default port
      network_id: "5777",    // Ganache network id
      gas: 8000000,          // Gas limit - ensure it is sufficient
      gasPrice: 20000000000  // 20 gwei (in wei)
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.21",    // Solidity compiler version
      optimizer: {
        enabled: true,      // Enable optimizer
        runs: 200           // Optimize for how many times you intend to run the code
      },
      evmVersion: "istanbul" // EVM version to compile for
    }
  },

  mocha: {
    // timeout: 100000
  }
};
