// src/app/(primary)/requests/rejected/page.tsx

import React from 'react';
import RequestList from '@/components/RequestList';

const RejectedPage: React.FC = () => {
  return (
    <div>
      <h1>Отклоненные</h1>
      <RequestList status="rejected" />
    </div>
  );
};

export default RejectedPage;
