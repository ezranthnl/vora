import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// --- Supabase ---
const supabaseUrl = "https://eagsfjcsjmmholoekiln.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZ3NmamNzam1taG9sb2VraWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDg2NjAsImV4cCI6MjA2ODM4NDY2MH0.uG-6ofh_TwvuOLpboOp94PbG1FyBQrCerwutuuq0Xa8";
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Tampilkan testimoni dari Supabase ---
async function tampilkanTestimoni() {
  const { data, error } = await supabase
    .from("testimoni")
    .select("*")
    .order("id", { ascending: false });
    

    console.log("Hasil data dari Supabase:", data);


  const list = document.getElementById("testimoni-list");
  list.innerHTML = "";

  if (error) {
    console.error("Gagal ambil testimoni:", error.message);
    list.innerHTML = "<p>Gagal memuat testimoni 😢</p>";
    return;
  }

  if (data.length === 0) {
    list.innerHTML = "<p>Belum ada testimoni.</p>";
    return;
  }


  
 data.forEach((item) => {
  const div = document.createElement("div");
  div.className = "testimoni-card";

  const nama = item.nama || "Anonim";
  const namaSensor = sensorNama(nama);

  div.innerHTML = `
    <p><strong>${namaSensor}</strong></p>
    <p>"${item.pesan}"</p>
  `;
  list.appendChild(div);
});
function sensorNama(nama) {
  if (nama.length <= 2) {
    return nama[0] + "*";
  }
  return nama.slice(0, 2) + "*".repeat(nama.length - 2);
}

  
}

// --- Kirim testimoni ke Supabase + tampil popup ---
async function kirimTestimoni(nama, pesan) {
  const { data, error } = await supabase.from("testimoni").insert([{ nama, pesan }]);

  if (error) {
    console.error("Gagal kirim:", error.message);
  } else {
    console.log("Berhasil kirim:", data);
    await tampilkanTestimoni(); // refresh list
    document.getElementById("popup-thanks").classList.remove("hidden");
    document.getElementById("close-popup").addEventListener("click", () => {
      document.getElementById("popup-thanks").classList.add("hidden");
    });
  }
}

// --- Form submit ---
document.getElementById("testimoniForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nama = document.getElementById("nama").value;
  const pesan = document.getElementById("pesan").value;
  await kirimTestimoni(nama, pesan);
});

// --- DOM Loaded ---
document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Reveal on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".produk-item, .hero-text, .tentang-container")
    .forEach((el) => {
      el.classList.add("hidden");
      observer.observe(el);
    });

  // Detail produk
  if (window.location.pathname.includes("detail.html")) {
    const params = new URLSearchParams(window.location.search);
    const varian = params.get("varian");
    const data = detailData[varian];
    if (data) {
      document.title = `Detail Produk - ${data.nama} | VORA`;
      document.getElementById("detail-img").src = data.img;
      document.getElementById("detail-img").alt = data.nama;
      document.getElementById("detail-info").innerHTML = `
        <h2>${data.nama}</h2>
        <p><strong>Top Notes:</strong> ${data.top}</p>
        <p><strong>Middle Notes:</strong> ${data.middle}</p>
        <p><strong>Base Notes:</strong> ${data.base}</p>
        <p>${data.deskripsi}</p>
        <a class="btn" href="https://wa.me/6282115621635?text=Halo%20saya%20ingin%20memesan%20${data.nama}%20dari%20VORA" target="_blank">Pesan via WhatsApp</a>
      `;
    }
  }
// --- Efek Salju ---
function startSnowEffect() {
  const canvas = document.getElementById("snow-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const flakes = [];
  const numFlakes = 40;

  for (let i = 0; i < numFlakes; i++) {
    flakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      d: Math.random() * 1 + 0.5,
    });
  }

  function drawFlakes() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    flakes.forEach((f) => {
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
    });
    ctx.fill();
    moveFlakes();
  }

  function moveFlakes() {
    flakes.forEach((f) => {
      f.y += Math.pow(f.d, 2) + 0.5;
      f.x += Math.sin(f.y * 0.01) * 0.5;
      if (f.y > height) {
        f.y = 0;
        f.x = Math.random() * width;
      }
    });
  }

  function animate() {
    drawFlakes();
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  animate();
}

  // Musik
  const playBtn = document.getElementById("play-music-btn");
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (!localStorage.getItem("voraMusicWindow")) {
        const musicWindow = window.open("", "voraMusic", "width=1,height=1,left=-1000,top=-1000");
        if (musicWindow) {
          musicWindow.document.write(`
            <html><body style="margin:0;background:black;">
              <audio id="bgm" autoplay loop>
                <source src="assets/audio/backsound.mp3" type="audio/mpeg">
              </audio>
              <script>
                const audio = document.getElementById("bgm");
                audio.volume = 0.2;
                window.onbeforeunload = () => audio.pause();
              </script>
            </body></html>
          `);
          localStorage.setItem("voraMusicWindow", "true");
          playBtn.textContent = "Playing... 🎵";
          playBtn.disabled = true;
        } else {
          alert("Popup diblokir! Aktifkan pop-up untuk memutar musik.");
        }
      } else {
        alert("Musik sudah diputar di halaman sebelumnya.");
      }
    });
  }
  startSnowEffect();

  tampilkanTestimoni(); // ⬅️ ini wajib supaya testimoni muncul

});

// --- Data Produk ---
const detailData = {
  aethera: {
    nama: "Aethera",
    img: "assets/img/1.jpg",
    top: "Bergamot",
    middle: "White Tea, Green Tea",
    base: "White Musk",
    deskripsi:
      "Aethera adalah perpaduan wangi segar dan lembut. Cocok untuk suasana santai dan formal.",
  },
  lucida: {
    nama: "Lucida",
    img: "assets/img/2.jpg",
    top: "Lotus, Lavender",
    middle: "White Tea, Jasmine",
    base: "White Musk, Vanilla, Cedarwood",
    deskripsi:
      "Lucida hadir dengan kelembutan aroma lotus yang bercahaya. Cocok untuk pecinta floral.",
  },
  arden: {
    nama: "Arden",
    img: "assets/img/3.jpg",
    top: "Bergamot",
    middle: "Vanilla, Geranium",
    base: "Sandalwood, Cedarwood",
    deskripsi:
      "Arden menyegarkan dan maskulin dengan sentuhan sandalwood yang elegan.",
  },
};

