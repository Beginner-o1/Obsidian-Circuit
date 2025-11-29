import React, { useState } from 'react';
import mime from 'mime';
import CryptoJS from 'crypto-js';
import '../styling/FileAnalysis.css';

function FileAnalysis({ setReportData }) {
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [error, setError] = useState('');
  const [isMetadataVisible, setMetadataVisible] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length) {
      handleFiles(droppedFiles);
    }
  };

  const handleMetadataVisibility = () => {
    setMetadataVisible((prev) => !prev);
  };

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    setFiles(fileArray);
    extractMetadata(fileArray);
  };

  const extractMetadata = (fileArray) => {
    const extractedMetadata = [];

    fileArray.forEach((file) => {
      const fileType = mime.getType(file.name);
      const reader = new FileReader();

      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        const md5Hash = CryptoJS.MD5(wordArray).toString();
        const sha1Hash = CryptoJS.SHA1(wordArray).toString();
        const sha256Hash = CryptoJS.SHA256(wordArray).toString();

        const fileMetadata = {
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          lastModified: new Date(file.lastModified).toLocaleDateString(),
          fileType: fileType,
          md5Hash: md5Hash,
          sha1Hash: sha1Hash,
          sha256Hash: sha256Hash,
        };

        extractedMetadata.push(fileMetadata);

        // Update metadata state and pass data to parent
        setMetadata((prevMetadata) => [...prevMetadata, fileMetadata]);
        setReportData((prev) => ({
          ...prev,
          fileAnalysisData: [...(prev.fileAnalysisData || []), fileMetadata],
        }));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const renderFileList = () => {
    return metadata.map((file, index) => (
      <div className="file-info" key={index}>
        <p><strong>Name:</strong> {file.name}</p>
        <p><strong>File Type:</strong> {file.fileType}</p>
      </div>
    ));
  };

  const handleFileUpload = async () => {
    if (!files.length) {
      setError('Please upload a file.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));

    try {
      const response = await fetch('http://localhost:5000/api/analyze-file', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setError('');
        setMetadata(data.metadata);
        setReportData((prev) => ({
          ...prev,
          fileAnalysisData: data.metadata,
        }));
      }
    } catch (err) {
      setError('Error uploading file.');
      console.error(err);
    }
  };

  return (
    <section id="file-analysis">
      <h2>File Analysis</h2>
      <div className="glass">
        <div
          className="drop-area"
          onClick={() => document.querySelector('#file-input').click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Drag and drop files here or click to upload</p>
          <input
            id="file-input"
            type="file"
            name="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
        <div id="file-list">
          {metadata.length > 0 ? renderFileList() : <p>No files selected.</p>}
        </div>
      </div>

      <button onClick={handleMetadataVisibility}>Upload and Extract Metadata</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isMetadataVisible && (
        <div id="metadata-result">
          <h3>File Metadata:</h3>
          <pre>{JSON.stringify(metadata, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}

export default FileAnalysis;
