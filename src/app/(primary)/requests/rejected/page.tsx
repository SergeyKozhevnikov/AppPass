// src/app/(primary)/requests/rejected/page.tsx

import React from 'react';
import RequestList from '@/components/RequestList';

const RejectedPage: React.FC = () => {
  return (
    <div>
      <RequestList status="rejected" />
    </div>
  );
};

export default RejectedPage;
