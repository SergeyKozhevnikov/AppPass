// src/app/(primary)/requests/drafts/page.tsx

import React from 'react';
import RequestList from '@/components/RequestList';

const DraftsPage: React.FC = () => {
  return (
    <div>
      <RequestList status="drafts" />
    </div>
  );
};

export default DraftsPage;