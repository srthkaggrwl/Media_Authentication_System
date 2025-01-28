// app_upload.js
abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "cid",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "metadata",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "uploader",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "MediaUploaded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isAuthentic",
          "type": "bool"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "verifier",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "MediaVerified",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "mediaHashes",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "mediaRecords",
      "outputs": [
        {
          "internalType": "string",
          "name": "cid",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadata",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "uploader",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_cid",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_metadata",
          "type": "string"
        }
      ],
      "name": "uploadMedia",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_cid",
          "type": "string"
        }
      ],
      "name": "mediaExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_cid",
          "type": "string"
        }
      ],
      "name": "verifyMedia",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isAuthentic",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_cid",
          "type": "string"
        }
      ],
      "name": "authenticateMedia",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllMediaDetails",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "hashes",
          "type": "bytes32[]"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "cid",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "metadata",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "uploader",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct MediaAuthentication.Media[]",
          "name": "details",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
];
const contractAddress = '0xc752C6eFA44724682905b0C362614Ae8B0D42600'; // Replace with your contract address
let accounts = [];
let mediaAuthContract;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            accounts = await web3.eth.getAccounts();
            console.log('Connected accounts:', accounts);
        } catch (error) {
            console.error('User denied account access:', error.message);
        }
    } else {
        console.log('Non-Ethereum browser detected. Consider installing MetaMask!');
    }

    mediaAuthContract = new web3.eth.Contract(abi, contractAddress);
    console.log('Contract initialized:', mediaAuthContract);
});

async function getUserAccount() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            return accounts[0]; // Use the first account
        } else {
            throw new Error('No MetaMask accounts found.');
        }
    } catch (error) {
        console.error('Error getting user account:', error.message);
        alert('Failed to get user account. Please ensure MetaMask is connected.');
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const verifyButton = document.getElementById('verifyButton');
    const fileInput = document.getElementById('verifyFile');

    // Prevent default form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    verifyButton.addEventListener('click', async function (e) {
        e.preventDefault();

        if (!fileInput || fileInput.files.length === 0) {
            alert('Please select a file to verify.');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = async function () {
            const arrayBuffer = reader.result;

            // Convert ArrayBuffer to Uint8Array
            const uint8Array = new Uint8Array(arrayBuffer);

            // Generate the hash (CID) using keccak256
            const hexString = web3.utils.bytesToHex(uint8Array); // Convert Uint8Array to Hex
            const cid = web3.utils.keccak256(hexString); // Generate keccak256 hash

            console.log('Generated CID:', cid);

            try {

                // Get user account
                const userAccount = await getUserAccount();
                if (!userAccount) return;
                 // Estimate gas
                let gasEstimate;
                try {
                    gasEstimate = await mediaAuthContract.methods.authenticateMedia(cid).estimateGas({ from: userAccount });
                } catch (err) {
                    console.error('Gas estimation failed:', err.message);
                    gasEstimate = 3000000; // Default fallback gas
                }


                // Call the smart contract's verifyMedia function
                const txReceipt = await mediaAuthContract.methods.authenticateMedia(cid).send({
                    from: userAccount,
                    gas: gasEstimate,
                });
                // Parse the event from the transaction receipt
                const event = txReceipt.events.MediaVerified.returnValues;
                const isAuthentic = event[1]; // Event parameter for `isAuthentic`

                console.log('Media verification result:', isAuthentic);

                if (isAuthentic) {
                    alert('The uploaded file is authentic!');
                } else {
                    alert('The uploaded file is not authentic!');
                }
            } catch (err) {
                console.error('Error verifying media:', err.message);
                alert('Failed to verify media. Please check the console for details.');
            }
        };

        reader.readAsArrayBuffer(file);
    });
});
