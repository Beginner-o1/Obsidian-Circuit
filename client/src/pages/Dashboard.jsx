import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogAnalysis from './LogAnalysis'; // Import the LogAnalysis component
import NetworkAnalysis from './NetworkAnalysis'; // Import the NetworkAnalysis component
import FileAnalysis from './FileAnalysis'; // Import the FileAnalysis component
import generatePDF from './GeneratePdf'; // Import the PDF generation function
import '../styling/Dashboard.css';

function App() {
  const [reportData, setReportData] = useState({
    logAnalysisData: null,
    fileAnalysisData: null,
    networkAnalysisData: null,
  });

  const handleGenerateReport = async () => {
    if (
      !reportData.logAnalysisData &&
      !reportData.fileAnalysisData &&
      !reportData.networkAnalysisData
    ) {
      alert('Please complete at least one analysis before generating the report.');
      return;
    }

    try {
      // Generate the PDF report by passing the available data
      await generatePDF(reportData);
      alert('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating the report.');
    }
  };

  return (
    <div className="App">
      <header>
        <div className="container">
          <h1>Obsidian Circuit</h1>
          <nav>
            <ul>
              <li><a href="#dashboard">Dashboard</a></li>
              <li><a href="#file-analysis">File Analysis</a></li>
              <li><a href="#network-analysis">Network Analysis</a></li>
              <li><a href="#log-analysis">Log Analysis</a></li>
              <li><a href="#reports">Reports</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          <section id="dashboard">
            <h2>Dashboard</h2>
            <div className="grid">
              <div className="card">
                <Link to="/History">
                  <h3>History</h3>
                </Link>
              </div>
              <div className="card">
                <h3>Threat Intelligence</h3>
                <div id="threat-intelligence-news"></div>
              </div>
              <div className="card">
                <h3>System Status</h3>
                <p>All systems operational.</p>
              </div>
            </div>
          </section>

          {/* File Analysis Section */}
          <FileAnalysis setReportData={setReportData} />

          <section id="network-analysis">
            <NetworkAnalysis setReportData={setReportData} />
          </section>

          <LogAnalysis setReportData={setReportData} />

          <section id="reports">
            <h2>Reports</h2>
            {/* Buttons to generate or upload the report */}
            <div className="button-container">
              <button onClick={handleGenerateReport}>Generate Report</button>
              <Link to="/form">
              <button >Upload Report</button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>&copy; Obsidian Circuit</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
