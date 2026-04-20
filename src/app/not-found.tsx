import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-bg)' }}>
      <p
        className="text-9xl font-light mb-4"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-accent)' }}
      >
        404
      </p>
      <h1
        className="text-3xl font-light mb-4"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
      >
        Page Not Found
      </h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
        The page you are looking for may have been moved or doesn&apos;t exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-8 py-3 text-sm font-semibold"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          Go Home
        </Link>
        <Link
          href="/products"
          className="px-8 py-3 text-sm font-semibold border"
          style={{ borderColor: 'var(--color-amoria-primary)', color: 'var(--color-amoria-primary)' }}
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
