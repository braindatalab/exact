"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClient, useUser } from "@/app/components/UserContext";
import {
  Button,
  Divider,
  FileInput,
  Group,
  Paper,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconDataset, IconModel, IconTemplate } from "@/app/components/utils";

const CreateCompetition = () => {
  const router = useRouter();
  const user = useUser();
  const theme = useMantineTheme();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dataset, setDataset] = useState<File | null>(null);
  const [model, setModel] = useState<File | null>(null);
  const [xaiMethod, setXaiMethod] = useState<File | null>(null);

  const client = useClient();

  useEffect(() => {
    // redirect if user is not logged in or does not have permissions to create a competition
    if (user === null) {
      // router.push("/");
    }
  }, [user, router]);

  const handlePublish = () => {
    if (!xaiMethod || !model || !dataset) {
      return;
    }

    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dataset", dataset);
    formData.append("mlmodel", model);
    formData.append("xai_method", xaiMethod);

    client.post("/api/challenge/create/", formData).then(function (response) {
      console.log(response.data);
    });
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24 bg-gray-300">
      <Paper p="xl" w="100%" shadow="md">
        <Title order={3}>Create a New Competition</Title>
        <Divider my="md" />
        <TextInput
          label="Title"
          description="This title will be displayed for everyone to see"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          withAsterisk
        />
        <Textarea
          label="Description"
          description="Describe the competitions to give potential competitors an idea of what it is about"
          autosize
          minRows={2}
          maxRows={8}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          mt="sm"
        />
        <Group justify="center" grow mt="sm">
          <FileInput
            leftSection={<IconDataset />}
            label="Dataset"
            placeholder="Click to select a file"
            leftSectionPointerEvents="none"
            value={dataset}
            onChange={setDataset}
            clearable
          />
          <FileInput
            leftSection={<IconModel />}
            label="ML Model"
            placeholder="Click to select a file"
            leftSectionPointerEvents="none"
            value={model}
            onChange={setModel}
            clearable
          />
          <FileInput
            leftSection={<IconTemplate />}
            label="XAI Method Template"
            placeholder="Click to select a file"
            leftSectionPointerEvents="none"
            value={xaiMethod}
            onChange={setXaiMethod}
            clearable
          />
        </Group>
        <Group justify="end" mt="lg">
          <Button variant="light">Preview</Button>
          <Button
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 96 }}
            disabled={!xaiMethod || !dataset || !model}
            onClick={handlePublish}
          >
            Publish Competition
          </Button>
        </Group>
      </Paper>
    </main>
  );
};

export default CreateCompetition;
