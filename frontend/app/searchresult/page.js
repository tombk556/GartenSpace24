import React, { Suspense } from 'react';
import SearchResultPage from './components/SearchResultPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SearchResultPage />
    </Suspense>
  );
}
