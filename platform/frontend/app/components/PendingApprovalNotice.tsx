import React from 'react';
import { Alert } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

export default function PendingApprovalNotice() {
  return (
    <Alert
      icon={<IconExclamationCircle />}
      title="Pending Approval"
      color="yellow"
      variant="filled"
      style={{ margin: '2em auto', maxWidth: 400 }}
    >
      Your account is awaiting admin approval. You will receive an email when approved. If you have questions, please contact support.
    </Alert>
  );
} 