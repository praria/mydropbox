import React, { useState, useEffect } from 'react';
import { Amplify} from 'aws-amplify';
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

    const fetchFiles = async () => {
        try {
            setError(null);
            // List files with maxKeys parameter
            const fileList = await list('', {
                pageSize: 100, // this number can be adjusted as needed
                accessLevel: 'public'
            });

            console.log('File list response:', fileList); // For debugging

            if (!fileList.items || fileList.items.length === 0) {
                setFiles([]);
                setFileUrls({});
                return;
            }

            setFiles(fileList.items);

            const urls = {};
            for (const file of fileList.items) {
                try {
                    const urlResult = await getUrl({
                        key: file.key,
                        options: {
                            accessLevel: 'public',
                            validateObjectExistence: true
                        }
                    });
                    urls[file.key] = urlResult.url;
                } catch (urlError) {
                    console.error(`Error getting URL for ${file.key}:`, urlError);
                }
            }
            setFileUrls(urls);
        } catch (err) {
            console.error("Error fetching files:", err);
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
            // Add a unique identifier for versioning (e.g., timestamp)
            const timestamp = new Date().toISOString();
            const fileKey = `${timestamp}_${selectedFile.name}`;
            const fileBuffer = await selectedFile.arrayBuffer();

            await uploadData({
                key: fileKey,
                data: fileBuffer,
                options: {
                    contentType: selectedFile.type,
                    accessLevel: 'public'
                }
            });

            // Clear the file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
            
            setSelectedFile(null);
            // Fetch files after successful upload
            await fetchFiles();
        } catch (err) {
            console.error("Error uploading file:", err);
            setError("Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div className="file-upload">
            <h2>File Upload</h2>
            {error && <p className="error-message">{error}</p>}
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload File"}
            </button>
            <div className="files-list">
                <h3>Uploaded Files:</h3>
                {files.length > 0 ? (
                    <ul>
                        {files.map((file) => {
                            const [timestamp, ...fileNameParts] = file.key.split('_');
                            const fileName = fileNameParts.join('_'); // Rejoin file name parts
                            const uploadTime = new Date(timestamp).toLocaleString(); // Format timestamp for display
                    
                            return (
                                <li key={file.key}>
                                    <a 
                                        href={fileUrls[file.key]} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
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
