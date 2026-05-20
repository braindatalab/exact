'use client';

import { useEffect, useState } from 'react';
import { Paper, Text, Group, Button, Box } from '@mantine/core';
import { Storage } from '../utils/storage';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false); // Start with false to avoid hydration mismatch

  useEffect(() => {
    // Check if user has already made a choice
    const consent = Storage.getCookie('cookieConsent');
    console.log('Current cookie consent status:', consent);
    
    // Only show the banner if we do NOT have a consent choice yet
    if (consent !== 'accepted' && consent !== 'declined') {
      console.log('Showing banner - no consent choice found');
      setShowBanner(true);
    } else {
      console.log('Hiding banner due to existing choice:', consent);
    }
  }, []);

  const handleAccept = () => {
    console.log('Cookies accepted');
    Storage.setCookie('cookieConsent', 'accepted', { expires: 365 }); // Valid for 1 year
    setShowBanner(false);
  };

  const handleDecline = () => {
    console.log('Cookies declined');
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
        zIndex: 9999, // Ensure it's above everything
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
            <button
              onClick={handleDecline}
              style={{
                background: 'transparent',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '14px',
                cursor: 'pointer',
                color: '#495057',
                fontWeight: 500,
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f3f5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              style={{
                background: '#228be6',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '14px',
                cursor: 'pointer',
                color: 'white',
                fontWeight: 500,
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1c7ed6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#228be6'; }}
            >
              Accept
            </button>
          </Group>
        </Group>
      </Paper>
    </Box>
  );
} 