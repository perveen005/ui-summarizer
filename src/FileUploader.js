import React, { useState, useEffect } from 'react';
import './FileUploader.css';
import { uploadFileToAzureStorage } from './api/azureStorageApi';

const sasUrl = 'https://hlsdipdevprocessstpravn.blob.core.windows.net/documents?sp=racwd&st=2023-07-07T08:18:16Z&se=2023-07-21T16:18:16Z&sv=2022-11-02&sr=c&sig=RHamKyhu5mwAJX9CER28wJCelFGqGdR9BKsBbv4VnGA%3D';
const containerName = 'input';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.log('Please select a file');
      return;
    }
    setIsLoading(true);
    const uploadSuccessful = await uploadFileToAzureStorage(selectedFile, sasUrl, containerName);
    setIsLoading(false);
    if (uploadSuccessful) {
      console.log("successful upload");
      fetchSummary(); 
    } else {
      console.log("unsuccessful upload");
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch('https://hls-dip-dev-func-openai.azurewebsites.net');
      if (response.ok) {
        const data = await response.json();
        if (data.summary) {
          setSummary(data.summary);
        } else {
          setTimeout(fetchSummary, 5000); 
        }
      } else {
        console.log('Error retrieving summary');
      }
    } catch (error) {
      console.log('An error occurred while fetching summary');
    }
  };

  useEffect(() => {
    setSummary('');

    return () => {
      clearTimeout(fetchSummary);
    };
  }, [selectedFile]);

  return (
    <div className="App">
      <h1>PDF Summary App</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Submit</button>
      {isLoading && <p>Loading...</p>}
      {summary && (
        <div className="summary-box">
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
