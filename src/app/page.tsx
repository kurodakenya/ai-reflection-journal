import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-lg text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          AI振り返りジャーナル
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          日記を書いて、AIが感情を分析。
          <br />
          自己理解と習慣化を支援するジャーナルアプリ
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/auth"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-blue-600 px-8 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
          >
            はじめる
          </Link>
        </div>
      </div>
    </div>
  );
}
