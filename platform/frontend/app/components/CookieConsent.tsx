'use client';

import { useEffect, useState, useRef } from 'react';
import { Paper, Text, Group, Button, Box } from '@mantine/core';
import { Storage } from '../utils/storage';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;

    // Check if user has already made a choice
    const consent = Storage.getCookie('cookieConsent');
    console.log('Current cookie consent status:', consent);
    
    // Only hide the banner if we explicitly have a consent choice
    if (consent === 'accepted' || consent === 'declined') {
      console.log('Hiding banner due to existing choice:', consent);
      setShowBanner(false);
    } else {
      console.log('Showing banner - no consent choice found');
      setShowBanner(true);
    }

    effectRan.current = true;
  }, []);

  const handleAccept = () => {
    Storage.setCookie('cookieConsent', 'accepted', { expires: 365 }); // Valid for 1 year
    setShowBanner(false);
  };

  const handleDecline = () => {
    Storage.setCookie('cookieConsent', 'declined', { expires: 1 }); // Only valid for 1 day
    setShowBanner(false);
    // Clear any existing cookies except the consent one
    Storage.removeCookie('sessionActive');
    Storage.removeLocalStorage('user');
  };

  if (!showBanner) {
    return null;
  }

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <Paper shadow="md" p="md" withBorder bg="white">
        <Group justify="space-between" align="center">
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              Cookie Consent
            </Text>
            <Text size="sm" c="dimmed" mt={4}>
              This website uses cookies and similar technologies to improve your experience. 
              By continuing to use our website, you agree to our use of cookies.
            </Text>
          </Box>
          <Group gap="sm">
            <Button
              variant="outline"
              color="gray"
              size="sm"
              onClick={handleDecline}
            >
              Decline
            </Button>
            <Button
              variant="filled"
              color="blue"
              size="sm"
              onClick={handleAccept}
            >
              Accept
            </Button>
          </Group>
        </Group>
      </Paper>
    </Box>
  );
} 