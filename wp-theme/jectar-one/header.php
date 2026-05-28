<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="profile" href="https://gmpg.org/xfn/11">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Skip to main content -->
<a href="#main-content" class="skip-link" style="position:absolute;left:-9999px;top:0;z-index:9999;background:var(--blue);color:#000;padding:.5rem 1rem;font-size:.85rem;text-decoration:none;">Skip to content</a>

<!-- Noise + particles (matching main site) -->
<canvas id="particles-canvas"></canvas>

<!-- Reading progress bar (shown on single posts) -->
<?php if ( is_singular() ) : ?>
<div class="reading-progress" id="readingProgress"></div>
<?php endif; ?>

<!-- NAVBAR -->
<nav class="nav" id="navbar" role="navigation" aria-label="Main navigation">
  <div class="nav__inner container">

    <a href="https://jectar.one" class="nav__logo">
      <div class="nav__logo-mark" aria-hidden="true">J</div>
      <span class="nav__logo-text">Jectar <span class="nav__logo-sub">One</span></span>
    </a>

    <ul class="nav__links" role="list">
      <li><a href="https://jectar.one/#about"    class="nav__link">About</a></li>
      <li><a href="https://jectar.one/#services" class="nav__link">Services</a></li>
      <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>"
             class="nav__link<?php echo ( is_home() || is_archive() ) ? ' nav__link--active' : ''; ?>"
             style="color:var(--blue);">Blog</a></li>
      <li><a href="https://jectar.one/#contact"  class="nav__link">Contact</a></li>
    </ul>

    <div class="nav__actions">
      <div class="lang-switcher" style="display:flex;gap:.35rem;margin-right:.75rem;">
        <a href="https://jectar.one"    style="font-size:.7rem;padding:.25rem .5rem;border-radius:6px;color:#fff;background:rgba(124,58,237,.3);border:1px solid rgba(124,58,237,.5);text-decoration:none;">EN</a>
        <a href="https://jectar.one/fr/" style="font-size:.7rem;padding:.25rem .5rem;border-radius:6px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);text-decoration:none;">FR</a>
        <a href="https://jectar.one/ar/" style="font-size:.7rem;padding:.25rem .5rem;border-radius:6px;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);text-decoration:none;">AR</a>
      </div>
      <a href="https://jectar.one/#contact" class="btn btn--primary btn--sm">Build My System</a>
      <button class="nav__ham" id="navHam" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-menu">
        <span class="nav__ham-line"></span>
        <span class="nav__ham-line"></span>
        <span class="nav__ham-line"></span>
      </button>
    </div>

  </div>
</nav>

<!-- Mobile menu -->
<div id="mobile-menu" class="nav__mobile" role="dialog" aria-modal="true">
  <a href="https://jectar.one/#about"    class="nav__mobile-link">About</a>
  <a href="https://jectar.one/#services" class="nav__mobile-link">Services</a>
  <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="nav__mobile-link">Blog</a>
  <a href="https://jectar.one/#contact"  class="nav__mobile-link">Contact</a>
  <a href="https://jectar.one/#contact"  class="btn btn--primary" style="margin-top:1.25rem;">Build My System</a>
</div>

<script>
  // Mobile menu toggle
  (function(){
    var ham = document.getElementById('navHam');
    var menu = document.getElementById('mobile-menu');
    if (!ham) return;
    ham.addEventListener('click', function(){
      var open = menu.classList.toggle('open');
      ham.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', open);
    });
  })();

  // Navbar scroll effect
  (function(){
    var nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', function(){
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  })();

  <?php if ( is_singular() ) : ?>
  // Reading progress bar
  (function(){
    var bar = document.getElementById('readingProgress');
    if (!bar) return;
    window.addEventListener('scroll', function(){
      var scrolled = document.documentElement.scrollTop || document.body.scrollTop;
      var total    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (total > 0 ? (scrolled / total * 100) : 0) + '%';
    }, { passive: true });
  })();
  <?php endif; ?>
</script>
