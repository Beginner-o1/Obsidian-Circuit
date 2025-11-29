import React, { useState } from 'react';
import '../styling/NetwrokAnalysis.css'; // Import the corresponding CSS file

function NetworkAnalysis() {
  const [files, setFiles] = useState([]);
  const [networkLogs, setNetworkLogs] = useState('');
  const [suspiciousActivity, setSuspiciousActivity] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleFileUpload = async () => {
    if (!files.length) {
      setError('Please upload a PCAP file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await fetch('http://localhost:1000/api/analyze-network', {  // Use the backend API URL
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setError('');
        setNetworkLogs(data.networkLogs);
        setSuspiciousActivity(data.suspiciousActivity);
      }
    } catch (err) {
      setError('Error uploading file: ' + err.message);
      console.error(err);
    }
  };

  return (
    <section id="network-analysis" className="glass">
      <h2>Network Analysis</h2>
      <div className="drop-area">
        <input
          type="file"
          accept=".pcap,.pcapng"
          onChange={handleFileChange}
          id="network-file-input"
        />
        <label htmlFor="network-file-input">
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Drag and drop a PCAP file or click to browse</p>
        </label>
      </div>
      <button onClick={handleFileUpload}>Upload and Analyze</button>

      {error && <p className="error-message">{error}</p>}

      <div id="network-logs" className="glass">
        {networkLogs ? (
          <pre>{JSON.stringify(networkLogs, null, 2)}</pre>
        ) : (
          <p>No results yet. Upload a file to analyze.</p>
        )}
      </div>

      <div id="suspicious-activity" className="glass">
        {suspiciousActivity.length > 0 ? (
          <ul>
            {suspiciousActivity.map((item, index) => (
              <li key={index}>
                <strong>{item.type}</strong>: {item.details}
              </li>
            ))}
          </ul>
        ) : (
          <p>No suspicious activity detected.</p>
        )}
      </div>
    </section>
  );
}

export default NetworkAnalysis;
