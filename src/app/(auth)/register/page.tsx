import Image from 'next/image';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left image */}
      <div className="hidden md:block relative">
        <Image
          src="/images/products/prod7.jpg"
          alt="Amoria Register"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tracking-[0.15em]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-accent)' }}>
            AMORIA
          </span>
          <p className="text-white/80 text-sm mt-2">Join the Fragrance Community</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-8 py-16" style={{ backgroundColor: 'var(--color-amoria-bg)' }}>
        <RegisterForm />
      </div>
    </div>
  );
}
