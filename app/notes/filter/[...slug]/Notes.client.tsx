'use client';

import css from '@/app/notes/NotesPage.module.css';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Link from 'next/link';

const PER_PAGE = 12;

type NotesClientProps = {
  tag?: NoteTag;
};

export default function NotesClient({ tag }: NotesClientProps) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['notes', page, search, tag],
        queryFn: () => fetchNotes({ search, page, perPage: PER_PAGE, tag }),
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    });

    const notes = data?.notes ?? [];
    const totalPages = data?.totalPages ?? 0;

    const handleSearch = useDebouncedCallback((value: string) => {
        setPage(1);
        setSearch(value);
    }, 500);

    return (
        <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
  Create note +
</Link>
      </header>

      {isLoading && <p>Loading, please wait...</p>}

      {isError && <p>Something went wrong.</p>}

      {notes.length > 0 && <NoteList notes={notes} />}

    </div>
    )
}