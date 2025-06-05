// src/app/(primary)/requests/approved/page.tsx

import React from 'react';
import RequestList from '@/components/RequestList';

const ApprovedPage: React.FC = () => {
  return (
    <div>
      <RequestList status="2" />
    </div>
  );
};

export default ApprovedPage;
