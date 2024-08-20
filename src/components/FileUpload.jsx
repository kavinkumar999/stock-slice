import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import ticket from '../assets/ticket.png';
import ClipBoard from './ClipBoard';

const FileUpload = () => {
  const [error, setError] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [data, setData] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [tickers, setTickers] = useState(null);

  const handleFileUpload = (event) => {
    setError('');
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      clearData();
      return;
    };

    const _fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    setFileExtension(_fileExtension);

    const reader = new FileReader();
    reader.onload = (e) => {
      setData(e.target.result);
    };
    
    reader.onerror = () => {
      setError('Error reading file');
    };

    if (_fileExtension === 'csv') {
      reader.readAsText(selectedFile);
    } else if (_fileExtension === 'xls' || _fileExtension === 'xlsx') {
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setError('Unsupported file format');
    }
  };
   
  const clearData = () => {
    setTickers(null);
    setData(null);
  };

  const processFile = (action) => {
    if (action === 'clear') {
      setTickers(null);
      return;
    }
    if (!data || !fileExtension) return;

    const handlers = {
      'csv': handleCSV,
      'xls': handleExcel,
      'xlsx': handleExcel,
    };

    if (handlers[fileExtension]) {
      handlers[fileExtension](data);
    } else {
      setError('Unsupported file format');
    }
  };

  const handleCSV = (data) => {
    Papa.parse(data, {
      header: true,
      complete: (result) => {
        setFileData(result.data);
      },
      error: () => {
        setError('Error parsing CSV file');
      },
    });
  };

  const handleExcel = (data) => {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    let _data = jsonData.map((data) => data.__EMPTY_1);
    _data = _data.slice(1);
    _data = _data.map((tick) => "NSE:" + tick);
    setFileData(_data);
    setTickers(_data);
  };

  return (
   <div className='p-10 flex flex-col items-center'>
    <div className='flex justify-center w-full'>
      <input className='bg-gray-700 text-white rounded-2xl p-3 w-3/4 border border-gray-600' type="file" accept=".csv,.xls,.xlsx" onChange={handleFileUpload} />
    </div>
    {error && <p className='text-red-500 mb-4'>{error}</p>}
    {data && <button className='bg-green-400 hover:bg-green-500 text-black py-2 px-4 rounded-md mt-10' onClick={() => processFile(!tickers ? 'analyse' : 'clear')}>
      {!tickers ? 'Analyse' : 'Clear' } 
    </button>}
    {!tickers && <div className='mt-5 text-red-500'>*Use CSV, XLS, and XLSX file extension exported from chartink.com</div>}

    {!tickers ? <img className='mt-5 w-full' src={ticket}></img> : <ClipBoard ticker={tickers}></ClipBoard>}
  </div>


  );
};

export default FileUpload;
