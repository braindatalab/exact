"use client";
import React, { useEffect, useState } from "react";
import {
  Alert,
  AspectRatio,
  Button,
  Center,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  Modal,
  Overlay,
  Paper,
  Table,
  Text,
  TextInput,
  Tabs,
  Badge,
  Box,
} from "@mantine/core";
import { ChallengeData, Score, DetailedScores } from "@/app/components/types";
import { useClient, useUser } from "@/app/components/UserContext";
import { notFound } from "next/navigation";
import {
  IconDataset,
  IconModel,
  IconTemplate,
  convertChallengeData,
  convertScore,
  fetcher,
  BASE_URL_API,
  formatDateGerman,
} from "@/app/components/utils";
import { AxiosError } from "axios";
import { IconInfoCircle, IconChartBar, IconTarget } from "@tabler/icons-react";
import useSWR from "swr";
import SubmissionUpload from "@/app/components/SubmissionUpload";
import { useMantineColorScheme } from "@mantine/core";

const ChallengeDetail = ({ params }: { params: { challengeId: string } }) => {
  const client = useClient();
  const user = useUser();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isUploadSubmissionModalOpen, setIsUploadSubmissionModalOpen] =
    useState(false);
  const [isLoadingUploadSubmission, setIsLoadingUploadSubmission] =
    useState(false);
  const [uploadSubmissionFile, setUploadSubmissionFile] = useState<File | null>(
    null
  );
  const [submissionUploadProgress, setSubmissionUploadProgress] =
    useState<number>(0);
  const [submissionUploadScore, setSubmissionUploadScore] =
    useState<Score | null>(null);
  const [submissionUploadDetailedScores, setSubmissionUploadDetailedScores] =
    useState<DetailedScores | null>(null);
  const [submissionUploadError, setSubmissionUploadError] = useState<
    string | null
  >(null);
  const [scores, setScores] = useState<Array<Score>>([]);
  const [methodName, setMethodName] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<string>("emd");
  const [metadata, setMetadata] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: scoreData,
    error: errorLoadingScoreData,
    isLoading: isLoadingScoreData,
  } = useSWR(`${BASE_URL_API}/api/scores`, fetcher);

useEffect(() => {
  client
    .get(`/api/challenge/${params.challengeId}/metadata/`)
    .then(({ data }) => {
      setMetadata(data);
    })
    .catch((e) => {
      console.error('Error loading metadata:', e);
    });
}, [client, params.challengeId]);

  useEffect(() => {
    if (!scoreData) {
      return;
    }
    const convertedScores = scoreData.map((s: any) => convertScore(s));
    const filteredScores = convertedScores.filter(
      (s: Score) => s.challengeId === params.challengeId
    );
    setScores(filteredScores);
  }, [scoreData, params.challengeId]);

  useEffect(() => {
    client
      .get(`/api/challenge/${params.challengeId}`)
      .then(({ data }) => {
        setChallenge(convertChallengeData(data));
      })
      .catch((e) => {
        setError(e);
      });
  }, [client, params.challengeId]);

  React.useEffect(() => {
    if (!isLoadingUploadSubmission && uploadSubmissionFile && submissionUploadProgress === 100 && !submissionUploadError) {
      setTimeout(() => {
        setIsUploadSubmissionModalOpen(false);
        setUploadSubmissionFile(null);
        setSubmissionUploadProgress(0);
        setSubmissionUploadScore(null);
        setSubmissionUploadDetailedScores(null);
        setSubmissionUploadError(null);
      }, 1000);
    }
  }, [isLoadingUploadSubmission, uploadSubmissionFile, submissionUploadProgress, submissionUploadError]);

  if (error && error.response && error.response.status === 404) {
    notFound();
  }

  const addSubmission = (file: File) => {
    if (!challenge) {
    return;
    }
    setSubmissionUploadError(null);
    setSubmissionUploadScore(null);
    setSubmissionUploadDetailedScores(null);
    setSubmissionUploadProgress(90);
    setIsLoadingUploadSubmission(true);
    
    const formData = new FormData();
    formData.append("file", file);
    const username = user && user.username ? user.username : "anonymous";
    formData.append("username", username);
  
    const defaultMethodName = file.name.replace(/\.[^/.]+$/, "");
    const finalMethodName = methodName?.trim() || defaultMethodName;
    formData.append("method_name", finalMethodName);
    client
      .post(`/api/xai/${challenge.id}/`, formData)
      .then((res) => {
        const { message, score, detailed_scores }: { 
          message: string; 
          score: any; 
          detailed_scores?: DetailedScores 
        } = res.data;
        
        if (score) {
          setSubmissionUploadScore(convertScore(score));
        }
        if (detailed_scores) {
          setSubmissionUploadDetailedScores(detailed_scores);
        }
        if (message.toLowerCase() !== "success" && !message.toLowerCase().includes("completed")) {
          setSubmissionUploadError(message);
        }
        setSubmissionUploadProgress(100);
        setIsLoadingUploadSubmission(false);
      })
      .catch((e: AxiosError) => {
        setSubmissionUploadProgress(100);
        setIsLoadingUploadSubmission(false);
        setSubmissionUploadError(e.message === undefined ? null : e.message);
      });
  };

  const deleteChallenge = async () => {
  if (!challenge || !user?.username) {
    return;
  }

  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${challenge.title}"? This action cannot be undone.`
  );

  if (!confirmDelete) {
    return;
  }

  setIsDeleting(true);

  try {
    const response = await client.delete(`/api/challenge/${challenge.id}/delete/`, {
      data: { username: user.username }
    });

    if (response.status === 200) {
      alert('Challenge deleted successfully');
      window.location.href = '/competitions';
    }
  } catch (error: any) {
    console.error('Delete error:', error);
    const errorMessage = error.response?.data?.error || 'Failed to delete challenge';
    alert(errorMessage);
  } finally {
    setIsDeleting(false);
  }
};

  const formatScore = (score: number | null | undefined): string => {
    if (score === null || score === undefined) return "-";
    return score.toFixed(4);
  };

  const getSortedScores = (metric: string) => {
    return [...scores].sort((a, b) => {
      if (metric === "ima") {
        const aScore = a.imaScore ?? 0;
        const bScore = b.imaScore ?? 0;
        return bScore - aScore;
      } else {
        const aScore = a.emdScore ?? a.score ?? 0;
        const bScore = b.emdScore ?? b.score ?? 0;
        return bScore - aScore;
      }
    });
  };

  return (
    <main className="flex flex-1 flex-col bg-gray-300">
      {challenge === null ? (
        <Center mt="xl">
          <Loader />
        </Center>
      ) : (
        <Grid w="100%" px={100} py="lg" gutter="lg">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Paper p="0" shadow="md" style={{ overflow: "hidden" }}>
              <AspectRatio ratio={4 / 2} pos="relative">
                <Image src={challenge.thumbnail} alt="Demo" />
                <Overlay
                  gradient="linear-gradient(to bottom, hsla(0, 0%, 100%, 0) 0%, hsla(0, 0%, 100%, 0.013) 13.5%, hsla(0, 0%, 100%, 0.049) 25.2%, hsla(0, 0%, 100%, 0.104) 35.4%, hsla(0, 0%, 100%, 0.175) 44.1%, hsla(0, 0%, 100%, 0.259) 51.7%, hsla(0, 0%, 100%, 0.352) 58.2%, hsla(0, 0%, 100%, 0.45) 63.9%, hsla(0, 0%, 100%, 0.55) 68.9%, hsla(0, 0%, 100%, 0.648) 73.4%, hsla(0, 0%, 100%, 0.741) 77.6%, hsla(0, 0%, 100%, 0.825) 81.7%, hsla(0, 0%, 100%, 0.896) 85.8%, hsla(0, 0%, 100%, 0.951) 90.1%, hsla(0, 0%, 100%, 0.987) 94.7%, hsl(0, 0%, 100%) 100%)"
                  opacity={1}
                />
                <div style={{ position: "absolute", top: "100%", transform: "translateY(-30px)", zIndex: 200, textAlign: "center" }}>
                  <Text size="30px" fw="900" tt="uppercase" variant="gradient" gradient={{ from: "blue", to: "cyan", deg: 90 }}>
                    {challenge.title}
                  </Text>
                </div>
              </AspectRatio>
              <Text m="md">{challenge.description}</Text>
            </Paper>
            <Paper shadow="md" p="sm" mt="lg">
              <Text size="xl" fw="600" ta="center">Your Submissions</Text>
              <Divider my="sm" />
              {user ? (
                isLoadingScoreData && scores.length === 0 ? (
                  <Center>
                    <Loader type="dots" />
                  </Center>
                ) : (
                  <Table
                    data={{
                      caption: "Your Contributions To This Challenge",
                      head: ["Submitted at", "Method", "EMD Score", "IMA Score"],
                      body: scores.reduce((t: Array<any>, s: Score) => {
                        if (s.username !== user.username) {
                          return t;
                        }
                        return [
                          ...t,
                          [
                            formatDateGerman(s.createdAt),
                            s.methodName || "Unknown Method",
                            <Text>{formatScore(s.emdScore)}</Text>,
                            <Text>{formatScore(s.imaScore)}</Text>,
                          ],
                        ];
                      }, []),
                    }}
                  />
                )
              ) : (
                <Text>You are not logged in...</Text>
              )}
              <Group justify="center" mt="md">
                <Button
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  onClick={() => setIsUploadSubmissionModalOpen(true)}
                >
                  Add Submission
                </Button>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Paper shadow="md" p="sm">
              <Text size="xl" fw="600" ta="center">Metadata</Text>
              <Divider mb="sm" />
              <Group justify="space-between">
                <Text>Created by</Text>
                <Text>{metadata?.created_by || challenge.creator || "Kein Creator angegeben"}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Created at</Text>
                <Text>{formatDateGerman(challenge.createdAt)}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Closes on</Text>
                <Text>{metadata?.closes_on ? formatDateGerman(new Date(metadata.closes_on)) : "-"}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Number Participants</Text>
                <Text>{metadata?.participant_count ?? challenge.participants ?? "number participants unknown"}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Challenge ID</Text>
                <Text>{challenge.id}</Text>
              </Group>
              {user && metadata?.created_by === user.username && (
                <>
                  <Divider my="sm" />
                  <Group justify="center">
                    <Button
                      color="red"
                      variant="outline"
                      size="sm"
                      loading={isDeleting}
                      onClick={deleteChallenge}
                    >
                      Delete Challenge
                    </Button>
                  </Group>
                </>
              )}
            </Paper>            
            <Paper shadow="md" mt="lg" p="sm">
              <Text size="xl" fw="600" ta="center">Resources</Text>
              <Divider mb="sm" />
              <Button rightSection={<IconDataset size={16} />} fullWidth variant="light" component="a" href={`http://localhost:8000/api/dataset/${challenge.id}`}>Download Dataset</Button>
              <Button rightSection={<IconTemplate size={16} />} mt="xs" fullWidth variant="light" component="a" href={`http://localhost:8000/api/xaimethod/${challenge.id}`}>Download XAI Method Template</Button>
              <Button rightSection={<IconModel size={16} />} mt="xs" fullWidth variant="light" component="a" href={`http://localhost:8000/api/mlmodel/${challenge.id}`}>Download ML Model</Button>
            </Paper>
            <Paper shadow="md" mt="lg" p="sm">
              <Text size="xl" fw="600" ta="center">Leaderboard</Text>
              <Divider mb="sm" />
              <Tabs value={activeMetric} onChange={(value) => setActiveMetric(value || "emd")}>
                <Tabs.List grow>
                  <Tabs.Tab value="emd" leftSection={<IconChartBar size={16} />}>EMD Score</Tabs.Tab>
                  <Tabs.Tab value="ima" leftSection={<IconTarget size={16} />}>IMA Score</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="emd" pt="xs"><Box mb="xs"><Text size="sm" c="dimmed">Earth Mover's Distance</Text></Box></Tabs.Panel>
                <Tabs.Panel value="ima" pt="xs"><Box mb="xs"><Text size="sm" c="dimmed">Importance Mass Accuracy</Text></Box></Tabs.Panel>
              </Tabs>
              {isLoadingScoreData && scores.length === 0 ? (
                <Center mt="md"><Loader type="dots" /></Center>
              ) : scores.length > 0 ? (
                <Table mt="md" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0", border: "1px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
                  <thead style={{ backgroundColor: "#f5f5f5" }}>
                    <tr>
                      <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #e0e0e0" }}>Rank</th>
                      <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #e0e0e0" }}>User</th>
                      <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #e0e0e0" }}>Method</th>
                      <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #e0e0e0" }}>{activeMetric === "ima" ? "IMA" : "EMD"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedScores(activeMetric).map((s, index) => (
                      <tr key={index} style={{ borderTop: "1px solid #e0e0e0" }}>
                        <td style={{ padding: "8px" }}>{index + 1}</td>
                        <td style={{ padding: "8px" }}>{s.username}{user && s.username === user.username && (<Badge size="xs" ml="xs" variant="light">You</Badge>)}</td>
                        <td style={{ padding: "8px" }}>{s.methodName || "Unknown"}</td>
                        <td style={{ padding: "8px" }}>
                          <Text fw={500}>
                            {activeMetric === "ima" 
                              ? formatScore(s.imaScore)
                              : formatScore(s.emdScore ?? s.score)
                            }
                          </Text>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Text mt="md">No submissions yet...</Text>
              )}
            </Paper>
          </Grid.Col>
        </Grid>
      )}
      <Modal
        opened={isUploadSubmissionModalOpen}
        onClose={() => {
          setIsUploadSubmissionModalOpen(false);
          setUploadSubmissionFile(null);
          setSubmissionUploadProgress(0);
          setSubmissionUploadScore(null);
          setSubmissionUploadDetailedScores(null);
          setSubmissionUploadError(null);
          setMethodName(null);
        }}
        title="Upload Submission"
        size="lg"
      >
        <TextInput label="Method Name" placeholder="Enter your XAI method name" value={methodName || ""} onChange={(event) => setMethodName(event.currentTarget.value)} mb="md" required />
        <SubmissionUpload onFileSelect={(file) => { setUploadSubmissionFile(file); addSubmission(file); }} isDarkMode={isDark} isLoading={isLoadingUploadSubmission} error={submissionUploadError} progress={submissionUploadProgress} />
        {submissionUploadScore && submissionUploadDetailedScores && (
          <Alert icon={<IconInfoCircle size={16} />} mt="md" color="green">
            <Text fw={500}>Evaluation Complete!</Text>
            <Group mt="xs" gap="xl">
              <div>
                <Text size="sm" c="dimmed">EMD Score</Text>
                <Text fw={600}>{formatScore(submissionUploadScore.emdScore)}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">IMA Score</Text>
                <Text fw={600}>{formatScore(submissionUploadScore.imaScore)}</Text>
              </div>
            </Group>
          </Alert>
        )}
      </Modal>
    </main>
  );
};

export default ChallengeDetail;
