(function () {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const progress = document.getElementById("scroll-progress-bar");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (window.lucide) {
    window.lucide.createIcons();
  }

  function updateScrollUi() {
    const scrollTop = window.scrollY || root.scrollTop;
    const max = root.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, scrollTop / max) : 0;

    if (progress) {
      progress.style.width = `${ratio * 100}%`;
    }

    if (header) {
      header.classList.toggle("is-scrolled", scrollTop > 18);
    }
  }

  updateScrollUi();
  window.addEventListener("scroll", updateScrollUi, { passive: true });
  window.addEventListener("resize", updateScrollUi, { passive: true });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  document.querySelectorAll(".faq-list details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;
      document.querySelectorAll(".faq-list details[open]").forEach((other) => {
        if (other !== detail) {
          other.open = false;
        }
      });
    });
  });

  // Pre-fill the contact message when arriving from an industry card (?industry=…).
  const industryParam = new URLSearchParams(window.location.search).get("industry");
  if (industryParam) {
    const allowedIndustries = [
      "Healthcare", "Legal", "Finance", "Retail",
      "Manufacturing", "Technology", "Education"
    ];
    const message = document.getElementById("cf-message");
    if (message && allowedIndustries.includes(industryParam) && !message.value) {
      message.value = `I'm interested in cybersecurity support for our ${industryParam} organization.\n\n`;
    }
  }

  // Multi-step contact form (progressive enhancement — full form still works without JS).
  const stepForm = document.querySelector("form[data-multistep]");
  if (stepForm) {
    const steps = Array.from(stepForm.querySelectorAll(".form-step"));
    const backBtn = stepForm.querySelector("#cf-back");
    const nextBtn = stepForm.querySelector("#cf-next");
    const bar = stepForm.querySelector("#cf-progress");
    const label = stepForm.querySelector("#cf-step-label");

    if (steps.length > 1 && backBtn && nextBtn) {
      stepForm.classList.add("is-stepped");
      let current = 0;

      const render = (focus) => {
        steps.forEach((step, idx) => step.classList.toggle("is-active", idx === current));
        stepForm.classList.toggle("at-first", current === 0);
        stepForm.classList.toggle("at-last", current === steps.length - 1);
        if (bar) bar.style.width = `${((current + 1) / steps.length) * 100}%`;
        if (label) label.textContent = `Step ${current + 1} of ${steps.length}`;
        if (focus) {
          const field = steps[current].querySelector("input, select, textarea");
          if (field) field.focus();
        }
      };

      const stepValid = () => {
        const field = steps[current].querySelector("input, select, textarea");
        if (field && field.hasAttribute("required") && !field.checkValidity()) {
          field.reportValidity();
          return false;
        }
        return true;
      };

      const go = (n) => {
        current = Math.max(0, Math.min(steps.length - 1, n));
        render(true);
      };

      nextBtn.addEventListener("click", () => { if (stepValid()) go(current + 1); });
      backBtn.addEventListener("click", () => go(current - 1));

      // Enter advances instead of submitting early (except on the final step / textarea).
      stepForm.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        if (event.target.tagName === "TEXTAREA") return;
        if (current < steps.length - 1) {
          event.preventDefault();
          if (stepValid()) go(current + 1);
        }
      });

      render(false);
    }
  }

  // ---- Blog index: category filter (reads category from each card's .cat-chip) ----
  const blogGrid = document.getElementById("blog-grid");
  const blogFilters = document.getElementById("blog-filters");
  if (blogGrid && blogFilters) {
    const cards = Array.from(blogGrid.querySelectorAll(".article-card"));
    const categories = ["All"];
    cards.forEach((card) => {
      const chip = card.querySelector(".cat-chip");
      const cat = chip ? chip.textContent.trim() : "";
      card.dataset.category = cat;
      if (cat && !categories.includes(cat)) categories.push(cat);
    });
    categories.forEach((cat, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "blog-filter" + (idx === 0 ? " is-active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        blogFilters.querySelectorAll(".blog-filter").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        cards.forEach((card) => {
          card.style.display = cat === "All" || card.dataset.category === cat ? "" : "none";
        });
      });
      blogFilters.appendChild(btn);
    });
  }

  // ---- Newsletter placeholder (no provider connected yet) ----
  document.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-newsletter]");
    if (!form) return;
    event.preventDefault();
    const status = form.parentElement.querySelector(".newsletter-note");
    if (status) status.textContent = "Thanks! Sign-ups aren't live yet — connect Mailchimp/ConvertKit to enable them.";
  });

  // ---- Blog article enhancements: TOC, share, author bio, related posts, newsletter ----
  const articleBody = document.querySelector("article .article-body");
  if (articleBody) {
    const slugify = (t) =>
      t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

    // Auto table of contents from h2 headings
    const headings = Array.from(articleBody.querySelectorAll("h2"));
    if (headings.length >= 3) {
      const toc = document.createElement("nav");
      toc.className = "article-toc";
      toc.setAttribute("aria-label", "Table of contents");
      let items = "";
      headings.forEach((h, i) => {
        if (!h.id) h.id = slugify(h.textContent) || "section-" + (i + 1);
        items += `<li><a href="#${h.id}">${h.textContent}</a></li>`;
      });
      toc.innerHTML = `<p class="toc-title">On this page</p><ul>${items}</ul>`;
      articleBody.insertBefore(toc, articleBody.firstChild);
    }

    // Share buttons
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(document.title);
    const share = document.createElement("div");
    share.className = "article-share";
    share.innerHTML =
      '<span class="share-label">Share</span>' +
      `<a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"><i data-lucide="linkedin" aria-hidden="true"></i></a>` +
      `<a class="share-btn" href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener noreferrer" aria-label="Share on X"><i data-lucide="twitter" aria-hidden="true"></i></a>` +
      '<button class="share-btn" type="button" data-copy-link aria-label="Copy link"><i data-lucide="link" aria-hidden="true"></i></button>';
    articleBody.insertBefore(share, articleBody.firstChild);
    const copyBtn = share.querySelector("[data-copy-link]");
    if (copyBtn && navigator.clipboard) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          copyBtn.classList.add("copied");
          setTimeout(() => copyBtn.classList.remove("copied"), 1500);
        });
      });
    }

    // Related posts (same category first), author bio, and newsletter
    const posts = [
      { slug: "top-security-mistakes-moroccan-smes.html", title: "Top 10 Security Mistakes in Moroccan SMEs", cat: "SME Security" },
      { slug: "secure-wordpress-website-morocco.html", title: "How to Secure a WordPress Website in Morocco", cat: "Web Security" },
      { slug: "ransomware-moroccan-businesses.html", title: "What SMEs Should Know About Ransomware", cat: "Threats" },
      { slug: "iso-27001-checklist.html", title: "A Practical ISO 27001 Checklist for SMEs", cat: "Compliance" },
      { slug: "microsoft-365-security-morocco.html", title: "Microsoft 365 Security Settings to Change", cat: "Cloud Security" },
      { slug: "recognize-and-stop-phishing.html", title: "How to Recognize and Stop Phishing", cat: "Threats" },
      { slug: "network-hardening-basics.html", title: "Network Hardening Basics for Small Offices", cat: "Infrastructure" },
      { slug: "incident-response-plan-sme.html", title: "Incident Response: A One-Page Plan for SMEs", cat: "Response" },
      { slug: "zero-trust-explained-for-smes.html", title: "Zero Trust, Explained for SMEs", cat: "Architecture" },
      { slug: "cloud-security-basics-morocco.html", title: "Cloud Security Basics for Growing Businesses", cat: "Cloud Security" },
      { slug: "windows-server-hardening-checklist.html", title: "Windows Server & Desktop Hardening Checklist", cat: "Infrastructure" },
      { slug: "active-directory-security-basics.html", title: "Active Directory Security Basics for SMEs", cat: "Infrastructure" },
      { slug: "vulnerability-management-vs-one-off-scans.html", title: "Vulnerability Management vs One-Off Scans", cat: "Process" },
      { slug: "moroccan-cybersecurity-regulations-guide.html", title: "Moroccan Cybersecurity & Data Protection Regulations", cat: "Compliance" }
    ];
    const currentSlug = window.location.pathname.split("/").pop();
    const chipEl = document.querySelector(".page-hero .cat-chip");
    const currentCat = chipEl ? chipEl.textContent.trim() : "";
    let related = posts.filter((p) => p.slug !== currentSlug && p.cat === currentCat);
    if (related.length < 3) {
      related = related.concat(
        posts.filter((p) => p.slug !== currentSlug && !related.includes(p))
      );
    }
    related = related.slice(0, 3);

    const authorHtml =
      '<aside class="author-box">' +
      '<span class="author-avatar" aria-hidden="true"><img src="../assets/logo-mark.svg" width="40" height="40" alt="" /></span>' +
      '<div><strong>JectarOne</strong><p>Moroccan cybersecurity consultancy helping SMEs assess and improve their security posture. Individual author bios coming soon.</p></div>' +
      "</aside>";
    const relatedHtml = related.length
      ? '<section class="related-posts"><h2>Related reading</h2><div class="related-grid">' +
        related
          .map(
            (p) =>
              `<a class="related-card" href="${p.slug}"><span class="cat-chip">${p.cat}</span><strong>${p.title}</strong><span class="card-link">Read <i data-lucide="arrow-right" aria-hidden="true"></i></span></a>`
          )
          .join("") +
        "</div></section>"
      : "";
    const newsletterHtml =
      '<section class="newsletter"><div class="newsletter-inner">' +
      '<i data-lucide="mail-check" aria-hidden="true"></i>' +
      "<h2>Get practical security tips in your inbox</h2>" +
      "<p>Occasional, no-spam guidance for Moroccan SMEs. Unsubscribe anytime.</p>" +
      '<form class="newsletter-form" action="#" method="post" data-newsletter novalidate>' +
      '<input type="email" name="email" required placeholder="you@company.com" autocomplete="email" aria-label="Email address" />' +
      '<button class="btn btn-primary" type="submit">Subscribe <i data-lucide="arrow-right" aria-hidden="true"></i></button>' +
      "</form>" +
      '<p class="newsletter-note" id="nl-status">No newsletter provider is connected yet — this is a placeholder form.</p>' +
      "</div></section>";

    const extras = document.createElement("div");
    extras.innerHTML = authorHtml + relatedHtml + newsletterHtml;
    articleBody.appendChild(extras);

    if (window.lucide) window.lucide.createIcons();
  }
})();
