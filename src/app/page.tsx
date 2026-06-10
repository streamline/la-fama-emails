import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-purple-400">La Fama</span>
          <span className="text-gray-400"> Emails</span>
        </h1>
        <p className="text-gray-500 mb-8">Email marketing platform</p>
        <Link
          href="/admin"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Ir al Dashboard
        </Link>
      </div>
    </main>
  );
}