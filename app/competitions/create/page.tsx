"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClient, useUser } from "@/app/components/UserContext";
import {
  Alert,
  Button,
  Divider,
  Group,
  Loader,
  Paper,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconAlertHexagon, IconArrowLeft, IconFileSpreadsheet, IconBoxModel, IconTemplate } from "@tabler/icons-react";
import Link from "next/link";
import FileUpload from "@/app/components/FileUpload";

const MAX_DATASET_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_MODEL_SIZE = 50 * 1024 * 1024;   // 50 MB
const MAX_XAI_SIZE = 5 * 1024 * 1024;      // 5 MB

<Group justify="center" grow mt="sm" gap="md">
  <FileUpload
    type="dataset"
    onFileSelect={(file) => {
      if (file.size > MAX_DATASET_SIZE) {
        alert("Dataset is too large (max. 10 MB)");
        return;
      }
      setDataset(file);
    }}
    isDarkMode={isDark}
    accept=".pkl,.npz,.csv"
    maxSize={MAX_DATASET_SIZE}
  />
  <FileUpload
    type="model"
    onFileSelect={(file) => {
      if (file.size > MAX_MODEL_SIZE) {
        alert("Model file is too large (max. 50 MB)");
        return;
      }
      setModel(file);
    }}
    isDarkMode={isDark}
    accept=".pt,.h5,.onnx"
    maxSize={MAX_MODEL_SIZE}
  />
  <FileUpload
    type="xai"
    onFileSelect={(file) => {
      if (file.size > MAX_XAI_SIZE) {
        alert("XAI method file is too large (max. 5 MB)");
        return;
      }
      setXaiMethod(file);
    }}
    isDarkMode={isDark}
    accept=".py"
    maxSize={MAX_XAI_SIZE}
  />
</Group> 