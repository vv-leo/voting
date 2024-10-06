import voting from "./Create.json";

//HARDHAT LOCALHOST
// export const VotingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
/**
 * sepolia arbitrum合约和owner地址
 * 0xa8592EbFd31247BE545eA42c10BfF47288Cc17cf
 */
export const VotingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
export const CONTRACT_OWNER = voting.abi;

//POLYGON TEST
// export const VotingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const VotingAddressABI = voting.abi;

//CONTRACT OWNER
//HARDHAT
// export const CONTRACT_OWNER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

//REAL ADDRESS
// export const CONTRACT_OWNER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

//NETWORK
const networks = {
  polygon_amoy: {
    chainId: `0x${Number(80002).toString(16)}`,
    chainName: "Polygon Amoy",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-amoy.polygon.technology/"],
    blockExplorerUrls: ["https://www.oklink.com/amoy"],
  },
  arbitrum:{
    chainId: `0x${Number(421614).toString(16)}`,
    chainName: "Arbitrum",
    nativeCurrency: {
      name: "ARETH",
      symbol: "ARETH",
      decimals: 18,
    },
    rpcUrls: ["https://arbitrum-sepolia.blockpi.network/v1/rpc/public"],
  },
  polygon_mumbai: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Polygon Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/polygon"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ankr.com/bsc"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  base_mainnet: {
    chainId: `0x${Number(8453).toString(16)}`,
    chainName: "Base Mainnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.base.org/"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  base_sepolia: {
    chainId: `0x${Number(84532).toString(16)}`,
    chainName: "Base Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.base.org"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  localhost: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: "localhost",
    nativeCurrency: {
      name: "GO",
      symbol: "GO",
      decimals: 18,
    },
    rpcUrls: ["http://127.0.0.1:8545/"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
};

const changeNetwork = async ({ networkName }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...networks[networkName],
        },
      ],
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const handleNetworkSwitch = async () => {
  const networkName = "localhost";
  await changeNetwork({ networkName });
};
//END  OF NETWORK-------
