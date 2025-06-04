// src/app/(primary)/requests/rejected/page.tsx

import React from 'react';
import RequestList from '@/components/RequestList';

const RejectedPage: React.FC = () => {
  return (
    <div>
      <RequestList status="4" />
    </div>
  );
};

export default RejectedPage;
