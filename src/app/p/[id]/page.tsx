import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicPageView from '@/components/PublicPageView';

async function getPage(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/pages/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.page;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const page = await getPage(params.id);
  if (!page) return { title: 'Page Not Found' };
  
  return {
    title: `${page.config.title} | LinkTree`,
    description: page.config.bio || `Check out ${page.config.title}'s link page`,
    openGraph: {
      title: page.config.title,
      description: page.config.bio,
      images: page.config.profileImage ? [page.config.profileImage] : [],
    },
  };
}

export default async function PageById({ params }: { params: { id: string } }) {
  const page = await getPage(params.id);
  if (!page) notFound();
  
  return <PublicPageView page={page} />;
}
