<!-- FOOTER -->
<footer class="footer" style="border-top:1px solid var(--border);padding:3rem 0 2rem;margin-top:4rem;">
  <div class="footer__inner container" style="display:flex;flex-direction:column;align-items:center;gap:1.5rem;text-align:center;">

    <a href="https://jectar.one" class="nav__logo" style="text-decoration:none;">
      <div class="nav__logo-mark" aria-hidden="true">J</div>
      <span class="nav__logo-text">Jectar <span class="nav__logo-sub">One</span></span>
    </a>

    <p style="font-size:.85rem;color:var(--muted);max-width:400px;line-height:1.7;">
      Moroccan AI &amp; web studio engineering perception, authority &amp; conversion for gyms, clinics, real estate firms, and luxury rentals.
    </p>

    <ul style="display:flex;flex-wrap:wrap;gap:1.5rem;list-style:none;justify-content:center;">
      <li><a href="https://jectar.one"           style="font-size:.8rem;color:var(--muted);transition:color .2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--muted)'">Home</a></li>
      <li><a href="https://jectar.one/#services" style="font-size:.8rem;color:var(--muted);transition:color .2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--muted)'">Services</a></li>
      <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" style="font-size:.8rem;color:var(--muted);transition:color .2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--muted)'">Blog</a></li>
      <li><a href="mailto:info@jectar.one"       style="font-size:.8rem;color:var(--muted);transition:color .2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--muted)'">info@jectar.one</a></li>
    </ul>

    <div style="display:flex;gap:1rem;">
      <a href="https://x.com/jectarone"           target="_blank" rel="noopener" aria-label="X / Twitter" style="width:34px;height:34px;border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:.75rem;transition:all .2s;" onmouseover="this.style.borderColor='rgba(0,212,255,.4)';this.style.color='#fff'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--muted)'">X</a>
      <a href="https://instagram.com/jectarone"   target="_blank" rel="noopener" aria-label="Instagram"   style="width:34px;height:34px;border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:.75rem;transition:all .2s;" onmouseover="this.style.borderColor='rgba(0,212,255,.4)';this.style.color='#fff'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--muted)'">IG</a>
      <a href="https://tiktok.com/@jectarone"     target="_blank" rel="noopener" aria-label="TikTok"      style="width:34px;height:34px;border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:.75rem;transition:all .2s;" onmouseover="this.style.borderColor='rgba(0,212,255,.4)';this.style.color='#fff'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--muted)'">TK</a>
    </div>

    <p style="font-size:.72rem;color:rgba(255,255,255,.2);">
      &copy; <?php echo date( 'Y' ); ?> Jectar One. All rights reserved.
    </p>

  </div>
</footer>

<!-- MOBILE DOCK -->
<nav class="dock" aria-label="Mobile dock navigation">
  <a href="https://jectar.one"          class="dock__item"><span class="dock__icon">🏠</span><span>Home</span></a>
  <a href="https://jectar.one/#services" class="dock__item"><span class="dock__icon">⚡</span><span>Services</span></a>
  <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="dock__item"><span class="dock__icon">📝</span><span>Blog</span></a>
  <a href="https://jectar.one/#contact"  class="dock__item"><span class="dock__icon">✉️</span><span>Contact</span></a>
</nav>

<?php wp_footer(); ?>
</body>
</html>
