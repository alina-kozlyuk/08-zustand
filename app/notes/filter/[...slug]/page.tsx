import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';
import { Metadata } from "next"

export async function generateMetadata({ params }: NotesFilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const selectedTag = slug[0];

   const title =
    selectedTag === 'all'
      ? 'All Notes'
       : `Notes: ${selectedTag}`;
  
  const description =
    selectedTag === 'all'
      ? 'Browse all available notes'
      : `Browse notes in the ${selectedTag} category`;

  
  return {
    title,
    description,
     openGraph: {
    title,
      description,
    url: `https://notehub.com/notes/filter/${selectedTag}`,
    images: [
      {
      url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      width: 1200,
      height: 630,
      alt: 'NoteHub app preview',
    },
    ],
  },
  }
};

const PER_PAGE = 12;

type NotesFilterPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

const allowedTags: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const { slug } = await params;
  const selectedTag = slug[0];

  const tag =
    selectedTag === 'all' || !allowedTags.includes(selectedTag as NoteTag)
      ? undefined
      : (selectedTag as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () =>
      fetchNotes({
        search: '',
        page: 1,
        perPage: PER_PAGE,
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}