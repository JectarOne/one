/*
 * JectarOne — Cybersecurity Risk Scorecard (lead magnet)
 * Self-contained: injects a floating trigger + a modal quiz. Multilingual
 * (en/fr/ar) driven by <html lang>. Submits the lead + result to the
 * existing secured contact handler (honeypot + rate-limit + validation).
 * Repoint by changing WEBHOOK below.
 */
(function () {
  "use strict";

  var WEBHOOK = "/send-contact.php"; // reuses the secured contact backend
  var LANG = (document.documentElement.lang || "en").slice(0, 2);
  if (["en", "fr", "ar"].indexOf(LANG) === -1) LANG = "en";
  var contactHref = document.getElementById("contact") ? "#contact" : "/";

  var t = {
    trigger: { en: "Risk Score", fr: "Évaluer le risque", ar: "قياس المخاطر" },
    title: {
      en: "Cybersecurity Risk Scorecard",
      fr: "Évaluation du risque cybersécurité",
      ar: "بطاقة تقييم مخاطر الأمن السيبراني"
    },
    intro: {
      en: "5 quick questions · about 2 minutes. No jargon.",
      fr: "5 questions rapides · environ 2 minutes. Sans jargon.",
      ar: "5 أسئلة سريعة · دقيقتان تقريباً. بدون مصطلحات معقدة."
    },
    step: {
      en: function (i, n) { return "Question " + i + " of " + n; },
      fr: function (i, n) { return "Question " + i + " sur " + n; },
      ar: function (i, n) { return "السؤال " + i + " من " + n; }
    },
    back: { en: "Back", fr: "Retour", ar: "رجوع" },
    next: { en: "Next", fr: "Suivant", ar: "التالي" },
    leadTitle: { en: "Get your results", fr: "Recevez vos résultats", ar: "احصل على نتيجتك" },
    leadIntro: {
      en: "Where should we send your score and recommendations?",
      fr: "Où envoyer votre score et nos recommandations ?",
      ar: "أين نرسل نتيجتك وتوصياتنا؟"
    },
    fName: { en: "Full name", fr: "Nom complet", ar: "الاسم الكامل" },
    fCompany: { en: "Company", fr: "Entreprise", ar: "الشركة" },
    fEmail: { en: "Business email", fr: "E-mail professionnel", ar: "البريد الإلكتروني المهني" },
    fPhone: { en: "Phone (optional)", fr: "Téléphone (optionnel)", ar: "الهاتف (اختياري)" },
    submit: { en: "See my score", fr: "Voir mon score", ar: "عرض نتيجتي" },
    sending: { en: "Sending…", fr: "Envoi…", ar: "جارٍ الإرسال…" },
    nda: {
      en: "100% Confidential. NDA signed prior to any assessment.",
      fr: "100% Confidentiel. Accord de confidentialité (NDA) signé avant toute évaluation.",
      ar: "سرية تامة 100٪. نوقع اتفاقية عدم إفشاء الأسرار (NDA) قبل التقييم."
    },
    scoreLabel: {
      en: function (s) { return "Your score: " + s + " / 15"; },
      fr: function (s) { return "Votre score : " + s + " / 15"; },
      ar: function (s) { return "نتيجتك: " + s + " / 15"; }
    },
    riskName: {
      high: { en: "High Risk", fr: "Risque élevé", ar: "مخاطر عالية" },
      medium: { en: "Medium Risk", fr: "Risque moyen", ar: "مخاطر متوسطة" },
      low: { en: "Low Risk", fr: "Risque faible", ar: "مخاطر منخفضة" }
    },
    riskMsg: {
      high: {
        en: "Your answers point to critical gaps that attackers commonly exploit. We recommend a security assessment as soon as possible.",
        fr: "Vos réponses révèlent des lacunes critiques souvent exploitées. Nous recommandons un audit de sécurité au plus vite.",
        ar: "تشير إجاباتك إلى ثغرات حرجة كثيراً ما تُستغل. نوصي بإجراء تقييم أمني في أقرب وقت."
      },
      medium: {
        en: "You have some solid practices but notable operational gaps. A targeted assessment will help you prioritize what to fix first.",
        fr: "Vous avez de bonnes pratiques mais des lacunes notables. Un audit ciblé vous aidera à prioriser les corrections.",
        ar: "لديك ممارسات جيدة لكن توجد ثغرات ملحوظة. سيساعدك تقييم موجّه على ترتيب أولويات الإصلاح."
      },
      low: {
        en: "Strong posture. Consider a penetration test to validate your defenses against real-world attacks.",
        fr: "Bonne posture. Envisagez un test d'intrusion pour valider vos défenses face à des attaques réelles.",
        ar: "وضع أمني جيد. فكّر في اختبار اختراق للتحقق من دفاعاتك أمام الهجمات الحقيقية."
      }
    },
    resultCta: { en: "Talk to a consultant", fr: "Parler à un consultant", ar: "تحدث إلى مستشار" },
    retake: { en: "Retake", fr: "Recommencer", ar: "إعادة" },
    close: { en: "Close", fr: "Fermer", ar: "إغلاق" }
  };
  function tr(key) { var e = t[key]; return e[LANG] || e.en; }

  var questions = [
    { id: "backups", q: { en: "How do you back up critical business data?", fr: "Comment sauvegardez-vous vos données critiques ?", ar: "كيف تقوم بنسخ بياناتك الحيوية احتياطياً؟" },
      opts: [
        { s: 3, en: "Daily, offsite & encrypted", fr: "Quotidienne, distante et chiffrée", ar: "يومياً، مشفرة وفي مكان منفصل" },
        { s: 1, en: "Local external drives", fr: "Disques durs externes locaux", ar: "أقراص خارجية محلية" },
        { s: 0, en: "Irregular or never", fr: "Irrégulière ou jamais", ar: "غير منتظمة أو لا توجد" }
      ] },
    { id: "mfa", q: { en: "Do you enforce Multi-Factor Authentication (MFA)?", fr: "Appliquez-vous l'authentification multifacteur (MFA) ?", ar: "هل تطبق المصادقة متعددة العوامل (MFA)؟" },
      opts: [
        { s: 3, en: "Required for all systems", fr: "Obligatoire pour tous les systèmes", ar: "مفروضة على جميع الأنظمة" },
        { s: 1, en: "Admin accounts only", fr: "Comptes administrateurs uniquement", ar: "لحسابات المسؤولين فقط" },
        { s: 0, en: "Passwords only", fr: "Mots de passe uniquement", ar: "كلمات المرور فقط" }
      ] },
    { id: "assessments", q: { en: "When did you last run a vulnerability assessment?", fr: "À quand remonte votre dernier audit de vulnérabilités ?", ar: "متى كان آخر تقييم للثغرات لديك؟" },
      opts: [
        { s: 3, en: "Within the last 12 months", fr: "Au cours des 12 derniers mois", ar: "خلال الـ 12 شهراً الماضية" },
        { s: 1, en: "Over a year ago", fr: "Il y a plus d'un an", ar: "منذ أكثر من عام" },
        { s: 0, en: "Never tested", fr: "Jamais effectué", ar: "لم يسبق إجراؤه" }
      ] },
    { id: "awareness", q: { en: "How do employees handle phishing attempts?", fr: "Comment vos employés gèrent-ils le phishing ?", ar: "كيف يتعامل الموظفون مع محاولات الاحتيال؟" },
      opts: [
        { s: 3, en: "Trained with regular simulations", fr: "Formés avec simulations régulières", ar: "تدريب منتظم واختبارات محاكاة" },
        { s: 1, en: "Informal occasional reminders", fr: "Rappels informels occasionnels", ar: "تنبيهات غير منتظمة" },
        { s: 0, en: "No structured training", fr: "Aucune formation structurée", ar: "لا يوجد تدريب منظم" }
      ] },
    { id: "compliance", q: { en: "How do you safeguard customer personal data (CNDP Law 09-08)?", fr: "Comment protégez-vous les données personnelles (Loi 09-08 / CNDP) ?", ar: "كيف تحمي البيانات الشخصية للعملاء (قانون 09-08)؟" },
      opts: [
        { s: 3, en: "Dedicated access control & encryption", fr: "Contrôle d'accès dédié et chiffrement", ar: "صلاحيات محددة وتشفير" },
        { s: 1, en: "Standard password-protected files", fr: "Fichiers protégés par mot de passe", ar: "ملفات محمية بكلمة مرور" },
        { s: 0, en: "Stored in open spreadsheets / drives", fr: "Stockées dans des fichiers ouverts", ar: "مخزنة في ملفات مفتوحة" }
      ] }
  ];

  var answers = new Array(questions.length).fill(null);
  var step = 0; // 0..4 questions, 5 lead form, 6 result
  var overlay, panel, lastFocus;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function total() { return answers.reduce(function (a, b) { return a + (b == null ? 0 : b); }, 0); }
  function tier() { var s = total(); return s <= 6 ? "high" : s <= 11 ? "medium" : "low"; }

  function progressPct() {
    // questions contribute up to 5/6 of the bar; lead + result fill the rest
    var done = step <= questions.length ? step : questions.length + (step - questions.length);
    return Math.min(100, Math.round((done / (questions.length + 1)) * 100));
  }

  function render() {
    panel.innerHTML = "";
    var head = el("div", "sc-head");
    head.appendChild(el("p", "sc-kicker", esc(tr("title"))));
    var closeBtn = el("button", "sc-close", "&times;");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", tr("close"));
    closeBtn.addEventListener("click", close);
    head.appendChild(closeBtn);
    panel.appendChild(head);

    var bar = el("div", "sc-progress");
    bar.setAttribute("aria-hidden", "true");
    var fill = el("span");
    fill.style.width = progressPct() + "%";
    bar.appendChild(fill);
    panel.appendChild(bar);

    if (step < questions.length) return renderQuestion();
    if (step === questions.length) return renderLead();
    return renderResult();
  }

  function renderQuestion() {
    var i = step, qd = questions[i];
    var wrap = el("div", "sc-body");
    wrap.appendChild(el("p", "sc-steplabel", esc(t.step[LANG](i + 1, questions.length))));
    wrap.appendChild(el("h2", "sc-question", esc(qd.q[LANG] || qd.q.en)));
    var list = el("div", "sc-options");
    qd.opts.forEach(function (o) {
      var b = el("button", "sc-option" + (answers[i] === o.s ? " is-selected" : ""), esc(o[LANG] || o.en));
      b.type = "button";
      b.addEventListener("click", function () {
        answers[i] = o.s;
        step++;
        render();
      });
      list.appendChild(b);
    });
    wrap.appendChild(list);

    var nav = el("div", "sc-nav");
    if (i > 0) {
      var back = el("button", "btn btn-secondary", esc(tr("back")));
      back.type = "button";
      back.addEventListener("click", function () { step--; render(); });
      nav.appendChild(back);
    }
    wrap.appendChild(nav);
    panel.appendChild(wrap);
    var first = list.querySelector(".sc-option");
    if (first) first.focus();
  }

  function renderLead() {
    var wrap = el("div", "sc-body");
    wrap.appendChild(el("h2", "sc-question", esc(tr("leadTitle"))));
    wrap.appendChild(el("p", "sc-lead-intro", esc(tr("leadIntro"))));

    var form = el("form", "sc-form");
    form.setAttribute("novalidate", "");
    form.innerHTML =
      '<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;width:1px;height:1px;" />' +
      '<label class="sc-field"><span>' + esc(tr("fName")) + '</span><input name="name" type="text" autocomplete="name" required /></label>' +
      '<label class="sc-field"><span>' + esc(tr("fCompany")) + '</span><input name="company" type="text" autocomplete="organization" required /></label>' +
      '<label class="sc-field"><span>' + esc(tr("fEmail")) + '</span><input name="email" type="email" autocomplete="email" required dir="ltr" /></label>' +
      '<label class="sc-field"><span>' + esc(tr("fPhone")) + '</span><input name="phone" type="tel" autocomplete="tel" dir="ltr" /></label>';

    var submit = el("button", "btn btn-primary sc-submit", esc(tr("submit")));
    submit.type = "submit";
    form.appendChild(submit);
    form.appendChild(el("p", "sc-nda", '🔒 ' + esc(tr("nda"))));

    var nav = el("div", "sc-nav");
    var back = el("button", "btn btn-secondary", esc(tr("back")));
    back.type = "button";
    back.addEventListener("click", function () { step--; render(); });
    nav.appendChild(back);
    form.insertBefore(nav, submit);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.website.value) return; // honeypot
      if (!form.checkValidity()) { form.reportValidity(); return; }
      submit.disabled = true;
      submit.textContent = tr("sending");
      sendLead(form).then(function () {
        step++;
        render();
      });
    });
    wrap.appendChild(form);
    panel.appendChild(wrap);
    var f = form.querySelector('input[name="name"]');
    if (f) f.focus();
  }

  function sendLead(form) {
    var s = total(), lv = tier();
    var riskEN = t.riskName[lv].en;
    var lines = ["Cybersecurity Risk Scorecard", "Score: " + s + "/15 — " + riskEN, "Language: " + LANG,
      "Phone: " + (form.phone.value || "—"), "", "Answers:"];
    questions.forEach(function (q, i) { lines.push("- " + q.id + ": " + (answers[i] == null ? "-" : answers[i]) + "/3"); });
    var fd = new FormData();
    fd.append("name", form.name.value);
    fd.append("company", form.company.value);
    fd.append("email", form.email.value);
    fd.append("service", "Risk Scorecard (" + riskEN + ")");
    fd.append("message", lines.join("\n"));
    return fetch(WEBHOOK, {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json", "X-Requested-With": "fetch" }
    }).catch(function () { /* show result regardless; lead delivery is best-effort */ });
  }

  function renderResult() {
    var lv = tier(), s = total();
    var wrap = el("div", "sc-body sc-result");
    wrap.appendChild(el("span", "sc-badge sc-badge-" + lv, esc(t.riskName[lv][LANG] || t.riskName[lv].en)));
    wrap.appendChild(el("p", "sc-score", esc(t.scoreLabel[LANG](s))));
    var meter = el("div", "sc-meter");
    meter.appendChild(el("span", "sc-meter-fill sc-badge-" + lv)).style.width = Math.round((s / 15) * 100) + "%";
    wrap.appendChild(meter);
    wrap.appendChild(el("p", "sc-result-msg", esc(t.riskMsg[lv][LANG] || t.riskMsg[lv].en)));

    var nav = el("div", "sc-nav sc-nav-result");
    var cta = el("a", "btn btn-primary", esc(tr("resultCta")));
    cta.href = contactHref;
    cta.addEventListener("click", close);
    nav.appendChild(cta);
    var retake = el("button", "btn btn-secondary", esc(tr("retake")));
    retake.type = "button";
    retake.addEventListener("click", function () { answers = new Array(questions.length).fill(null); step = 0; render(); });
    nav.appendChild(retake);
    wrap.appendChild(nav);
    panel.appendChild(wrap);
    cta.focus();
  }

  function open() {
    if (!overlay) build();
    lastFocus = document.activeElement;
    step = 0;
    answers = new Array(questions.length).fill(null);
    overlay.hidden = false;
    document.addEventListener("keydown", onKey);
    render();
  }
  function close() {
    if (!overlay) return;
    overlay.hidden = true;
    document.removeEventListener("keydown", onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) { if (e.key === "Escape") close(); }

  function build() {
    overlay = el("div", "sc-overlay");
    overlay.id = "sc-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", tr("title"));
    overlay.hidden = true;
    panel = el("div", "sc-modal");
    overlay.appendChild(panel);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.body.appendChild(overlay);
  }

  function injectTrigger() {
    var b = el("button", "sc-fab", '<i data-lucide="shield-check" aria-hidden="true"></i><span>' + esc(tr("trigger")) + "</span>");
    b.type = "button";
    b.setAttribute("aria-label", tr("title"));
    b.addEventListener("click", open);
    document.body.appendChild(b);
    if (window.lucide) window.lucide.createIcons();
  }

  // Wire any in-page triggers (e.g. hero buttons) + the floating button.
  function init() {
    document.querySelectorAll("[data-scorecard]").forEach(function (n) {
      n.addEventListener("click", function (e) { e.preventDefault(); open(); });
    });
    injectTrigger();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
