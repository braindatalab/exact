"use client";
import React, { useState } from "react";
import { useUser, useUserUpdate } from "../components/UserContext";
import { Avatar, Text, Title, Box, Button, Divider, Tabs, TextInput, Group, Textarea } from "@mantine/core";
import styles from "./profile.module.css";

const ProfilePage = () => {
  const user = useUser();
  const updateUser = useUserUpdate();
  const [isEditing, setIsEditing] = useState(false);
  
  // State für alle Felder
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [company, setCompany] = useState(user?.company || "");
  const [bio, setBio] = useState(user?.bio || "");

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    updateUser({ 
      ...user, 
      username, 
      email, 
      firstName, 
      lastName, 
      company, 
      bio 
    });
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
          alt="Profile Picture"
          size={150}
          radius="xl"
          className={styles.avatar}
        />
        <Title order={2} className={styles.username}>
          {firstName && lastName ? `${firstName} ${lastName}` : username}
        </Title>
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
                    value={firstName}
                    onChange={(event) => setFirstName(event.currentTarget.value)}
                    label="First Name"
                    style={{ flex: 1 }}
                  />
                </Group>
                <Group align="center" mt="sm">
                  <TextInput
                    value={lastName}
                    onChange={(event) => setLastName(event.currentTarget.value)}
                    label="Last Name"
                    style={{ flex: 1 }}
                  />
                </Group>
                <Group align="center" mt="sm">
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
                <Group align="center" mt="sm">
                  <TextInput
                    value={company}
                    onChange={(event) => setCompany(event.currentTarget.value)}
                    label="Company (optional)"
                    style={{ flex: 1 }}
                  />
                </Group>
                <Button mt="sm" onClick={handleSave}>Save</Button>
              </>
            ) : (
              <>
                <Group align="center">
                  <Text size="lg" className={styles.userInfo}>
                    <strong>First Name:</strong> {firstName || "Not provided"}
                  </Text>
                </Group>
                <Group align="center" mt="sm">
                  <Text size="lg" className={styles.userInfo}>
                    <strong>Last Name:</strong> {lastName || "Not provided"}
                  </Text>
                </Group>
                <Group align="center" mt="sm">
                  <Text size="lg" className={styles.userInfo}>
                    <strong>Username:</strong> {username || "Not provided"}
                  </Text>
                </Group>
                <Group align="center" mt="sm">
                  <Text size="lg" className={styles.userInfo}>
                    <strong>Email:</strong> {email || "Not provided"}
                  </Text>
                </Group>
                {company && (
                  <Group align="center" mt="sm">
                    <Text size="lg" className={styles.userInfo}>
                      <strong>Company:</strong> {company}
                    </Text>
                  </Group>
                )}
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
                value={bio}
                onChange={(event) => setBio(event.currentTarget.value)}
                label="Bio"
                placeholder="Tell us about yourself"
                minRows={4}
                style={{ width: "100%" }}
              />
            ) : (
              <Text>{bio || "No bio yet..."}</Text>
            )}
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default ProfilePage;