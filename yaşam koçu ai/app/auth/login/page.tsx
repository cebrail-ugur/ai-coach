'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email ve şifre gerekli');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Giriş başarısız');
        return;
      }

      // Success - redirect to dashboard
      alert('Giriş başarılı! 🎉');
      router.push('/');
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f13] via-[#1a1a2e] to-[#0f0f13] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">AI Koç</h1>
          <p className="text-gray-400">Giriş Yap</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Email</label>
            <input
              type="email"
              name="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={handleChange}
              className="input-base"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Şifre</label>
            <input
              type="password"
              name="password"
              placeholder="Şifreni gir"
              value={formData.password}
              onChange={handleChange}
              className="input-base"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-2 disabled:opacity-50"
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        {/* Demo Login */}
        <div className="card mt-4 bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-gray-400 mb-3">🔓 Demo Hesabı</p>
          <p className="text-xs text-gray-500 mb-3">
            Test için şu bilgileri kullanabilirsin:
          </p>
          <div className="space-y-2 mb-3">
            <p className="text-xs">
              <span className="text-gray-400">Email:</span>
              <br />
              <span className="font-mono text-blue-400">demo@example.com</span>
            </p>
            <p className="text-xs">
              <span className="text-gray-400">Şifre:</span>
              <br />
              <span className="font-mono text-blue-400">demo123456</span>
            </p>
          </div>
        </div>

        {/* Signup Link */}
        <p className="text-center text-gray-400 mt-6">
          Hesabın yok mu?{' '}
          <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
