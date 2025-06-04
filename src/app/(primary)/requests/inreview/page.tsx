// src/app/(primary)/requests/inReview/page.tsx

import React from 'react';
import RequestList from '@/components/RequestList';

const InReviewPage: React.FC = () => {
  return (
    <div>
      <RequestList status="3" />
    </div>
  );
};

export default InReviewPage;
