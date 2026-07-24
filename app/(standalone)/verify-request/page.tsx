export default function VerifyRequestPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/30 p-8 text-center">
      <h1 className="mb-4 text-2xl font-bold text-white">Check your email</h1>
      <p className="text-neutral-400">
        We&apos;ve sent a verification link to your email address. Click it to
        finish signing in.
      </p>
      <p className="mt-4 text-sm text-neutral-500">
        If you don&apos;t see it, check your spam folder.
      </p>
    </div>
  );
}
