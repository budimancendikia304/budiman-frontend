<?php
try {
    $db = new PDO('mysql:host=127.0.0.1;dbname=BudimanCendikia', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $db->query("SELECT `key`, `value` FROM settings");
    $settings = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $settings[$row['key']] = $row['value'];
    }
} catch (PDOException $e) {
    $settings = [];
}

$instagram_title = isset($settings['instagram_title']) ? $settings['instagram_title'] : 'Yuk, Kepoin Keseruan Kami di Instagram';
$instagram_description = isset($settings['instagram_description']) ? $settings['instagram_description'] : 'Mulai dari keseruan belajar di kelas, tawa ceria saat bermain, hingga momen-momen penuh prestasi. Semuanya kami bagikan lewat cerita harian dan galeri foto aesthetic di Instagram. Yuk, follow biar nggak ketinggalan keseruannya!';
$instagram_url = isset($settings['instagram_url']) ? $settings['instagram_url'] : 'https://www.instagram.com/sat_almanshurah/';
$instagram_username = isset($settings['instagram_username']) ? $settings['instagram_username'] : 'sat_almanshurah';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Budiman Cendikia - Portal Sekolah</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom Styles conforming to the strict palette */
        body {
            background-color: #ffffff;
            color: #0B6B69;
        }
    </style>
</head>
<body class="antialiased">

    <!-- Section Fasilitas Unggulan -->
    <section id="fasilitas" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <span class="text-[#2FCFC9] font-black uppercase tracking-[0.2em] text-xs mb-3 block">Fasilitas</span>
                <h2 class="text-4xl font-black text-[#0B6B69] tracking-tight uppercase">Fasilitas Unggulan</h2>
                <div class="h-1.5 w-24 bg-[#2FCFC9] mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Kartu Fasilitas 1 -->
                <div class="bg-[#C8F7F5] rounded-[24px] overflow-hidden border border-[#2FCFC9] p-2 shadow-sm flex flex-col">
                    <div class="aspect-video bg-white/50 rounded-[18px] overflow-hidden flex items-center justify-center p-4 border border-[#7EE6E3]">
                        <span class="text-5xl">🔬</span>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-black text-[#0B6B69] mb-2">Laboratorium Sains</h3>
                        <p class="text-[#0B6B69]/80 text-sm font-medium leading-relaxed">Laboratorium modern dengan peralatan lengkap untuk praktikum fisika, kimia, dan biologi.</p>
                    </div>
                </div>

                <!-- Kartu Fasilitas 2 -->
                <div class="bg-[#C8F7F5] rounded-[24px] overflow-hidden border border-[#2FCFC9] p-2 shadow-sm flex flex-col">
                    <div class="aspect-video bg-white/50 rounded-[18px] overflow-hidden flex items-center justify-center p-4 border border-[#7EE6E3]">
                        <span class="text-5xl">💻</span>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-black text-[#0B6B69] mb-2">Lab Komputer & Multimedia</h3>
                        <p class="text-[#0B6B69]/80 text-sm font-medium leading-relaxed">Fasilitas komputer spesifikasi tinggi untuk menunjang pembelajaran coding dan desain grafis.</p>
                    </div>
                </div>

                <!-- Kartu Fasilitas 3 -->
                <div class="bg-[#C8F7F5] rounded-[24px] overflow-hidden border border-[#2FCFC9] p-2 shadow-sm flex flex-col">
                    <div class="aspect-video bg-white/50 rounded-[18px] overflow-hidden flex items-center justify-center p-4 border border-[#7EE6E3]">
                        <span class="text-5xl">📚</span>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-black text-[#0B6B69] mb-2">Perpustakaan Digital</h3>
                        <p class="text-[#0B6B69]/80 text-sm font-medium leading-relaxed">Ribuan koleksi buku digital dan fisik yang dapat diakses dengan mudah oleh seluruh siswa.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

   // Prestasi
   <section id="prestasi" className="py-16 bg-[#C8F7F5]">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold mb-10 text-[#0B6B69]">Prestasi Siswa</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Kartu Prestasi */}
      <div className="p-6 rounded-2xl shadow-lg border border-[#7EE6E3] bg-white">
        <h3 className="text-xl font-bold mb-2 text-[#0B6B69]">Juara 1 Pencak Silat</h3>
        <p className="text-[#0B6B69]">Prestasi membanggakan tingkat lokal.</p>
      </div>
    </div>
  </div>
</section>
    <!-- Section Instagram -->
    <section id="instagram" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6">
            <div class="bg-[#C8F7F5] rounded-[40px] p-8 md:p-12 border border-[#2FCFC9] flex flex-col md:flex-row items-center justify-between gap-10">
                <div class="flex-1 text-center md:text-left">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-[#7EE6E3]/20 text-[#0B6B69] rounded-full mb-6">
                        <svg class="w-4 h-4 text-[#2FCFC9]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        <span class="text-[10px] font-black uppercase tracking-widest">Momen Harian</span>
                    </div>
                    <h2 class="text-3xl md:text-4xl font-black text-[#0B6B69] tracking-tight mb-4 uppercase">
                        <?php echo htmlspecialchars($instagram_title); ?>
                    </h2>
                    <p class="text-[#0B6B69] font-medium text-lg leading-relaxed max-w-xl">
                        <?php echo htmlspecialchars($instagram_description); ?>
                    </p>
                    <div class="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                        <a 
                            href="<?php echo htmlspecialchars($instagram_url); ?>" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="px-10 py-4 bg-[#0FA8A4] hover:bg-[#0B6B69] text-white hover:text-[#C8F7F5] font-black rounded-2xl shadow-xl shadow-[#0FA8A4]/20 hover:-translate-y-1 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
                        >
                            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            Follow Instagram Kami
                        </a>
                    </div>
                </div>
                <a 
                    href="<?php echo htmlspecialchars($instagram_url); ?>" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="w-full md:w-1/3 aspect-square max-w-[300px] relative block hover:scale-105 transition-all duration-300"
                >
                    <div class="absolute inset-0 bg-[#7EE6E3] rounded-[48px] rotate-6"></div>
                    <div class="absolute inset-0 bg-white rounded-[48px] shadow-xl flex items-center justify-center p-10 border border-[#2FCFC9]">
                        <svg class="absolute w-[120px] h-[120px] text-[#2FCFC9] opacity-10" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        <div class="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <div class="w-24 h-24 rounded-3xl bg-[#0B6B69] flex items-center justify-center text-[#2FCFC9] shadow-lg">
                                <svg class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </div>
                            <div class="text-center">
                                <p class="font-black text-[#0B6B69] leading-none mb-1">@<?php echo htmlspecialchars($instagram_username); ?></p>
                                <p class="text-[10px] font-bold text-[#0B6B69]/60 uppercase tracking-widest">Official Instagram</p>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </section>

    <!-- Lightbox Modal -->
    <div id="lightboxModal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4" style="background-color: rgba(11, 107, 105, 0.8);" onclick="closeLightbox()">
        <button class="absolute top-6 right-6 text-[#C8F7F5] hover:text-[#2FCFC9] transition-colors bg-[#0B6B69] p-3 rounded-full shadow-lg" onclick="closeLightbox()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div class="bg-white rounded-[32px] overflow-hidden max-w-3xl w-full border border-[#7EE6E3] shadow-2xl" onclick="event.stopPropagation()">
            <div class="aspect-video bg-[#C8F7F5]/20 flex items-center justify-center p-8 border-b border-[#7EE6E3]">
                <img id="lightboxImage" src="" alt="" class="max-h-full max-w-full object-contain rounded-xl">
            </div>
            <div class="p-8">
                <h3 id="lightboxTitle" class="text-2xl font-black text-[#0B6B69] mb-3"></h3>
                <p id="lightboxDescription" class="text-[#0B6B69]/90 font-medium leading-relaxed"></p>
            </div>
        </div>
    </div>

    <script>
        function openLightbox(imgUrl, title, desc) {
            document.getElementById('lightboxImage').src = imgUrl;
            document.getElementById('lightboxTitle').innerText = title;
            document.getElementById('lightboxDescription').innerText = desc;
            const modal = document.getElementById('lightboxModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeLightbox() {
            const modal = document.getElementById('lightboxModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    </script>

</body>
</html>
