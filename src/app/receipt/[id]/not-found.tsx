export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Receipt not found</h1>
      <p className="mt-2 text-neutral-500">
        This receipt doesn&rsquo;t exist or the server was restarted.
      </p>
      <a href="/generate" className="mt-6 text-sm underline underline-offset-4 hover:text-neutral-800">
        Create a new receipt
      </a>
    </main>
  );
}
