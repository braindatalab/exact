"use client";
import React, { useState } from "react";
import { useUser, useUserUpdate } from "../components/UserContext"; // Korrigiere den Pfad
import { Avatar, Text, Title, Box, Button, Divider, Tabs, TextInput, Group, Textarea } from "@mantine/core";
import styles from "./profile.module.css"; // Importiere die CSS-Datei

const ProfilePage = () => {
  const user = useUser();
  const updateUser = useUserUpdate();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "Guest");
  const [email, setEmail] = useState(user?.email || "guest@example.com");
  // const [bio, setBio] = useState(user?.bio || ""); fürne zukunftige bio

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    updateUser({ ...user, username, email});
    setIsEditing(false);
  };

  if (user === undefined) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box className={styles.profileContainer}>
      <Box className={styles.header}>
      </Box>
      <Box className={styles.profileCard}>
        <Avatar
          // src={user?.avatarUrl || "https://via.placeholder.com/150"} für ein zukünftiges profilbild
          alt="Profile Picture"
          size={150}
          radius="xl"
          className={styles.avatar}
        />
        <Title order={2} className={styles.username}>{username}</Title>
      </Box>
      <Button className={styles.editButton} onClick={handleEditClick}>
        {isEditing ? "Save your public profile" : "Edit your public profile"}
      </Button>
      <Tabs className={styles.tabs} defaultValue="about" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="about">About</Tabs.Tab>
          <Tabs.Tab value="bio">Bio</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="about" pt="xs">
          <Title order={3}>About</Title>
          <Divider my="sm" />
          <Box className={styles.tabContent}>
            {isEditing ? (
              <>
                <Group align="center">
                  <TextInput
                    value={username}
                    onChange={(event) => setUsername(event.currentTarget.value)}
                    label="Username"
                    style={{ flex: 1 }}
                  />
                </Group>
                <Group align="center" mt="sm">
                  <TextInput
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    label="Email"
                    style={{ flex: 1 }}
                  />
                </Group>
                <Button mt="sm" onClick={handleSave}>Save</Button>
              </>
            ) : (
              <>
                <Group align="center">
                  <Text size="lg" className={styles.userInfo}><strong>Vorname:</strong> {"Max"}</Text>
                </Group>
                <Group align="center" mt="sm">
                  <Text size="lg" className={styles.userInfo}><strong>Username:</strong> {username}</Text>
                </Group>
                <Group align="center" mt="sm">
                  <Text size="lg" className={styles.userInfo}><strong>Email:</strong> {email}</Text>
                </Group>
              </>
            )}
          </Box>
        </Tabs.Panel>
        <Tabs.Panel value="bio" pt="xs">
          <Title order={3}>Bio</Title>
          <Divider my="sm" />
          <Box className={styles.tabContent}>
            {isEditing ? (
              <Textarea
                // value={bio}
                // onChange={(event) => setBio(event.currentTarget.value)}
                label="Bio"
                placeholder="Tell us about yourself"
                minRows={4}
                style={{ width: "100%" }}
              />
            ) : (
              <Text>{"No bio yet..."}</Text>
            )}
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default ProfilePage;
