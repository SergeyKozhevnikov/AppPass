// src/app/(primary)/requests/inReview/page.tsx

import React from 'react';
import RequestList from '@/components/RequestList';

const InReviewPage: React.FC = () => {
  return (
    <div>
      <h1>На согласовании</h1>
      <RequestList status="inReview" />
    </div>
  );
};

export default InReviewPage;
