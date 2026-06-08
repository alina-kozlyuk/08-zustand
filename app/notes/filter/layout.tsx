import css from './LayoutNotes.module.css';

type NotesFilterLayoutProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export default function NotesFilterLayout({
  children,
  sidebar,
}: NotesFilterLayoutProps) {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <aside className={css.sidebar}>{sidebar}</aside>
        <section className={css.notesWrapper}>{children}</section>
      </div>
    </main>
  );
}