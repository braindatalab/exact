"use client";
import React, { useState, useEffect } from "react";
import {
  ActionIcon,
  Alert,
  Center,
  Container,
  Grid,
  Loader,
  Paper,
  Text,
  Pagination,
  Group,
} from "@mantine/core";
import ChallengeCard from "../components/ChallengeCard";
import { ChallengeData } from "../components/types";
import { useClient } from "../components/UserContext";
import { IconAlertCircle, IconCirclePlus, IconPlus } from "@tabler/icons-react";
import { convertChallengeData } from "../components/utils";
import Link from "next/link";

const Competitions = () => {
  const client = useClient();
  const [challenges, setChallenges] = useState<ChallengeData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChallenges = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await client.get(`/api/challenges/paginated/?page=${page}&page_size=9`);
      const { challenges: paginatedChallenges, pagination } = response.data;
      setChallenges(paginatedChallenges.map((c: any) => convertChallengeData(c)));
      setTotalPages(pagination.total_pages);
    } catch (err) {
      setError("Error loading challenges");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex flex-1 flex-col bg-gray-300">
      <Container p="none" m={0} px={100} py="lg" fluid>
        <Text size="xl" w="100%" mb="lg">
          <Text inherit span fw="600">
            Competitions:
          </Text>{" "}
          Explore and Participate in Explainable AI Benchmarking Challenges.
        </Text>
        {/* <Leaderboard /> */}
        {isLoading ? (
          <Center mt="xl">
            <Loader />
          </Center>
        ) : challenges === null ? (
          error && (
            <Alert
              variant="light"
              color="red"
              radius="md"
              withCloseButton
              title="Error"
              w="100%"
              onClose={() => setError(null)}
              icon={<IconAlertCircle />}
            >
              {error}
            </Alert>
          )
        ) : (
          <>
            <Grid w="100%">
              {challenges.map((challenge, i) => (
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={i}>
                  <ChallengeCard challenge={challenge} />
                </Grid.Col>
              ))}
              <Grid.Col
                span={{ base: 12, md: 6, lg: 4 }}
                key={challenges.length + 1}
              >
                <Paper h={180} radius="lg" bg="gray.3">
                  <Center h="100%" w="100%">
                    <ActionIcon
                      variant="subtle"
                      radius={120}
                      aria-label="Settings"
                      h={120}
                      w={120}
                      p={0}
                      title="Add a Competition"
                      href="/competitions/create"
                      component={Link}
                    >
                      <IconPlus
                        style={{ width: "70%", height: "70%" }}
                        stroke={2}
                      />
                    </ActionIcon>
                  </Center>
                </Paper>
              </Grid.Col>
            </Grid>
            <Group justify="center" mt="xl">
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={handlePageChange}
                withEdges
              />
            </Group>
          </>
        )}
      </Container>
    </main>
  );
};

export default Competitions;
