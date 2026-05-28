<?php get_header(); ?>

<main style="padding-top:5rem;">
<div class="container" style="min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:5rem 1.5rem;">

  <div>
    <p style="font-family:var(--font-head);font-size:8rem;font-weight:800;line-height:1;background:linear-gradient(135deg,var(--blue),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">404</p>
    <h1 style="font-family:var(--font-head);font-size:1.75rem;font-weight:700;color:#fff;margin:1rem 0 .75rem;">Page not found</h1>
    <p style="color:var(--muted);font-size:.95rem;max-width:400px;margin:0 auto 2rem;line-height:1.7;">
      This page doesn't exist — but our articles do.
    </p>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
      <a href="<?php echo esc_url( home_url('/') ); ?>" class="btn btn--primary">Browse Blog</a>
      <a href="https://jectar.one" class="btn btn--ghost">Back to Jectar One</a>
    </div>
  </div>

</div>
</main>

<?php get_footer(); ?>
