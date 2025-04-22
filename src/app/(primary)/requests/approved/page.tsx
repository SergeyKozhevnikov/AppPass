// src/app/(primary)/requests/approved/page.tsx

import React from 'react';
import RequestList from '@/components/RequestList';

const ApprovedPage: React.FC = () => {
  return (
    <div>
      <h1>Согласованные</h1>
      <RequestList status="approved" />
    </div>
  );
};

export default ApprovedPage;
