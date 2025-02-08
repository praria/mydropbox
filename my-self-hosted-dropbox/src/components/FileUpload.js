import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from '@aws-amplify/auth';
import { uploadData, getUrl, list } from '@aws-amplify/storage';
import './FileUpload.css';
import awsmobile from '../aws-exports';

Amplify.configure(awsmobile);

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [fileUrls, setFileUrls] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [user_identity_id, setUserId] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { identityId } = await fetchAuthSession(); // Fetch the user's identity ID
                console.log("user's identity when fetched: ", identityId);
                if (!identityId) {
                    throw new Error("User is not authenticated.");
                }
                console.log("User ID:", identityId); // Log the userId
                setUserId(identityId); // Use identityId as the user identifier
                fetchFiles(identityId); // Fetch files for the user
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Failed to fetch user information.");
            }
        };

        fetchUser();
    }, []); // Empty dependency array ensures this runs only once

    const fetchFiles = async (user_identity_id) => {
        console.log('starting fetchfiles with ID: ', user_identity_id); // Debugging
        try {
            setError(null); // Reset any previous errors

            // Fetch the list of files in the user's folder
            const fileList = await list({
                path: ({identityId}) => `private/${user_identity_id}/`, 
                accessLevel: 'private',
            });
            
            // Debugging
            console.log('Fetched File list: ', fileList); 
            console.log('Uploaded file paths:', fileList.items.map(item => item.key));

    
            if (!fileList.items || fileList.items.length === 0) {
                console.warn(`No files found for user: ${user_identity_id}`);
                setFiles([]);
                setFileUrls({});
                return;
            }
            console.log("Complete file list fetched:", JSON.stringify(fileList, null, 2));
    
            setFiles(fileList.items);    
            const urls = {};
            for (const file of fileList.items) {
                if (file && file.key) {  // Ensure file key exists
                    try {
                        const url = await getUrl(file.key, { accessLevel: 'private' });
                        urls[file.key] = url;
                    } catch (error) {
                        console.error("Error fetching file URL:", error);
                        urls[file.key] = null;
                    }
                }
            }
            setFileUrls(urls);
        }   catch (err) {
            console.error("Detailed error:", err);
            setError("Failed to fetch files. Please try again later.");
        }
    };
      
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setError("No file selected.");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            // Add a unique identifier for versioning (timestamp)
            const timestamp = new Date().toISOString();
            const fileKey = `private/${user_identity_id}/${timestamp}_${selectedFile.name}`; // Include userId in the path
            
            console.log("File Key:", fileKey);
            const fileBuffer = await selectedFile.arrayBuffer();

            await uploadData({
                path: fileKey, 
                data: fileBuffer,
                options: {
                    contentType: selectedFile.type,
                    accessLevel: 'private'
                }
            });

            console.log("File uploaded successfully:", fileKey);

            // Update file list directly after upload
            const newFileEntry = {
            path: fileKey,
            lastModified: new Date().toISOString(),
            size: selectedFile.size,
            };

            // Fetch signed URL for immediate display
            const url = await getUrl({
            path: fileKey,
            options: {
                accessLevel: 'private',
            },
            });

            // Update state for new file list and URLs
            setFiles((prevFiles) => [...prevFiles, newFileEntry]);
            setFileUrls((prevUrls) => ({ ...prevUrls, [fileKey]: url }));

            // Clear the file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
            
            setSelectedFile(null);
            // Fetch files after successful upload
            await fetchFiles(user_identity_id);
            
        } catch (err) {
            console.error("Error uploading file:", err);
            setError("Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="file-upload">
            <h2>My Self Hosted Dropbox</h2>
            {error && <p className="error-message">{error}</p>}
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload File"}
            </button>
            <div className="files-list">
                <h3>My Documents:</h3>
                {files.length > 0 ? (
                    <ul> 
                        {files.map((file) => {
                            // Ensure the file and file.path are defined
                            if (!file || !file.path) {
                                console.warn("Skipping file due to missing path:", file);
                                return null;
                            }

                            const keyParts = file.path.split('/');
                            const fileNameWithTimestamp = keyParts[keyParts.length - 1];
                            const [timestamp, ...fileNameParts] = fileNameWithTimestamp.split('_');
                            const fileName = fileNameParts.join('_');
                            const uploadTime = new Date(timestamp).toLocaleString();

                            return (
                                <li key={file.path}>
                                    <a href={fileUrls[file.path]} target="_blank" rel="noopener noreferrer">
                                        {fileName}
                                    </a>
                                    <span>(Uploaded at: {uploadTime})</span>
                                </li>
                            );
                        })}
                    </ul>
                
                ) : (
                    <p>No files found in the bucket.</p>
                )}
            </div>
        </div>
    );
};

export default FileUpload;