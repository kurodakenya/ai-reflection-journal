import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EditForm } from './EditForm';

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (!entry) {
    notFound();
  }

  return (
    <EditForm
      id={entry.id}
      initialContent={entry.content}
      initialTags={entry.tags ?? []}
      initialTemplate={entry.template_type ?? 'free'}
      initialDate={entry.entry_date}
    />
  );
}
