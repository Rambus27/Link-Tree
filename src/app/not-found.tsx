import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-8xl mb-6">🔍</p>
        <h1 className="text-4xl font-bold mb-4">Page not found</h1>
        <p className="text-white/50 mb-8">
          This link page doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-all hover:scale-105"
        >
          Create your own page →
        </Link>
      </div>
    </div>
  );
}
