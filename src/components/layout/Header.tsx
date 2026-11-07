import Link from 'next/link';
import { signout } from '@/app/auth/actions';

type HeaderProps = {
  email: string;
};

export function Header({ email }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="text-lg font-bold text-gray-900 dark:text-white"
        >
          AI振り返りジャーナル
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
            {email}
          </span>
          <form action={signout}>
            <button
              type="submit"
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
