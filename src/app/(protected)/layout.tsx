import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { DEMO_MODE, DEMO_USER } from '@/lib/demo';

export const instant = false;

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  let email = '';

  if (DEMO_MODE) {
    email = DEMO_USER.email;
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/auth');
    }
    email = user.email ?? '';
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Header email={email} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-20 sm:px-6 md:pb-6">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
