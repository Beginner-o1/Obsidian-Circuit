import React, { useState } from 'react';
import '../styling/LogAnalysis.css'; // Optional: Add styling if needed

function LogAnalysis({ setReportData }) {
  const [logs, setLogs] = useState('');
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  // Handle changes in the textarea where logs are entered
  const handleLogsChange = (event) => {
    setLogs(event.target.value);
  };

  // Handle the analysis of logs
  const handleAnalyzeLogs = async () => {
    if (!logs.trim()) {
      setError('Please enter logs to analyze.');
      return;
    }

    const requestPayload = { logs: logs };

    try {
      // Process logs using backend logic directly in JS
      const result = analyzeLogs(requestPayload.logs);
      setError('');
      setAnalysisResult(result); // Set analysis result to state

      // Pass the result to the parent component using setReportData
      setReportData((prev) => ({
        ...prev,
        logAnalysisData: result,
      }));
    } catch (err) {
      setError('Error processing logs.');
      console.error(err);
    }
  };

  // Analyze the logs and classify them into safe or suspicious
  const analyzeLogs = (logs) => {
    const analysisResult = {
      safe_logs: [],
      suspicious_logs: [],
    };

    // Define log patterns
    const failedLoginPattern = /Failed login attempt from (\d+\.\d+\.\d+\.\d+)/;
    const successLoginPattern = /Successful login from (\d+\.\d+\.\d+\.\d+)/;
    const suspiciousActivityPattern = /Suspicious activity detected from (\d+\.\d+\.\d+\.\d+)/;

    // Split logs by lines and analyze each line
    const logLines = logs.split('\n');
    logLines.forEach((log) => {
      const failedMatch = log.match(failedLoginPattern);
      const successMatch = log.match(successLoginPattern);
      const suspiciousMatch = log.match(suspiciousActivityPattern);

      if (failedMatch || suspiciousMatch) {
        // If failed login or suspicious activity, classify as suspicious
        analysisResult.suspicious_logs.push(log);
      } else if (successMatch) {
        // Successful login is classified as safe
        analysisResult.safe_logs.push(log);
      }
    });

    return analysisResult;
  };

  // Render the analysis results
  const renderAnalysisResults = () => {
    if (!analysisResult) return null;

    return (
      <div id="log-analysis-results">
        <h3>Analysis Results:</h3>

        <h4>Safe Logs:</h4>
        <pre>{JSON.stringify(analysisResult.safe_logs, null, 2)}</pre>

        <h4>Suspicious Logs:</h4>
        <pre>{JSON.stringify(analysisResult.suspicious_logs, null, 2)}</pre>
      </div>
    );
  };

  return (
    <section id="log-analysis">
      <h2>Log Analysis</h2>
      <div className="glass">
        <textarea
          id="log-input"
          value={logs}
          onChange={handleLogsChange}
          placeholder="Paste logs here"
          rows="10"
          style={{ width: '100%', padding: '10px' }}
        />
      </div>

      <button onClick={handleAnalyzeLogs}>Analyze Logs</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {renderAnalysisResults()}
    </section>
  );
}

export default LogAnalysis;
