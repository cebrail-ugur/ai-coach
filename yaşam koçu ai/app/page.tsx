export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f13] via-[#1a1a2e] to-[#0f0f13]">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <h1 className="gradient-text text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            AI Koç
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl">
            Yapay zeka destekli kişisel koçluk. Hedeflerine ulaş, alışkanlıklarını
            güçlendir, potansiyelini keşfet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href="/dashboard/chat"
              className="btn-primary px-8 py-3 text-lg"
            >
              Başla
            </a>
            <a
              href="/dashboard"
              className="btn-secondary px-8 py-3 text-lg"
            >
              Panel
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full">
            <div className="card border-blue-500/20 hover:border-blue-500/50 transition-colors">
              <h3 className="text-xl font-bold mb-2">💬 Akıllı Sohbet</h3>
              <p className="text-gray-400">
                Kişisel gelişim yolculuğunuzda her zaman yanınızda olan AI koçu.
              </p>
            </div>

            <div className="card border-purple-500/20 hover:border-purple-500/50 transition-colors">
              <h3 className="text-xl font-bold mb-2">🎯 Hedef Yönetimi</h3>
              <p className="text-gray-400">
                Hedeflerinizi belirleyin, takip edin ve başarı ile tamamlayın.
              </p>
            </div>

            <div className="card border-pink-500/20 hover:border-pink-500/50 transition-colors">
              <h3 className="text-xl font-bold mb-2">📊 Alışkanlık Takibi</h3>
              <p className="text-gray-400">
                Pozitif alışkanlık oluşturun ve ilerlemenizi görselleştirin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
