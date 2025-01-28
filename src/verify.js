// ABI (Application Binary Interface) for the smart contract
// Defines the contract's functions and events used in the script

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
          "indexed": false,
          "internalType": "string",
          "name": "metadata",
          "type": "string"
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

// Replace with the address of your deployed smart contract
const contractAddress = '0xa455027FAc08262CE2679F326Cee82089d179b66'; // Replace with your contract address

// Global variables to store user accounts and contract instance
let accounts = [];
let mediaAuthContract;

// Initialize Web3 and connect to MetaMask
window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum); // Use MetaMask provider
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });   // Request user accounts
            accounts = await web3.eth.getAccounts();  // Get connected accounts
            console.log('Connected accounts:', accounts);
        } catch (error) {
            console.error('User denied account access:', error.message);
        }
    } else {
        console.log('Non-Ethereum browser detected. Consider installing MetaMask!');
    }

    // Initialize the smart contract instance
    mediaAuthContract = new web3.eth.Contract(abi, contractAddress);
    console.log('Contract initialized:', mediaAuthContract);
});


// Function to get the connected MetaMask account
async function getUserAccount() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            return accounts[0]; // Return the first account
        } else {
            throw new Error('No MetaMask accounts found.');
        }
    } catch (error) {
        console.error('Error getting user account:', error.message);
        alert('Failed to get user account. Please ensure MetaMask is connected.');
        return null;
    }
}


// DOMContentLoaded event to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');  // Form element
    const verifyButton = document.getElementById('verifyButton');  // Verify button
    const fileInput = document.getElementById('verifyFile');  // File input field
    const resultContainer = document.getElementById('resultContainer'); // Container for displaying results

    // Prevent default form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    // Event listener for the verify button
    verifyButton.addEventListener('click', async function (e) {
        e.preventDefault();

        if (!fileInput || fileInput.files.length === 0) {
            alert('Please select a file to verify.');
            return;
        }

        const file = fileInput.files[0];  // Get the selected file
        const reader = new FileReader();

        reader.onload = async function () {
          
            const arrayBuffer = reader.result;

            // Convert file to Uint8Array
            const uint8Array = new Uint8Array(arrayBuffer);

            // Generate the hash (CID) using keccak256
            const hexString = web3.utils.bytesToHex(uint8Array); // Convert Uint8Array to Hex
            const cid = web3.utils.keccak256(hexString); // Generate keccak256 hash, cid

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
                const metadata = event[2]; // Event parameter for `metadata`

                console.log('Media verification result:', isAuthentic);

                // Display results
                displayResult(isAuthentic, cid, metadata);
            } catch (err) {
                console.error('Error verifying media:', err.message);
                alert('Failed to verify media. Please check the console for details.');
            }
        };

        reader.readAsArrayBuffer(file);
    });

    // Function to display the result
    function displayResult(isAuthentic, cid, metadata) {
        resultContainer.innerHTML = ''; // Clear previous results

        if (isAuthentic) {
            const parsedMetadata = JSON.parse(metadata);

            // Convert upload time to desired format
            const uploadTime = new Date(parsedMetadata.uploadTime).toLocaleString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            });

            resultContainer.innerHTML = `
            <table class="table table-bordered table-striped">
                <thead class="thead-dark">
                        <tr>
                            <th>Details</th>
                            <th>QR Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="word-wrap: break-word; max-width: 300px;">
                                <strong>Unique Content Identifier (CID):</strong> ${cid}</p>
                                <strong>File Name:</strong> ${parsedMetadata.fileName}</p>
                                <strong>File Type:</strong> ${parsedMetadata.fileType}</p>
                                <strong>Upload Time:</strong> ${uploadTime}</p>
                                <strong>Uploader Address:</strong> ${parsedMetadata.uploaderAddress || 'N/A'}</p>
                            </td>
                            <td>
                                <canvas id="qrcodeCanvas"></canvas>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;

            // Generate QR Code
            const qrData = JSON.stringify({ cid, ...parsedMetadata });
            QRCode.toCanvas(document.getElementById('qrcodeCanvas'), qrData, { width: 150 }, function (error) {
                if (error) console.error('Error generating QR code:', error);
            });

            alert('The uploaded file is authentic!');
        } else {
            resultContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    The uploaded file is not authentic.
                </div>
            `;
            alert('The uploaded file is not authentic!');
        }
    }
});
