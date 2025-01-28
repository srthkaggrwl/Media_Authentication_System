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
const contractAddress = '0xa455027FAc08262CE2679F326Cee82089d179b66'; 

// Global variables to store user accounts and contract instance
let accounts = [];
let mediaAuthContract;

// Initialize Web3 and connect to MetaMask
window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum); // Use MetaMask provider
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request user accounts
            accounts = await web3.eth.getAccounts(); // Get connected accounts
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
    const form = document.querySelector('form'); // Form element
    const uploadButton = document.getElementById('uploadButton'); // Upload button
    const fileInput = document.getElementById('mediaFile'); // File input field
    const resultContainer = document.getElementById('resultContainer'); // Container for displaying results

    // Prevent default form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    // Event listener for the upload button
    uploadButton.addEventListener('click', async function (e) {
        e.preventDefault();

        if (!fileInput || fileInput.files.length === 0) {
            alert('Please select a file to upload.');
            return;
        }

        const file = fileInput.files[0]; // Get the selected file
        const reader = new FileReader();

        reader.onload = async function () {
            const arrayBuffer = reader.result;
            const uint8Array = new Uint8Array(arrayBuffer); // Convert file to Uint8Array
            const hexString = web3.utils.bytesToHex(uint8Array); // Convert to hex
            const cid = web3.utils.keccak256(hexString); // Generate unique CID

            const userAccount = await getUserAccount(); // Get connected account
            if (!userAccount) return;

            const metadata = {
                fileName: file.name, // File name
                fileType: file.type, // File type
                uploadTime: new Date().toISOString(), // Upload timestamp
                uploadedBy: userAccount // Uploader's account address
            };

            try {
                // Check if media already exists
                const exists = await mediaAuthContract.methods.verifyMedia(cid).call();
                if (exists) {
                    alert('Media already exists!');
                    return;
                }

                // Estimate gas for transaction
                let gasEstimate;
                try {
                    gasEstimate = await mediaAuthContract.methods.uploadMedia(cid, JSON.stringify(metadata)).estimateGas({
                        from: userAccount,
                    });
                } catch (err) {
                    gasEstimate = 300000; // Default gas if estimation fails
                }

                // Upload media to the blockchain
                const receipt = await mediaAuthContract.methods.uploadMedia(cid, JSON.stringify(metadata)).send({
                    from: userAccount,
                    gas: gasEstimate,
                });

                console.log('Transaction receipt:', receipt);
                alert('Media uploaded successfully!');
                displayResult(cid, metadata); // Display upload result
            } catch (err) {
                console.error('Error uploading media:', err);
                alert(`Transaction failed: ${err.message}`);
            }
        };

        reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
    });


    // Function to display the upload result

    function displayResult(cid, metadata) {
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
                            <p><strong>Unique Content Identifier:</strong> ${cid}</p>
                            <p><strong>File Name:</strong> ${metadata.fileName}</p>
                            <p><strong>File Type:</strong> ${metadata.fileType}</p>
                            <p><strong>Uploaded By:</strong> ${metadata.uploadedBy}</p>
                            <p><strong>Upload Time:</strong> ${new Date(metadata.uploadTime).toLocaleString()}</p>
                        </td>
                        <td>
                            <canvas id="qrcodeCanvas"></canvas>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
        
        // Generate QR code for the CID

        const qrData = JSON.stringify({ cid, metadata });
        QRCode.toCanvas(document.getElementById('qrcodeCanvas'), qrData, { width: 150 }, function (error) {
            if (error) console.error('Error generating QR code:', error);
        });
    }
});
