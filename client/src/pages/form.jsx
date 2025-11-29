import React, { useState } from "react";
import Web3 from "web3";
import axios from "axios";
import '../styling/form.css';
import { contractABI, contractAdd } from "../contracts/contract";

const Form = () => {
  const [formData, setFormData] = useState({
    file: null,
    fileHash: "",
    fileName: "",
    fileType: "",
    description: "",
  });

  // Pinata API keys (make sure these are securely stored in an environment variable)
  const pinataApiKey = '0796e12196871b0f2b9a';
  const pinataApiSecret = '3defa5a42393cd201b3a1c59c701c677a1fa57c8b00f3ed9983d3d80f437a5b8';

  // Pinata upload function
  const uploadToPinata = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const formData = new FormData();
    formData.append("file", file);

    const headers = {
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataApiSecret,
    };

    try {
      const response = await axios.post(url, formData, { headers });
      return response.data.IpfsHash;  // Returning the CID
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw new Error("File upload to Pinata failed");
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        file,
        fileName: file.name,
        fileType: file.type,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { file, fileName, fileType, description } = formData;

    if (!file || !fileName || !fileType || !description) {
      alert("All fields are required!");
      return;
    }

    try {
      // Upload file to Pinata
      const fileHash = await uploadToPinata(file);

      // Ensure MetaMask is available
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install it to proceed.");
        return;
      }

      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      const contract = new web3.eth.Contract(contractABI, contractAdd);

      // Call contract to upload file information
      await contract.methods
        .uploadFile(fileHash, fileName, fileType, description)
        .send({ from: account });

      alert("File uploaded successfully!");
      setFormData({ file: null, fileHash: "", fileName: "", fileType: "", description: "" });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload the file. Please try again.");
    }
  };

  return (
    <div className="form-container glassy-theme">
      <h2 className="form-title">Upload File</h2>
      <form onSubmit={handleSubmit}>
        {/* File Selection */}
        <div className="form-group">
          <label htmlFor="file">Select File</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            required
            className="form-input"
          />
        </div>

        {/* File Hash */}
        <div className="form-group">
          <label htmlFor="fileHash">File Hash</label>
          <input
            type="text"
            id="fileHash"
            name="fileHash"
            value={formData.fileHash}
            onChange={handleChange}
            placeholder="File hash will be auto-filled after upload"
            required
            className="form-input"
            disabled
          />
        </div>

        {/* File Name */}
        <div className="form-group">
          <label htmlFor="fileName">File Name</label>
          <input
            type="text"
            id="fileName"
            name="fileName"
            value={formData.fileName}
            onChange={handleChange}
            placeholder="Enter file name"
            required
            className="form-input"
          />
        </div>

        {/* File Type */}
        <div className="form-group">
          <label htmlFor="fileType">File Type</label>
          <input
            type="text"
            id="fileType"
            name="fileType"
            value={formData.fileType}
            onChange={handleChange}
            placeholder="Enter file type (e.g., PDF, JPEG)"
            required
            className="form-input"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter file description"
            required
            className="form-textarea"
          />
        </div>

        <button type="submit" className="form-button">
          Upload File
        </button>
      </form>
    </div>
  );
};

export default Form;
