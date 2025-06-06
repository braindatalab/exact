import React, { useState } from 'react';

interface SubmissionUploadProps {
  onFileSelect: (file: File) => void;
  isDarkMode?: boolean;
  isLoading?: boolean;
  error?: string | null;
  progress?: number;
}

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

const SubmissionUpload: React.FC<SubmissionUploadProps> = ({ 
  onFileSelect, 
  isDarkMode = false,
  isLoading = false,
  error = null,
  progress = 0
}) => {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadClicked, setUploadClicked] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} überschreitet die maximale Dateigröße von 200 MB und wurde nicht hinzugefügt.`);
        return false;
      }
      return true;
    });
    if (validFiles.length > 0) {
      setPendingFiles(validFiles);
      setUploadClicked(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => {
        if (file.size > MAX_FILE_SIZE) {
          alert(`${file.name} überschreitet die maximale Dateigröße von 200 MB und wurde nicht hinzugefügt.`);
          return false;
        }
        return true;
      });
      if (validFiles.length > 0) {
        setPendingFiles(validFiles);
        setUploadClicked(false);
      }
    }
  };

  const handleRemove = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
    setUploadClicked(false);
  };

  const handleUpload = () => {
    if (pendingFiles.length > 0) {
      setUploadClicked(true);
      onFileSelect(pendingFiles[0]);
    }
  };

  return (
    <div
      className={`
        ${pendingFiles.length > 0 ? 'h-80' : 'h-40'}
        w-full
        ${isDarkMode 
          ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' 
          : 'bg-white border-gray-400 hover:bg-gray-50'
        }
        ${isDragging ? 'border-blue-500' : ''}
        ${error ? 'border-red-500' : ''}
        border-2 border-dashed rounded-xl flex flex-col min-h-0 p-4 
        items-center justify-center text-center transition-all duration-300
        cursor-pointer relative
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById('submission-upload')?.click()}
    >
      <input
        id="submission-upload"
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept=".py"
      />
      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} w-full`}>
        <div className="text-lg font-medium mb-2">XAI Method Submission</div>
        <div className="text-sm w-full">
          {pendingFiles.length === 0 ? (
            <>
              <p>Klicken oder Python-Datei hierher ziehen</p>
              <p className="text-xs mt-2">Maximale Dateigröße: 200MB</p>
            </>
          ) : (
            <div className="max-h-60 overflow-y-auto w-full">
              {pendingFiles.map((file, index) => (
                <div key={index} className="flex items-center w-full min-w-0 text-left p-2 border-b last:border-b-0">
                  <span
                    className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap mr-2"
                    title={file.name}
                  >
                    {file.name}
                  </span>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700 text-xs border border-red-300 rounded px-2 py-1 flex-shrink-0"
                    onClick={e => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    title="Entfernen"
                  >
                    Entfernen
                  </button>
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded shadow disabled:opacity-50"
                  onClick={e => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  disabled={pendingFiles.length === 0 || isLoading}
                >
                  Upload
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isLoading && progress > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && (
        <div className="absolute bottom-2 left-2 right-2 bg-red-100 text-red-600 p-2 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default SubmissionUpload; 