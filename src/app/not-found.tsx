import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center">
        <div className="text-8xl mb-6">🔗</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          This link page does not exist or has been removed.
        </p>
        <Link
          href="/"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Create Your Own Page
        </Link>
      </div>
    </div>
  );
}
