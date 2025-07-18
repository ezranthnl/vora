// main.js - Efek interaktif ringan untuk VORA

document.addEventListener("DOMContentLoaded", () => {
  // Logo scroll to top
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

  // Detail produk dinamis
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

  // Musik background play 1x seumur hidup halaman
  const playBtn = document.getElementById("play-music-btn");

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (!localStorage.getItem("voraMusicWindow")) {
        const musicWindow = window.open(
          "",
          "voraMusic",
          "width=1,height=1,left=-1000,top=-1000"
        );
        if (musicWindow) {
          musicWindow.document.write(`
            <html>
              <body style="margin:0;background:black;">
                <audio id="bgm" autoplay loop>
                  <source src="assets/audio/backsound.mp3" type="audio/mpeg">
                </audio>
                <script>
                  const audio = document.getElementById("bgm");
                  audio.volume = 0.2;
                  window.onbeforeunload = () => audio.pause();
                <\/script>
              </body>
            </html>
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

  // Efek salju
  startSnowEffect();

  // Testimoni form
  const form = document.getElementById("testimoniForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const nama = document.getElementById("nama").value;
      const pesan = document.getElementById("pesan").value;
      const rating = document.querySelector('input[name="rating"]:checked');

      if (!rating) {
        alert("Silakan beri rating sebelum mengirim testimoni.");
        return;
      }

      const { data, error } = await supabase.from("testimoni").insert([
        {
          nama,
          pesan,
          rating: parseInt(rating.value),
        },
      ]);

      if (error) {
        alert("Gagal mengirim testimoni. Silakan coba lagi.");
        console.error(error);
        return;
      }

      alert(`Terima kasih, ${nama}! Testimoni kamu telah dikirim.`);
      form.reset();
      ambilTestimoni();
    });
  }

  // Ambil testimoni jika ada elemen list
  if (document.getElementById("testimoni-list")) {
    ambilTestimoni();
  }
});

// Data produk
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

// Efek salju ringan
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
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
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

async function ambilTestimoni() {
  const { data, error } = await supabase
    .from("testimoni")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Gagal ambil testimoni:", error.message);
    return;
  }

  const listEl = document.getElementById("testimoni-list");
  listEl.innerHTML = "";

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "testimoni-item";
    div.innerHTML = `
      <h4>${item.nama}</h4>
      <div class="rating">${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}</div>
      <p>${item.pesan}</p>
    `;
    listEl.appendChild(div);
  });
}

