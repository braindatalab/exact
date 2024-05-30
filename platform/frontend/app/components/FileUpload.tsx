import React, { useRef, useState, ChangeEvent } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

export const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploadSuccessful, setIsUploadSuccessful] = useState<boolean>(false);
  const [score, setScore] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);
      setIsLoading(true);

      try {
        await axios.post("http://localhost:8000/api/xai/f85f311b-9997-429b-9b08-5397140174ed/", formData, {});
        setUploadStatus(`✅ File uploaded successfully`);
        setIsUploadSuccessful(true);
        setScore(null);
        setError(null);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setUploadStatus(`Error uploading file: An error occurred 😢`);
        }
        setIsUploadSuccessful(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleGetScoreClick = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/score/1/");
      setScore(`Score: ${response.data.score}`);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(`Failed to get score. An error occurred 😢`);
      } else {
        setError("Failed to get score: An unexpected error occurred");
      }
      setScore(null);
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto bg-white shadow-md p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Upload your file
        </h2>
        <div className="flex justify-center">
          <input
            type="file"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            ref={fileInputRef}
            accept=".py"
          />
          <div className="flex flex-col items-center justify-center">
            <Button
              variant="contained"
              color="primary"
              className="bg-blue-500"
              onClick={handleButtonClick}
            >
              Select and Upload File
            </Button>
            {isLoading && <CircularProgress className="mt-5" />}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          {uploadStatus && <p>{uploadStatus}</p>}

          {isUploadSuccessful && (
            <>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleGetScoreClick}
                className="mt-5 bg-red-500"
              >
                Get Score
              </Button>
              {score && <p>{score}</p>}
              {error && <p className="text-orange-500">{error}</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUpload;
