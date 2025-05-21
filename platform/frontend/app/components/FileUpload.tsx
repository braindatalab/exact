import React, { useState } from 'react';

interface FileUploadProps {
  type: 'dataset' | 'model' | 'xai';
  onFileSelect: (file: File) => void;
  isDarkMode?: boolean;
}

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

const FileUpload: React.FC<FileUploadProps> = ({ type, onFileSelect, isDarkMode = false }) => {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const getTitle = () => {
    switch (type) {
      case 'dataset':
        return 'Dataset';
      case 'model':
        return 'ML Model';
      case 'xai':
        return 'XAI Method Template';
      default:
        return '';
    }
  };

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
      setPendingFiles(prev => [...prev, ...validFiles]);
      validFiles.forEach(file => onFileSelect(file));
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
        setPendingFiles(prev => [...prev, ...validFiles]);
        validFiles.forEach(file => onFileSelect(file));
      }
    }
  };

  return (
    <div
      className={`
        ${pendingFiles.length > 0 ? 'h-80 w-[400px]' : 'h-40 w-[250px]'}
        ${isDarkMode 
          ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' 
          : 'bg-white border-gray-400 hover:bg-gray-50'
        }
        ${isDragging ? 'border-blue-500' : ''}
        border-2 border-dashed rounded-xl flex flex-col min-h-0 p-4 
        items-center justify-center text-center transition-all duration-300
        cursor-pointer
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`file-upload-${type}`)?.click()}
    >
      <input
        id={`file-upload-${type}`}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        multiple
      />
      
      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} w-full`}>
        <div className="text-lg font-medium mb-2">{getTitle()}</div>
        <div className="text-sm w-full">
          {pendingFiles.length === 0 ? (
            <>
              <p>Klicken oder Datei hierher ziehen</p>
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
                      setPendingFiles(prev => prev.filter((_, i) => i !== index));
                    }}
                    title="Entfernen"
                  >
                    Entfernen
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 