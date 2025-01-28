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
const contractAddress = '0x1f57AfdBD1148ED1D0a280C672216C7AF8Cb9eF7'; // Replace with your contract address
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
            console.error("User denied account access:", error.message);
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
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('mediaFile');
    const resultContainer = document.getElementById('resultContainer');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    uploadButton.addEventListener('click', async function (e) {
        e.preventDefault();

        if (!fileInput || fileInput.files.length === 0) {
            alert('Please select a file to upload.');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = async function () {
            const arrayBuffer = reader.result;
            const uint8Array = new Uint8Array(arrayBuffer);
            const hexString = web3.utils.bytesToHex(uint8Array);
            const cid = web3.utils.keccak256(hexString);

            const userAccount = await getUserAccount();
            if (!userAccount) return;

            const metadata = {
                fileName: file.name,
                fileType: file.type,
                uploadTime: new Date().toISOString(),
                uploadedBy: userAccount,
            };

            try {
                const exists = await mediaAuthContract.methods.verifyMedia(cid).call();
                if (exists) {
                    alert('Media already exists!');
                    return;
                }

                let gasEstimate;
                try {
                    gasEstimate = await mediaAuthContract.methods.uploadMedia(cid, JSON.stringify(metadata)).estimateGas({
                        from: userAccount,
                    });
                } catch (err) {
                    gasEstimate = 300000; // Default fallback gas
                }

                const receipt = await mediaAuthContract.methods.uploadMedia(cid, JSON.stringify(metadata)).send({
                    from: userAccount,
                    gas: gasEstimate,
                });

                console.log('Transaction receipt:', receipt);
                alert('Media uploaded successfully!');
                displayResult(cid, metadata);
            } catch (err) {
                console.error('Error uploading media:', err);
                alert(`Transaction failed: ${err.message}`);
            }
        };

        reader.readAsArrayBuffer(file);
    });

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

        const qrData = JSON.stringify({ cid, metadata });
        QRCode.toCanvas(document.getElementById('qrcodeCanvas'), qrData, { width: 150 }, function (error) {
            if (error) console.error('Error generating QR code:', error);
        });
    }
});

// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.querySelector('form');
//     const uploadButton = document.getElementById('uploadButton');
//     const fileInput = document.getElementById('mediaFile');

//     // Prevent default form submission
//     form.addEventListener('submit', function (e) {
//         e.preventDefault();
//     });

//     uploadButton.addEventListener('click', async function (e) {
//         e.preventDefault();

//         if (!fileInput || fileInput.files.length === 0) {
//             alert('Please select a file to upload.');
//             return;
//         }

//         const file = fileInput.files[0];
//         const reader = new FileReader();

//         reader.onload = async function () {
//             const arrayBuffer = reader.result;

//             // Convert ArrayBuffer to Uint8Array
//             const uint8Array = new Uint8Array(arrayBuffer);

//             // Generate the hash (CID) using keccak256
//             const hexString = web3.utils.bytesToHex(uint8Array); // Convert Uint8Array to Hex
//             const cid = web3.utils.keccak256(hexString); // Generate keccak256 hash

//             // Prepare metadata
//             const metadata = JSON.stringify({
//                 fileName: file.name,
//                 fileType: file.type,
//                 uploadTime: new Date().toISOString(),
//             });
            

//             console.log('CID:', cid);
//             console.log('Metadata:', metadata);

//             try {
//                 // Get user account
//                 const userAccount = await getUserAccount();
//                 if (!userAccount) return;

//                 // Estimate gas
//                 let gasEstimate;
//                 try {
//                     gasEstimate = await mediaAuthContract.methods.uploadMedia(cid, metadata).estimateGas({ from: userAccount });
//                 } catch (err) {
//                     console.error('Gas estimation failed:', err.message);
//                     gasEstimate = 3000000; // Default fallback gas
//                 }

//                 // Send the transaction to the blockchain
//                 const receipt = await mediaAuthContract.methods.uploadMedia(cid, metadata).send({
//                     from: userAccount,
//                     gas: gasEstimate,
//                 });

//                 console.log('Transaction receipt:', receipt);
//                 alert('Media uploaded successfully!');
//                 // alert('CID:', cid);
//                 //saveToArtifacts(file, cid, metadata);
//             } catch (err) {
//                 console.error('Error uploading media:', err.message);
//                 alert('Failed to upload media. Please check the console for details.');
//             }
//         };

//         reader.readAsArrayBuffer(file);
//     });
// });

// // Function to save the file and metadata locally in the artifacts folder (for Node.js environment only)
// function saveToArtifacts(file, cid, metadata) {
//     const fs = require('fs');
//     const path = require('path');

//     const artifactsFolder = path.join(__dirname, 'artifacts');
//     if (!fs.existsSync(artifactsFolder)) {
//         fs.mkdirSync(artifactsFolder);
//     }

//     const filePath = path.join(artifactsFolder, `${cid}_${file.name}`);
//     const metadataPath = path.join(artifactsFolder, `${cid}_metadata.json`);

//     // Save the file
//     fs.writeFileSync(filePath, Buffer.from(new Uint8Array(file)));

//     // Save the metadata
//     fs.writeFileSync(metadataPath, metadata);

//     console.log('File and metadata saved to artifacts folder');
// }



// const contractAddress = '0x92A479ad6A3518687c80C370b2F14711b7df28Bb'; // Replace with your contract address
// let accounts = [];
// let mediaAuthContract;

// window.addEventListener('load', async () => {
//     if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//         try {
//             await window.ethereum.request({ method: 'eth_requestAccounts' });
//             accounts = await web3.eth.getAccounts();
//             console.log('Connected accounts:', accounts);
//         } catch (error) {
//             console.error("User denied account access:", error.message);
//         }
//     } else {
//         console.log('Non-Ethereum browser detected. Consider installing MetaMask!');
//     }

//     mediaAuthContract = new web3.eth.Contract(abi, contractAddress);
//     console.log('Contract initialized:', mediaAuthContract);
// });

// async function getUserAccount() {
//     try {
//         const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
//         if (accounts.length > 0) {
//             return accounts[0]; // Use the first account
//         } else {
//             throw new Error('No MetaMask accounts found.');
//         }
//     } catch (error) {
//         console.error('Error getting user account:', error.message);
//         alert('Failed to get user account. Please ensure MetaMask is connected.');
//         return null;
//     }
// }

// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.querySelector('form');
//     const uploadButton = document.getElementById('uploadButton');
//     const fileInput = document.getElementById('mediaFile');

//     // Prevent default form submission
//     form.addEventListener('submit', function (e) {
//         e.preventDefault();
//     });

//     uploadButton.addEventListener('click', async function (e) {
//         e.preventDefault();

//         if (!fileInput || fileInput.files.length === 0) {
//             alert('Please select a file to upload.');
//             return;
//         }

//         const file = fileInput.files[0];
//         const reader = new FileReader();

//         reader.onload = async function () {
//             const arrayBuffer = reader.result;

//             // Convert ArrayBuffer to Uint8Array
//             const uint8Array = new Uint8Array(arrayBuffer);

//             // Generate the hash (CID) using keccak256
//             const hexString = web3.utils.bytesToHex(uint8Array); // Convert Uint8Array to Hex
//             const cid = web3.utils.keccak256(hexString); // Generate keccak256 hash

//             // Prepare metadata
//             const metadata = JSON.stringify({
//                 fileName: file.name,
//                 fileType: file.type,
//                 uploadTime: new Date().toISOString(),
//             });

//             console.log('CID:', cid);
//             console.log('Metadata:', metadata);

//             try {
//                 // Get user account
//                 const userAccount = await getUserAccount();
//                 if (!userAccount) return;

//                 // Estimate gas
//                 let gasEstimate;
//                 try {
//                     gasEstimate = await mediaAuthContract.methods.uploadMedia(cid, metadata).estimateGas({ from: userAccount });
//                 } catch (err) {
//                     console.error('Gas estimation failed:', err.message);
//                     gasEstimate = 3000000; // Default fallback gas
//                 }

//                 // Send the transaction to the blockchain
//                 const receipt = await mediaAuthContract.methods.uploadMedia(cid, metadata).send({
//                     from: userAccount,
//                     gas: gasEstimate,
//                 });

//                 console.log('Transaction receipt:', receipt);
//                 alert('Media uploaded successfully!');

//                 // Call saveToArtifacts only if running in Node.js environment
//                 if (typeof require !== 'undefined') {
//                     saveToArtifacts(file, cid, metadata);
//                 } else {
//                     console.log('Skipping local save as this is not a Node.js environment.');
//                 }
//             } catch (err) {
//                 console.error('Error uploading media:', err.message);
//                 alert('Failed to upload media. Please check the console for details.');
//             }
//         };

//         reader.readAsArrayBuffer(file);
//     });
// });

// // Function to save the file and metadata locally in the artifacts folder (for Node.js environment only)
// function saveToArtifacts(file, cid, metadata) {
//     try {
//         const fs = require('fs');
//         const path = require('path');

//         const artifactsFolder = path.join(__dirname, 'artifacts');
//         if (!fs.existsSync(artifactsFolder)) {
//             fs.mkdirSync(artifactsFolder);
//         }

//         const filePath = path.join(artifactsFolder, `${cid}_${file.name}`);
//         const metadataPath = path.join(artifactsFolder, `${cid}_metadata.json`);

//         // Save the file
//         fs.writeFileSync(filePath, Buffer.from(new Uint8Array(file)));

//         // Save the metadata
//         fs.writeFileSync(metadataPath, metadata);

//         console.log('File and metadata saved to artifacts folder');
//     } catch (err) {
//         console.error('Error saving to artifacts folder:', err.message);
//     }
// }
