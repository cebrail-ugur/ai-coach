'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
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

    // Validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Tüm alanları doldurunuz');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Kayıt başarısız');
        return;
      }

      // Success - redirect to login
      alert('Kayıt başarılı! Lütfen giriş yapınız.');
      router.push('/auth/login');
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Signup error:', err);
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
          <p className="text-gray-400">Hesap oluştur</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Ad Soyad</label>
            <input
              type="text"
              name="fullName"
              placeholder="Adını gir"
              value={formData.fullName}
              onChange={handleChange}
              className="input-base"
              disabled={isLoading}
            />
          </div>

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
              placeholder="Güçlü bir şifre gir"
              value={formData.password}
              onChange={handleChange}
              className="input-base"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Şifre Onayla</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Şifreyi tekrar gir"
              value={formData.confirmPassword}
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
            {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-6">
          Zaten hesabın var mı?{' '}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
