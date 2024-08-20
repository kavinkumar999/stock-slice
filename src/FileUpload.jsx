import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const FileUpload = () => {
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!['csv', 'xls', 'xlsx'].includes(fileExtension)) {
      setError('Please upload a CSV, XLS, or XLSX file.');
      return;
    }

    setError('');
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;

      if (fileExtension === 'csv') {
        handleCSV(data);
      } else {
        handleExcel(data);
      }
    };

    if (fileExtension === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleCSV = (data) => {
    Papa.parse(data, {
      header: true,
      complete: (result) => {
        setFileData(result.data);
      },
      error: (error) => {
        setError('Error parsing CSV file');
      },
    });
  };

  const handleExcel = (data) => {
    const workbook = XLSX.read(data, { type: 'binary' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    setFileData(jsonData);
  };

  return (
    <div>
      <h2>Upload and Analyze File</h2>
      <input type="file" accept=".csv,.xls,.xlsx" onChange={handleFileUpload} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {fileData && (
        <div>
          <h3>File Data:</h3>
          <pre>{JSON.stringify(fileData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
