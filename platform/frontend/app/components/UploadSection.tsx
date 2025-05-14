import React from 'react';
import FileUpload from './FileUpload';

const UploadSection: React.FC = () => {
  const handleDatasetSelect = (file: File) => {
    console.log('Dataset selected:', file);
    // Hier können Sie die Datei verarbeiten
  };

  const handleModelSelect = (file: File) => {
    console.log('Model selected:', file);
    // Hier können Sie die Datei verarbeiten
  };

  const handleXAISelect = (file: File) => {
    console.log('XAI Template selected:', file);
    // Hier können Sie die Datei verarbeiten
  };

  return (
    <div className="flex flex-wrap gap-6 p-6">
      <FileUpload 
        type="dataset" 
        onFileSelect={handleDatasetSelect}
      />
      <FileUpload 
        type="model" 
        onFileSelect={handleModelSelect}
      />
      <FileUpload 
        type="xai" 
        onFileSelect={handleXAISelect}
      />
    </div>
  );
};

export default UploadSection; 