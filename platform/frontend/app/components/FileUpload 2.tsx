import React, { useRef, useState, ChangeEvent } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Dropzone } from '@mantine/dropzone';
import { Text, Group } from '@mantine/core';
import { IconUpload, IconX, IconFile } from '@tabler/icons-react';

export const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploadSuccessful, setIsUploadSuccessful] = useState<boolean>(false);
  const [score, setScore] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = async (files: File[]) => {
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
          <Dropzone
            onDrop={handleFileUpload}
            onReject={(files) => {
              setUploadStatus(`Error: Invalid file type`);
              setIsUploadSuccessful(false);
            }}
            maxSize={5 * 1024 ** 2}
            accept={['.py']}
            className="w-full"
          >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload
                  size="3.2rem"
                  stroke={1.5}
                  color="var(--mantine-color-blue-6)"
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  size="3.2rem"
                  stroke={1.5}
                  color="var(--mantine-color-red-6)"
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconFile
                  size="3.2rem"
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag your Python file here or click to select
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  File should not exceed 5MB
                </Text>
              </div>
            </Group>
          </Dropzone>
          {isLoading && <CircularProgress className="mt-5" />}
        </div>
        <div className="flex flex-col items-center justify-center mt-4">
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
