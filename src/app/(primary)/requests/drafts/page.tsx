// src/app/(primary)/requests/drafts/page.tsx

import React from 'react';
import RequestList from '@/components/RequestList';

const DraftsPage: React.FC = () => {
  return (
    <div>
      <h1>Черновики</h1>
      <RequestList status="drafts" />
    </div>
  );
};

export default DraftsPage;