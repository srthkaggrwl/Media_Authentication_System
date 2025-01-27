// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MediaAuthentication {
    struct Media {
        string cid; // Content Identifier (IPFS hash or centralized server identifier)
        string metadata; // Additional metadata (e.g., title, description)
        address uploader; // Address of the uploader
        uint256 timestamp; // Timestamp of upload
    }

    mapping(bytes32 => Media) public mediaRecords; // Mapping of hash to Media details
    bytes32[] public mediaHashes; // Array to store all media hashes

    event MediaUploaded(
        bytes32 hash,
        string cid,
        string metadata,
        address indexed uploader,
        uint256 timestamp
    );

    event MediaVerified(
        bytes32 hash,
        bool isAuthentic,
        address indexed verifier,
        uint256 timestamp
    );

    /**
     * @dev Uploads a new video and stores its hash and metadata on the blockchain.
     * @param _cid The CID of the video (IPFS hash or centralized server ID).
     * @param _metadata Metadata associated with the video (e.g., title, description).
     */
    function uploadMedia(string memory _cid, string memory _metadata) external {
        // Generate hash of the CID to store on-chain
        bytes32 mediaHash = keccak256(abi.encodePacked(_cid));

        // Ensure the media is not already uploaded
        require(mediaRecords[mediaHash].uploader == address(0), "Media already exists");

        // Store media details on-chain
        mediaRecords[mediaHash] = Media({
            cid: _cid,
            metadata: _metadata,
            uploader: msg.sender,
            timestamp: block.timestamp
        });

        // Add the media hash to the array
        mediaHashes.push(mediaHash);

        emit MediaUploaded(mediaHash, _cid, _metadata, msg.sender, block.timestamp);
    }

    /**
     * @dev Verifies the authenticity of a video by comparing its hash with stored records.
     * @param _cid The CID of the video to be verified.
     * @return isAuthentic True if the video is authentic, false otherwise.
     */
    function verifyMedia(string memory _cid) external view returns (bool isAuthentic) {
        // Generate hash of the CID
        bytes32 mediaHash = keccak256(abi.encodePacked(_cid));

        // Check if the hash exists in the mapping
        return mediaRecords[mediaHash].uploader != address(0);
    }

    /**
     * @dev Authenticate a video and emit an event for the verification attempt.
     * @param _cid The CID of the video to be verified.
     */
    function authenticateMedia(string memory _cid) external {
        bytes32 mediaHash = keccak256(abi.encodePacked(_cid));
        bool isAuthentic = mediaRecords[mediaHash].uploader != address(0);

        emit MediaVerified(mediaHash, isAuthentic, msg.sender, block.timestamp);
    }

    /**
     * @dev Fetches all media details uploaded to the blockchain.
     * @return hashes Array of all media hashes.
     * @return details Array of media details (CID, metadata, uploader, and timestamp).
     */
    function getAllMediaDetails()
        external
        view
        returns (
            bytes32[] memory hashes,
            Media[] memory details
        )
    {
        uint256 count = mediaHashes.length;
        Media[] memory allMedia = new Media[](count);

        for (uint256 i = 0; i < count; i++) {
            bytes32 hash = mediaHashes[i];
            allMedia[i] = mediaRecords[hash];
        }

        return (mediaHashes, allMedia);
    }
}
