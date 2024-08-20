import React from 'react';

function ClipBoard(props) {
  const { ticker } = props;

  // Function to split array into chunks of a given size
  const splitArrayIntoChunks = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  // Split the ticker array into chunks of 30
  const chunks = splitArrayIntoChunks(ticker, 30);

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className="p-4 space-y-4 bg-gray-900 text-gray-100 w-full mt-5">
      {chunks.map((chunk, chunkIndex) => {
        const chunkString = chunk.join(', ');
        return (
          <div key={chunkIndex} className="border border-gray-700 rounded-lg p-4 shadow-lg flex flex-col items-end gap-4 bg-gray-800 mb-10">
             <button onClick={() => copyToClipboard(chunkString)} className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Copy
            </button>
            <textarea
              readOnly
              value={chunkString}
              className="w-full h-28 p-2 border border-gray-700 rounded-lg bg-gray-700 text-gray-300"
              style={{ resize: 'none' }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default ClipBoard;
