"use client";
import React, { useEffect, useState } from "react";
import {
  Alert,
  AspectRatio,
  Button,
  Center,
  Divider,
  FileInput,
  Grid,
  Group,
  Image,
  Loader,
  Modal,
  Overlay,
  Paper,
  Progress,
  Table,
  Text,
} from "@mantine/core";
import { ChallengeData, Score } from "@/app/components/types";
import { useClient, useUser } from "@/app/components/UserContext";
import { notFound } from "next/navigation";
import {
  IconDataset,
  IconModel,
  IconTemplate,
  convertChallengeData,
  LEADERBOARD_MOCK_DATA,
  convertScore,
  fetcher,
  BASE_URL_API,
} from "@/app/components/utils";
import { AxiosError } from "axios";
import { IconInfoCircle } from "@tabler/icons-react";
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
  const [submissionUploadError, setSubmissionUploadError] = useState<
    string | null
  >(null);
  const [scores, setScores] = useState<Array<Score>>([]);

  const {
    data: scoreData,
    error: errorLoadingScoreData,
    isLoading: isLoadingScoreData,
  } = useSWR(`${BASE_URL_API}/api/scores`, fetcher);

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

  if (error && error.response && error.response.status === 404) {
    notFound();
  }

  const addSubmission = (file: File) => {
    if (!challenge) {
      return;
    }
    setSubmissionUploadError(null);
    setSubmissionUploadScore(null);
    setSubmissionUploadProgress(90);
    setIsLoadingUploadSubmission(true);
    const formData = new FormData();
    formData.append("file", file);
    const username = user && user.username ? user.username : "anonymous";
    formData.append("username", username);
    client
      .post(`/api/xai/${challenge.id}/`, formData)
      .then((res) => {
        const { message, score }: { message: string; score: any } = res.data;
        if (score) {
          setSubmissionUploadScore(convertScore(score));
        }
        if (message.toLowerCase() !== "success") {
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

  const determineSubmissionEvaluationStatus = () => {
    if (!submissionUploadScore && !submissionUploadError) {
      if (uploadSubmissionFile) {
        if (isLoadingUploadSubmission) {
          return "Loading";
        }
        return "File selected";
      }
      return "No file selected";
    } else {
      if (submissionUploadError) {
        return "Error";
      } else {
        return "Success";
      }
    }
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
                  gradient="linear-gradient(
    to bottom,
    hsla(0, 0%, 100%, 0) 0%,
    hsla(0, 0%, 100%, 0.013) 13.5%,
    hsla(0, 0%, 100%, 0.049) 25.2%,
    hsla(0, 0%, 100%, 0.104) 35.4%,
    hsla(0, 0%, 100%, 0.175) 44.1%,
    hsla(0, 0%, 100%, 0.259) 51.7%,
    hsla(0, 0%, 100%, 0.352) 58.2%,
    hsla(0, 0%, 100%, 0.45) 63.9%,
    hsla(0, 0%, 100%, 0.55) 68.9%,
    hsla(0, 0%, 100%, 0.648) 73.4%,
    hsla(0, 0%, 100%, 0.741) 77.6%,
    hsla(0, 0%, 100%, 0.825) 81.7%,
    hsla(0, 0%, 100%, 0.896) 85.8%,
    hsla(0, 0%, 100%, 0.951) 90.1%,
    hsla(0, 0%, 100%, 0.987) 94.7%,
    hsl(0, 0%, 100%) 100%
  )" // gradient easing done with https://larsenwork.com/easing-gradients/
                  opacity={1}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    transform: "translateY(-30px)",
                    zIndex: 200,
                    textAlign: "center",
                  }}
                >
                  <Text
                    size="30px"
                    fw="900"
                    tt="uppercase"
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  >
                    {challenge.title}
                  </Text>
                </div>
              </AspectRatio>
              <Text m="md">{challenge.description}</Text>
            </Paper>
            <Paper shadow="md" p="sm" mt="lg">
              <Text size="xl" fw="600" ta="center">
                Your Submissions
              </Text>
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
                      head: ["Submitted at", "Link to file", "Score"],
                      body: scores.reduce((t: Array<any>, s: Score) => {
                        if (s.username !== user.username) {
                          return t;
                        }
                        return [
                          ...t,
                          [
                            s.createdAt.toISOString(),
                            "coming soon...",
                            s.score,
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
              <Text size="xl" fw="600" ta="center">
                Metadata
              </Text>
              <Divider mb="sm" />
              <Group justify="space-between">
                <Text>Created by</Text>
                <Text>
                  {challenge.creator ? challenge.creator : "creator unknown"}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text>Created at</Text>
                <Text>{challenge.createdAt.toISOString()}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Closes on</Text>
                <Text>
                  {challenge.deadline ? challenge.deadline.toISOString() : "-"}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text>Number Participants</Text>
                <Text>
                  {challenge.participants
                    ? challenge.participants
                    : "number partipants unknown"}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text>Challenge ID</Text>
                <Text>{challenge.id}</Text>
              </Group>
            </Paper>
            <Paper shadow="md" mt="lg" p="sm">
              <Text size="xl" fw="600" ta="center">
                Resources
              </Text>
              <Divider mb="sm" />
              <Button
                rightSection={<IconDataset size={16} />}
                fullWidth
                variant="light"
                component="a"
                href={`http://localhost:8000/api/dataset/${challenge.id}`}
              >
                Download Dataset
              </Button>
              <Button
                rightSection={<IconTemplate size={16} />}
                mt="xs"
                fullWidth
                variant="light"
                component="a"
                href={`http://localhost:8000/api/xaimethod/${challenge.id}`}
              >
                Download XAI Method Template
              </Button>
              <Button
                rightSection={<IconModel size={16} />}
                mt="xs"
                fullWidth
                variant="light"
                component="a"
                href={`http://localhost:8000/api/mlmodel/${challenge.id}`}
              >
                Download ML Model
              </Button>
            </Paper>
            <Paper shadow="md" mt="lg" p="sm">
              <Text size="xl" fw="600" ta="center">
                Leaderboard
              </Text>
              <Divider mb="sm" />
              {isLoadingScoreData && scores.length === 0 ? (
                <Center>
                  <Loader type="dots" />
                </Center>
              ) : scores.length > 0 ? (
                <Table
                  style={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: "0",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <thead style={{ backgroundColor: "#f5f5f5" }}>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          borderBottom: "1px solid #e0e0e0",
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        Rank
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          borderBottom: "1px solid #e0e0e0",
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        User
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores
                      .sort((a, b) => a.score - b.score)
                      .map((s, index) => (
                        <tr
                          key={index}
                          style={{ borderTop: "1px solid #e0e0e0" }}
                        >
                          <td
                            style={{
                              padding: "8px",
                              borderRight: "1px solid #e0e0e0",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              borderRight: "1px solid #e0e0e0",
                            }}
                          >
                            {s.username}
                          </td>
                          <td style={{ padding: "8px" }}>{s.score}</td>
                        </tr>
                      ))}
                    {/* {LEADERBOARD_MOCK_DATA.ranking.map((entry, index) => (
                    <tr key={index} style={{ borderTop: "1px solid #e0e0e0" }}>
                      <td
                        style={{
                          padding: "8px",
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        {entry.user}
                      </td>
                      <td style={{ padding: "8px" }}>{entry.score}</td>
                    </tr>
                  ))} */}
                  </tbody>
                </Table>
              ) : (
                <Text>No submissions yet...</Text>
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
          setSubmissionUploadError(null);
        }}
        title="Upload Submission"
        size="lg"
      >
        <SubmissionUpload
          onFileSelect={(file) => {
            setUploadSubmissionFile(file);
            addSubmission(file);
          }}
          isDarkMode={isDark}
          isLoading={isLoadingUploadSubmission}
          error={submissionUploadError}
          progress={submissionUploadProgress}
        />
      </Modal>
    </main>
  );
};

export default ChallengeDetail;
