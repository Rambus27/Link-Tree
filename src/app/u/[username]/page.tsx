import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicPageView from '@/components/PublicPageView';

async function getPage(username: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/username/${username}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.page;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const page = await getPage(params.username);
  if (!page) return { title: 'Page Not Found' };
  
  return {
    title: `@${params.username} | LinkTree`,
    description: page.config.bio || `Check out @${params.username}'s link page`,
    openGraph: {
      title: `@${params.username}`,
      description: page.config.bio,
      images: page.config.profileImage ? [page.config.profileImage] : [],
    },
  };
}

export default async function PageByUsername({ params }: { params: { username: string } }) {
  const page = await getPage(params.username);
  if (!page) notFound();
  
  return <PublicPageView page={page} />;
}
