/* ==========================================================
   Portofolio Steven — interaksi
   1. Mosaik piksel hero
   2. Mosaik kecil di bagian sertifikasi
   3. Animasi mengetik nama di hero
   4. Animasi reveal saat scroll
   5. Form kontak (membuka aplikasi email)
   6. Pilihan bahasa Indonesia / Inggris
   7. Filter dan tampilkan proyek
   8. Penanda tautan navbar
   ========================================================== */

// 1. Mosaik piksel hero
(function () {
  const box = document.getElementById("pixels");
  if (!box) return;

  function build() {
    box.innerHTML = "";
    const cols = Math.max(16, Math.round(innerWidth / 48));
    const cell = innerWidth / cols;
    const rows = Math.max(3, Math.round(box.clientHeight / cell));
    box.style.gridTemplateColumns = `repeat(${cols},1fr)`;
    box.style.gridTemplateRows = `repeat(${rows},1fr)`;
    // Area wajah: blok piksel dijauhkan supaya wajah tetap terlihat
    const hero = box.parentElement;
    const fx = hero.clientWidth * 0.52,
      fy = hero.clientHeight * (innerWidth < 700 ? 0.42 : 0.4) - box.offsetTop;
    const fr = Math.max(cell * 2.2, hero.clientWidth * 0.045);
    for (let i = 0; i < cols * rows; i++) {
      const c = document.createElement("i");
      const cx = ((i % cols) + 0.5) * cell,
        cy = (Math.floor(i / cols) + 0.5) * (box.clientHeight / rows);
      if (Math.hypot(cx - fx, (cy - fy) * 1.3) < fr) c.dataset.face = "1";
      else if (Math.random() < 0.55) c.className = "on";
      box.appendChild(c);
    }
  }

  build();
  addEventListener("resize", build);

  setInterval(() => {
    const n = box.children.length;
    for (let k = 0; k < 8; k++) {
      const c = box.children[Math.floor(Math.random() * n)];
      if (c && !c.dataset.face) c.classList.toggle("on");
    }
  }, 350);
})();

// 2. Mosaik kecil di bagian sertifikasi
(function () {
  const m = document.getElementById("mosaic");
  if (!m) return;

  const total = 90;
  for (let i = 0; i < total; i++) {
    const c = document.createElement("i");
    if (Math.random() < 0.5) c.className = "on";
    m.appendChild(c);
  }

  setInterval(() => {
    for (let k = 0; k < 5; k++) {
      m.children[Math.floor(Math.random() * total)].classList.toggle("on");
    }
  }, 500);
})();

// 3. Animasi mengetik nama di hero
(function () {
  const parts = [...document.querySelectorAll(".typing-part")];
  if (!parts.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const fullText = parts.map((part) => part.textContent);
  parts.forEach((part) => {
    part.textContent = "";
  });

  let partIndex = 0;
  let charIndex = 0;

  function typeNext() {
    const text = fullText[partIndex];
    const character = text[charIndex];
    parts[partIndex].textContent = text.slice(0, charIndex + 1);
    charIndex += 1;

    if (charIndex === text.length) {
      partIndex += 1;
      charIndex = 0;
      if (partIndex === parts.length) return;
    }

    setTimeout(typeNext, character === " " ? 180 : 75);
  }

  setTimeout(typeNext, 350);
})();

// 4. Animasi reveal saat scroll
(function () {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));
})();

// 5. Form kontak -> membuka aplikasi email
(function () {
  const form = document.getElementById("form");
  if (!form) return;

  const result = document.getElementById("result");
  const btn = form.querySelector('button[type="submit"]');
  const success = document.getElementById("success");
  const successTitle = document.getElementById("success-title");
  const successText = document.getElementById("success-text");

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#em");
  const msgInput = form.querySelector("#ms");

  const text = {
    id: {
      subject: "Pesan dari",
      sending: "Mengirim...",
      fail: "Gagal mengirim: ",
      network: "Terjadi kesalahan jaringan. Coba lagi.",
      nameEmpty: "Nama tidak boleh kosong.",
      emailEmpty: "Email tidak boleh kosong.",
      emailInvalid: "Format email tidak valid, contoh: nama@email.com",
      msgEmpty: "Pesan tidak boleh kosong.",
      successTitle: "Pesan terkirim!",
      successText: "Terima kasih, saya akan segera membalasnya.",
    },
    en: {
      subject: "Message from",
      sending: "Sending...",
      fail: "Failed to send: ",
      network: "Network error. Please try again.",
      nameEmpty: "Name can't be empty.",
      emailEmpty: "Email can't be empty.",
      emailInvalid: "Invalid email format, e.g. name@email.com",
      msgEmpty: "Message can't be empty.",
      successTitle: "Message sent!",
      successText: "Thank you, I'll get back to you soon.",
    },
  };

  const getT = () => text[document.documentElement.lang === "en" ? "en" : "id"];

  function setError(input, message) {
    clearError(input);
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    const el = document.createElement("small");
    el.className = "err";
    el.textContent = message;
    input.insertAdjacentElement("afterend", el);
  }

  function clearError(input) {
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
    const next = input.nextElementSibling;
    if (next && next.classList.contains("err")) next.remove();
  }

  function validate() {
    const t = getT();
    let firstInvalid = null;
    const fail = (input, msg) => {
      setError(input, msg);
      if (!firstInvalid) firstInvalid = input;
    };

    [nameInput, emailInput, msgInput].forEach(clearError);
    result.textContent = "";

    if (!nameInput.value.trim()) fail(nameInput, t.nameEmpty);

    const email = emailInput.value.trim();
    if (!email) fail(emailInput, t.emailEmpty);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail(emailInput, t.emailInvalid);

    const msg = msgInput.value.trim();
    if (!msgInput.value.trim()) fail(msgInput, t.msgEmpty);

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  // Hapus error saat pengunjung mulai memperbaiki isian
  [nameInput, emailInput, msgInput].forEach((input) => {
    input.addEventListener("input", () => clearError(input));
  });

  let hideTimer;
  function showSuccess() {
    const t = getT();
    successTitle.textContent = t.successTitle;
    successText.textContent = t.successText;
    success.setAttribute("aria-hidden", "false");
    success.classList.remove("show");
    void success.offsetWidth; // restart animasi
    success.classList.add("show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideSuccess, 4500);
  }

  function hideSuccess() {
    success.classList.remove("show");
    success.setAttribute("aria-hidden", "true");
  }
  success.addEventListener("click", hideSuccess);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const t = getT();
    const nama = nameInput.value.trim();

    const data = new FormData(form);
    data.set("subject", `${t.subject} ${nama}`);
    data.set("from_name", nama);

    btn.disabled = true;
    result.style.color = "inherit";
    result.textContent = t.sending;

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        result.textContent = "";
        form.reset();
        showSuccess();
      } else {
        result.style.color = "";
        result.textContent = t.fail + json.message;
      }
    } catch (err) {
      result.style.color = "";
      result.textContent = t.network;
    } finally {
      btn.disabled = false;
    }
  });
})();

// 6. Pilihan bahasa Indonesia / Inggris
(function () {
  const translations = {
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.writing": "Writing",
    "nav.contact": "Contact",
    "hero.tagProblem": "problem solver",
    "hero.summary": "Full Stack Web Developer with an interest in machine learning. I build web applications from the database to the user interface, as well as useful data-driven systems.",
    "hero.more": "See more ↗",
    "about.hello": "Hi, I am Steven",
    "about.first": 'I am Steven, a <b>Bachelor of Informatics</b> graduate from <span class="hl">Universitas Mercu Buana Yogyakarta</span> with a strong interest in <b>full-stack web development</b> and <b>machine learning</b>.',
    "about.second":
      "I have experience developing web applications with <b>HTML, CSS, JavaScript, PHP, and Laravel</b>. I also understand data-driven system development with <b>Python</b> and <b>machine learning</b>, and I am familiar with <b>AI</b> technologies and database management.",
    "about.third":
      'I enjoy learning by doing and developing my skills through academic and real-world projects. I am passionate about building systems that are <span class="ul">functional, efficient, and easy to use</span>, while exploring new technologies and sharpening my problem-solving skills.',
    "about.degree": "BSc Informatics · UMBY 2026",
    "about.gpa": "GPA 3.65 / 4.00",
    "about.location": "Sleman, Yogyakarta",
    "about.download": "Download CV",
    "services.heading": 'A few <span class="circ">things I work on</span>',
    "services.webTitle": "Full-stack web applications.",
    "services.webDescription": "From database design and back-end development to user interfaces.",
    "services.viewProjects": "View projects →",
    "services.dataTitle": "Turning data into decisions.",
    "services.dataDescription": "Data analysis and predictive models for real-world problems.",
    "services.decisionSupport": "Decision Support Systems",
    "services.coordinationLabel": "03 · COORDINATION",
    "services.coordinationTitle": "Keeping projects on track.",
    "services.coordinationDescription": "Overseeing work, providing direction, and communicating with stakeholders.",
    "services.supervision": "Project supervision",
    "services.teamCoordination": "Team coordination",
    "services.timeManagement": "Time management",
    "services.viewExperience": "View experience →",
    "services.statement":
      "Good systems do not happen by accident. They are built through <em>clear thinking, strong analysis,</em> and <em>careful execution</em>. From database design to user interfaces, I aim to create things that are useful and ready to use. <br /><a class='btn' href='#kontak'>Let’s talk →</a>",
    "projects.kicker": "PORTFOLIO",
    "projects.heading": "Projects &amp; experience",
    "projects.filterAll": "All",
    "projects.filterProjects": "Projects",
    "projects.filterExperience": "Experience",
    "projects.projectLabel": "PROJECT",
    "projects.experienceLabel": "EXPERIENCE",
    "projects.showMore": "Show more",
    "projects.ricePredictionTitle": "National Rice Production Prediction",
    "projects.thesisLabel": "thesis · machine learning",
    "projects.ricePredictionDescription": "A national rice production forecasting system using Random Forest and GridSearchCV with climate and agricultural data.",
    "projects.riceDecisionTitle": "Rice Plant Disease Decision Support System",
    "projects.decisionLabel": "decision support system · web",
    "projects.riceDecisionDescription": "A web-based system that helps identify rice plant diseases and supports related decision-making.",
    "projects.dssStack": "DSS",
    "projects.printingTitle": "Screen Printing Service Website",
    "projects.wordpressLabel": "WordPress · web",
    "projects.printingDescription": "A website for a screen-printing service, featuring order management and a service catalog for customers.",
    "projects.catalogStack": "Catalog",
    "projects.ordersStack": "Orders",
    "projects.bootcampTitle": "GameLab Bootcamp",
    "projects.bootcampLabel": "full-stack web development · Apr–Jul 2025",
    "projects.bootcampDescription": "Hands-on front-end and back-end development, from design and database management to deployment using Laravel, Slim, Medoo, and Twig.",
    "projects.photoboothTitle": "PIENG Kafe Toleransi Photobooth",
    "projects.freelanceLabel": "freelance · Apr–May 2026",
    "projects.photoboothDescription": "Supervised and coordinated the photobooth project, communicating with stakeholders to ensure their requirements were met.",
    "projects.photoboothDetail": "View experience details",
    "projects.coordinationStack": "Coordination",
    "projects.supervisionStack": "Supervision",
    "projects.ctaTitle": "Let’s have a chat.",
    "projects.openToWork": "I’m open to talking with anyone.",
    "projects.contactMe": "Contact me →",
    "writing.heading": "Writing",
    "writing.articleLabel": "Article · Medium",
    "writing.articleOneSummary": "On analysis paralysis and postponing action while making too many plans—and learning to start with one small step instead of waiting for everything to be perfect.",
    "writing.articleTwoSummary": "A reflection on the wolf in <i>Fantastic Mr. Fox</i>, how pain shapes our defenses, and why surviving does not mean staying hard forever.",
    "writing.read": "Read on Medium",
    "certs.title": "Certifications &amp; Skills",
    "certs.certifications": "<span>01</span> Certifications",
    "certs.skills": "<span>02</span> Skills",
    "certs.technical": "Technical",
    "certs.soft": "Soft skills",
    "certs.teamSkills": "Analytical thinking, teamwork, communication, time management",
    "certs.problemSkills": "Problem-solving, adaptability, proactive learning",
    "contact.heading": "Contact &amp; Social Media",
    "contact.invitation": "Let’s build something meaningful together.",
    "contact.description": "I am open to Full Stack Web Developer roles, data-driven projects, or simply discussing technology.",
    "contact.socialPrompt": "Find me online",
    "contact.socialDescription": "I share projects, writing, favorite films, and what inspires me. Let’s connect and exchange stories.",
    "contact.socialProjects": "PROJECTS",
    "contact.socialWriting": "WRITING",
    "contact.socialFilms": "FILMS",
    "form.heading": "let’s start a conversation",
    "form.name": "NAME",
    "form.email": "EMAIL",
    "form.message": "MESSAGE",
    "form.submit": "Send message ↗",
    "footer.question": "Have something to discuss?",
    "footer.description": "I am ready to build something useful and reliable.",
    "footer.navigation": "Navigation",
    "footer.services": "Services",
    "footer.info": "Info",
    "footer.certifications": "Certifications",
    "footer.location": "Location",
  };
  const items = [...document.querySelectorAll("[data-i18n]")];
  const indonesianContent = new Map(items.map((item) => [item, item.innerHTML]));
  const languageButtons = document.querySelectorAll("[data-language]");
  const musicToggle = document.getElementById("music-toggle");
  const musicLabel = document.getElementById("music-label");
  const backgroundMusic = document.getElementById("background-music");
  let musicEnabled = false;

  function updateMusicLabel() {
    const labels = document.documentElement.lang === "en" ? { play: "Play Stuck — LANY", stop: "Turn music off" } : { play: "Putar Stuck — LANY", stop: "Matikan musik" };
    musicLabel.textContent = musicEnabled ? labels.stop : labels.play;
    musicToggle.setAttribute("aria-label", musicLabel.textContent);
    musicToggle.setAttribute("aria-pressed", String(musicEnabled));
  }

  function playMusicFrom82() {
    if (!musicEnabled || backgroundMusic.readyState < 1) return;
    if (backgroundMusic.currentTime === 0 || backgroundMusic.ended) {
      backgroundMusic.currentTime = Math.min(82, backgroundMusic.duration);
    }

    backgroundMusic
      .play()
      .then(() => {
        if (!musicEnabled) backgroundMusic.pause();
      })
      .catch((error) => {
        musicEnabled = false;
        updateMusicLabel();
        if (error.name !== "NotAllowedError") console.error("Pemutaran musik gagal:", error);
      });
  }

  backgroundMusic.addEventListener("loadedmetadata", playMusicFrom82, { once: true });
  backgroundMusic.addEventListener("ended", () => {
    musicEnabled = false;
    updateMusicLabel();
  });
  backgroundMusic.addEventListener("error", () => {
    musicEnabled = false;
    updateMusicLabel();
    console.error("File musik tidak dapat dimuat:", backgroundMusic.error);
  });
  if (backgroundMusic.readyState >= 1) playMusicFrom82();

  musicToggle.addEventListener("click", () => {
    musicEnabled = !musicEnabled;
    if (musicEnabled) playMusicFrom82();
    else backgroundMusic.pause();
    updateMusicLabel();
  });

  function setLanguage(language) {
    const english = language === "en";
    document.documentElement.lang = language;
    items.forEach((item) => {
      item.innerHTML = english ? translations[item.dataset.i18n] : indonesianContent.get(item);
    });
    const ariaTranslations = {
      "language.label": english ? "Choose language" : "Pilih bahasa",
      "nav.mainLabel": english ? "Main navigation" : "Navigasi utama",
      "projects.filtersLabel": english ? "Filter projects and experience" : "Filter proyek dan pengalaman",
      "contact.socialsLabel": english ? "Social media" : "Media sosial",
      "writing.carouselLabel": english ? "Medium articles carousel" : "Karusel tulisan Medium",
      "writing.slideOne": english ? "Article 1 of 2" : "Tulisan 1 dari 2",
      "writing.slideTwo": english ? "Article 2 of 2" : "Tulisan 2 dari 2",
      "writing.paginationLabel": english ? "Choose an article" : "Pilih tulisan",
      "writing.previous": english ? "Previous article" : "Tulisan sebelumnya",
      "writing.next": english ? "Next article" : "Tulisan berikutnya",
    };
    document.querySelectorAll("[data-i18n-aria]").forEach((item) => {
      item.setAttribute("aria-label", ariaTranslations[item.dataset.i18nAria]);
    });
    languageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
    });
    document.getElementById("page-description").content = english
      ? "Portfolio of Steven Andrian Pranata Wicaksono, an Informatics graduate interested in Full Stack Web Development and Machine Learning."
      : "Portofolio Steven Andrian Pranata Wicaksono, lulusan S1 Informatika dengan minat Full Stack Web Development dan Machine Learning.";
    document.querySelectorAll("[data-typewriter]").forEach((heading) => {
      heading.setAttribute("aria-label", heading.querySelector(".typewriter-text").textContent.trim());
    });
    updateMusicLabel();
    document.dispatchEvent(new Event("portfolio:languagechange"));
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
  setLanguage("id");
})();

// 7. Animasi mengetik berulang untuk judul proyek dan tulisan
(function () {
  const headings = [...document.querySelectorAll("[data-typewriter]")];
  if (!headings.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const timers = new Map();

  function startTyping(heading) {
    clearTimeout(timers.get(heading));

    const textElement = heading.querySelector(".typewriter-text");
    const reserve = heading.querySelector(".typewriter-reserve");
    const fullText = textElement.textContent.trim();
    const caret = document.createElement("span");
    caret.className = "typing-caret";
    caret.setAttribute("aria-hidden", "true");
    reserve.textContent = fullText;
    heading.setAttribute("aria-label", fullText);

    let position = 0;
    let deleting = false;

    function tick() {
      if (deleting) position -= 1;
      else position += 1;

      textElement.textContent = fullText.slice(0, position);
      textElement.append(caret);

      if (!deleting && position === fullText.length) {
        timers.set(heading, setTimeout(() => {
          deleting = true;
          tick();
        }, 3000));
        return;
      }

      if (deleting && position === 0) {
        timers.set(heading, setTimeout(() => {
          deleting = false;
          tick();
        }, 600));
        return;
      }

      timers.set(heading, setTimeout(tick, deleting ? 45 : 85));
    }

    textElement.textContent = "";
    textElement.append(caret);
    timers.set(heading, setTimeout(tick, 350));
  }

  headings.forEach(startTyping);
  document.addEventListener("portfolio:languagechange", () => {
    headings.forEach(startTyping);
  });
})();

// 7. Filter dan tampilkan proyek secara bertahap
(function () {
  const section = document.querySelector(".work");
  if (!section) return;

  const filters = [...section.querySelectorAll("[data-project-filter]")];
  const moreButton = section.querySelector("[data-projects-more]");
  const remainingLabel = section.querySelector("[data-projects-remaining]");
  const pageSize = 6;
  let activeCategory = "all";
  let visibleLimit = pageSize;

  function render() {
    const cards = [...section.querySelectorAll("[data-project-card]")];
    const matches = cards.filter((card) => activeCategory === "all" || card.dataset.category === activeCategory);
    const visibleCards = new Set(matches.slice(0, visibleLimit));

    cards.forEach((card) => {
      card.hidden = !visibleCards.has(card);
    });

    filters.forEach((button) => {
      const category = button.dataset.projectFilter;
      const count = category === "all" ? cards.length : cards.filter((card) => card.dataset.category === category).length;
      button.setAttribute("aria-pressed", String(category === activeCategory));
      button.querySelector("[data-filter-count]").textContent = count;
    });

    const remaining = Math.max(matches.length - visibleLimit, 0);
    moreButton.hidden = remaining === 0;
    remainingLabel.textContent = remaining ? `(${remaining})` : "";
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.projectFilter;
      visibleLimit = pageSize;
      render();
    });
  });

  moreButton.addEventListener("click", () => {
    visibleLimit += pageSize;
    render();
  });

  section.classList.add("projects-ready");
  render();
})();

// 8. Penanda tautan navbar sesuai posisi scroll
(function () {
  const nav = document.querySelector("nav");
  if (!nav) return;

  const links = [...nav.querySelectorAll('a[href^="#"]')];

  function updateActiveLink() {
    const threshold = nav.offsetHeight + 48;
    let activeLink = null;

    links.forEach((link) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target && target.getBoundingClientRect().top <= threshold) activeLink = link;
    });

    links.forEach((link) => {
      if (link === activeLink) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", updateActiveLink);
  updateActiveLink();
})();

// 7. Carousel tulisan
(function () {
  const carousel = document.querySelector("[data-writing-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector(".writing-track");
  const slides = [...carousel.querySelectorAll("[data-writing-slide]")];
  const dots = [...carousel.querySelectorAll("[data-writing-index]")];
  const currentLabel = carousel.querySelector("[data-writing-current]");
  let current = 0;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    currentLabel.textContent = String(current + 1).padStart(2, "0");

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
    });

    dots.forEach((dot, dotIndex) => {
      if (dotIndex === current) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  carousel.querySelector("[data-writing-prev]").addEventListener("click", () => showSlide(current - 1));
  carousel.querySelector("[data-writing-next]").addEventListener("click", () => showSlide(current + 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => showSlide(Number(dot.dataset.writingIndex)));
  });
  showSlide(0);
})();
