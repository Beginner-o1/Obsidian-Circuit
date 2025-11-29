'use client';

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractABI, contractAdd } from '../contracts/contract';
import '../styling/History.css';

const HistoryPage = ({ isOpen = false, onClose = () => {} }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  isOpen = true;

  useEffect(() => {
    if (isOpen) {
      fetchUploadedFiles();
    }
  }, [isOpen]);

  const fetchUploadedFiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install it to proceed.");
        return;
      }

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAdd);

      const fileDetails = [];
      const maxFiles = await contract.methods.getFileNo().call();

      for (let fileNo = 1; fileNo <= maxFiles; fileNo++) {
        try {
          const file = await contract.methods.getFileInfo(fileNo).call();
          fileDetails.push({
            id: fileNo,
            fileName: file.fileName,
            fileType: file.fileType,
            description: file.description,
            timestamp: file.timeStamp,
            fileHash: file.fileHash,
          });
          
        } catch (err) {
          if (err.message.includes("File not found")) break;
          throw err;
        }
      }
      setFiles(fileDetails);
      console.log(fileDetails);
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch files: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const Button = ({ onClick, children }) => (
    <button className="btn" onClick={onClick}>
      {children}
    </button>
  );

  return (
    <div className="history-container">
      <h2>History</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="file-list">
          {files.length === 0 ? (
            <p>No history available</p>
          ) : (
            <ul>
              {files.map((file) => (
                <li key={file.id} className="file-card">
                  <h3>{file.fileName}</h3>
                  <p><strong>Type:</strong> {file.fileType}</p>
                  <p><strong>Description:</strong> {file.description}</p>
                  <p><strong>Uploaded on:</strong> {new Date(Number(file.timestamp) * 1000).toLocaleString()}</p>
                  <button onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/ipfs/${file.fileHash}`)}>
                      View File
                    </button>

                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <Button onClick={onClose}>Close</Button>
    </div>
  );
};

export default HistoryPage;
