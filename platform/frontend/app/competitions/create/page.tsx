"use client";
import React, { useState, useRef, ChangeEvent } from "react";
import {
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
  Textarea,
  Title,
  Alert,
  Box,
} from "@mantine/core";
import { useClient, useUser } from "@/app/components/UserContext";
import { useRouter } from "next/navigation";
import { IconUpload, IconAlertCircle, IconFile, IconX } from "@tabler/icons-react";

const CreateChallenge = () => {
  const client = useClient();
  const user = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dataset, setDataset] = useState<File | null>(null);
  const [mlmodel, setMlmodel] = useState<File | null>(null);
  const [xaiMethod, setXaiMethod] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create refs for each file input
  const datasetInputRef = useRef<HTMLInputElement | null>(null);
  const mlmodelInputRef = useRef<HTMLInputElement | null>(null);
  const xaiMethodInputRef = useRef<HTMLInputElement | null>(null);

  // Custom file change handler
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    const files = event.target.files;
    console.log("File selection event:", event);
    console.log("Selected files:", files);
    
    if (files && files.length > 0) {
      console.log("Selected file details:", {
        name: files[0].name,
        type: files[0].type,
        size: files[0].size
      });
      setter(files[0]);
    }
  };

  // Clear file input
  const clearFileInput = (inputRef: React.RefObject<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setter(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title || !dataset || !mlmodel || !xaiMethod) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("dataset", dataset);
      formData.append("mlmodel", mlmodel);
      formData.append("xai_method", xaiMethod);
      
      // Add creator if user is authenticated
      if (user && user.username) {
        formData.append("creator", user.username);
      }

      const response = await client.post("/api/challenge/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        router.push("/competitions");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create challenge. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Custom file input component
  const CustomFileInput = ({ 
    label, 
    description, 
    inputRef, 
    value, 
    onChange, 
    onClear,
    accept = "*/*" 
  }: { 
    label: string; 
    description: string; 
    inputRef: React.RefObject<HTMLInputElement>; 
    value: File | null; 
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    accept?: string;
  }) => {
    return (
      <Box mb="md">
        <Text fw={500} mb={5}>
          {label} <span style={{ color: 'red' }}>*</span>
        </Text>
        <Text size="sm" c="dimmed" mb={5}>
          {description}
        </Text>
        <Box 
          style={{ 
            border: '1px solid #dee2e6', 
            borderRadius: '4px', 
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            backgroundColor: 'white'
          }}
          onClick={() => inputRef.current?.click()}
        >
          <Text color={value ? 'black' : 'dimmed'}>
            {value ? value.name : "Klicken Sie hier, um eine Datei auszuwählen"}
          </Text>
          <Group gap="xs">
            {value && (
              <IconX 
                size={16} 
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
              />
            )}
            <IconFile size={16} />
          </Group>
        </Box>
        <input
          type="file"
          ref={inputRef}
          onChange={onChange}
          style={{ display: 'none' }}
          accept={accept}
        />
      </Box>
    );
  };

  return (
    <main className="flex flex-1 flex-col bg-gray-300">
      <Container size="md" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Title order={2} ta="center" mb="md">
            Create New Challenge
          </Title>

          {error && (
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Error" 
              color="red" 
              mb="md"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextInput
              label="Title"
              placeholder="Challenge Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              mb="md"
            />

            <Textarea
              label="Description"
              placeholder="Describe your challenge"
              minRows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              mb="md"
            />

            <CustomFileInput
              label="Dataset"
              description="Unterstützte Formate: CSV, TXT, JSON, PKL und andere Datendateien"
              inputRef={datasetInputRef}
              value={dataset}
              onChange={(e) => handleFileChange(e, setDataset)}
              onClear={() => clearFileInput(datasetInputRef, setDataset)}
              accept=".csv,.txt,.json,.pkl,application/octet-stream,application/x-pickle,application/pickle"
            />

            <CustomFileInput
              label="ML Model"
              description="Unterstützte Formate: H5, PKL, PT, ONNX, PB und andere Modelldateien"
              inputRef={mlmodelInputRef}
              value={mlmodel}
              onChange={(e) => handleFileChange(e, setMlmodel)}
              onClear={() => clearFileInput(mlmodelInputRef, setMlmodel)}
              accept=".h5,.pkl,.pt,.onnx,.pb,application/octet-stream,application/x-pickle,application/pickle"
            />

            <CustomFileInput
              label="XAI Method"
              description="Unterstützte Formate: PY, IPYNB, TXT und andere Skriptdateien"
              inputRef={xaiMethodInputRef}
              value={xaiMethod}
              onChange={(e) => handleFileChange(e, setXaiMethod)}
              onClear={() => clearFileInput(xaiMethodInputRef, setXaiMethod)}
              accept=".py,.ipynb,.txt,text/plain,text/python,application/x-python"
            />

            <Group justify="center" mt="lg">
              <Button
                type="submit"
                size="md"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 90 }}
                loading={isLoading}
              >
                Create Challenge
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </main>
  );
};

export default CreateChallenge;
