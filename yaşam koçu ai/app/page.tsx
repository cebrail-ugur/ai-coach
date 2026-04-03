export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f13] via-[#1a1a2e] to-[#0f0f13]">
      <div className="container mx-auto px-4 py-8 sm:py-20">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <h1 className="gradient-text text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in">
            AI Koç
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl px-2">
            Yapay zeka destekli kişisel koçluk. Hedeflerine ulaş, alışkanlıklarını
            güçlendir, potansiyelini keşfet.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 w-full sm:w-auto">
            <a
              href="/auth/login"
              className="btn-primary px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg flex-1 sm:flex-none"
            >
              Giriş Yap
            </a>
            <a
              href="/auth/signup"
              className="btn-secondary px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg flex-1 sm:flex-none"
            >
              Kayıt Ol
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-20 w-full">
            <div className="card border-blue-500/20 hover:border-blue-500/50 transition-colors">
              <h3 className="text-lg sm:text-xl font-bold mb-2">💬 Akıllı Sohbet</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Kişisel gelişim yolculuğunuzda her zaman yanınızda olan AI koçu.
              </p>
            </div>

            <div className="card border-purple-500/20 hover:border-purple-500/50 transition-colors">
              <h3 className="text-lg sm:text-xl font-bold mb-2">🎯 Hedef Yönetimi</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Hedeflerinizi belirleyin, takip edin ve başarı ile tamamlayın.
              </p>
            </div>

            <div className="card border-pink-500/20 hover:border-pink-500/50 transition-colors sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-2">📊 Alışkanlık Takibi</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Pozitif alışkanlık oluşturun ve ilerlemenizi görselleştirin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
