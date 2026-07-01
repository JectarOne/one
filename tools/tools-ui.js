/* JectarOne tools — shared front-end helpers for the network tools. */
(function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  var ICON = { pass: "check-circle-2", warn: "alert-triangle", fail: "x-circle", info: "info" };

  function row(status, name, desc, value) {
    return '<div class="result-row">' +
      '<i class="r-ico r-' + status + '" data-lucide="' + (ICON[status] || "info") + '" aria-hidden="true"></i>' +
      '<div><strong>' + esc(name) + "</strong>" +
      (desc ? '<div class="r-desc">' + esc(desc) + "</div>" : "") + "</div>" +
      '<div class="r-val">' + (value ? esc(value) : "") + "</div>" +
      "</div>";
  }

  function gradeHead(grade, title, sub) {
    var g = grade === "A+" ? "Aplus" : grade;
    return '<div class="grade-head">' +
      '<span class="grade-badge grade-' + g + '">' + esc(grade) + "</span>" +
      "<div><h3>" + title + "</h3>" + (sub ? "<p>" + sub + "</p>" : "") + "</div></div>";
  }

  function cta() {
    return '<div class="tool-note" style="margin-top:1.2rem;">' +
      '<i data-lucide="shield-alert" aria-hidden="true"></i>' +
      '<span>This is an automated surface check. For a thorough review, ' +
      '<a href="../index.html#contact" style="color:var(--accent);font-weight:600;">request a security assessment</a>.</span></div>';
  }

  function run(opts) {
    var btn = opts.btn, statusEl = opts.statusEl, resultEl = opts.resultEl;
    var raw = (opts.url || "").trim();
    if (!raw) return;
    var original = btn.innerHTML;
    btn.disabled = true;
    resultEl.classList.add("is-hidden");
    resultEl.innerHTML = "";
    statusEl.style.display = "flex";
    statusEl.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>Checking ' + esc(raw) + " …</span>";

    fetch(opts.endpoint + "?url=" + encodeURIComponent(raw), { headers: { "Accept": "application/json" } })
      .then(function (res) { return res.json().then(function (d) { return { ok: res.ok, d: d }; }); })
      .then(function (r) {
        statusEl.style.display = "none";
        if (!r.ok || !r.d || r.d.ok === false) {
          resultEl.innerHTML = row("fail", "Could not complete the check", (r.d && r.d.error) || "Unexpected error.", null);
        } else {
          resultEl.innerHTML = opts.render(r.d);
        }
        resultEl.classList.remove("is-hidden");
        if (window.lucide) window.lucide.createIcons();
      })
      .catch(function () {
        statusEl.style.display = "none";
        resultEl.innerHTML = row("fail", "Request failed", "Could not reach the checker service. Try again shortly.", null);
        resultEl.classList.remove("is-hidden");
        if (window.lucide) window.lucide.createIcons();
      })
      .then(function () { btn.disabled = false; btn.innerHTML = original; if (window.lucide) window.lucide.createIcons(); });
  }

  window.JOTools = { esc: esc, row: row, gradeHead: gradeHead, cta: cta, run: run };
})();
