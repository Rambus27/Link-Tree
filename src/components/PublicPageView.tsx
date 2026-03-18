'use client';

import { useEffect } from 'react';
import PublicPage from './PublicPage';

interface PageData {
  publicId: string;
  config: any;
  viewCount: number;
}

export default function PublicPageView({ page }: { page: PageData }) {
  useEffect(() => {
    fetch(`/api/pages/${page.publicId}/view`, { method: 'POST' }).catch(() => {});
  }, [page.publicId]);

  return <PublicPage config={page.config} viewCount={page.viewCount} />;
}
