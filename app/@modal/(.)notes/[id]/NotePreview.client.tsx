'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

import Modal from '@/components/Modal/Modal';
import NotePreview from '@/components/NotePreview/NotePreview';
import { fetchNoteById } from '@/lib/api';

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const closeModal = () => {
    router.back();
  };

  return (
    <Modal onClose={closeModal}>
      <button type="button" onClick={closeModal} aria-label="Close modal">
        Close
      </button>

      {isLoading && <p>Loading, please wait...</p>}

      {(error || !note) && <p>Something went wrong.</p>}

      {note && <NotePreview note={note} />}
    </Modal>
  );
}