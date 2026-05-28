<?php get_header(); ?>

<main style="padding-top:6rem;">
<div class="container">

  <div style="padding:4rem 0 2rem;">
    <p class="section-label">Search Results</p>
    <h1 style="font-family:var(--font-head);font-size:1.75rem;font-weight:700;color:#fff;margin-top:.5rem;">
      <?php printf( 'Results for: <span style="color:var(--blue);">%s</span>', get_search_query() ); ?>
    </h1>
  </div>

  <?php if ( have_posts() ) : ?>
    <div class="article-grid" style="margin-bottom:5rem;">
      <?php while ( have_posts() ) : the_post();
        $cats  = get_the_category();
        $cat   = $cats ? $cats[0] : null;
        $thumb = has_post_thumbnail() ? get_the_post_thumbnail_url( get_the_ID(), 'jectar-card' ) : '';
      ?>
        <a href="<?php the_permalink(); ?>" class="art-card" style="text-decoration:none;">
          <div class="art-card__thumb" style="<?php echo $thumb ? 'background-image:url('.esc_url($thumb).');background-size:cover;' : 'background:linear-gradient(135deg,#0d0d1e,#0a1a0e);'; ?>">
            <?php if ( $cat ) echo '<div class="art-card__thumb-label">'.esc_html($cat->name).'</div>'; ?>
          </div>
          <div class="art-card__body">
            <div class="art-card__meta">
              <span><?php echo get_the_date('M Y'); ?></span>
              <span class="art-card__meta-dot"></span>
              <span><?php echo jectar_reading_time(); ?></span>
            </div>
            <h2 class="art-card__title"><?php the_title(); ?></h2>
            <p class="art-card__excerpt"><?php echo wp_trim_words( get_the_excerpt(), 20 ); ?></p>
            <div class="art-card__footer"><div class="art-card__read">Read <span>→</span></div></div>
          </div>
        </a>
      <?php endwhile; ?>
    </div>
  <?php else : ?>
    <div style="text-align:center;padding:5rem 0;color:var(--muted);">
      <p>No results found for "<?php echo get_search_query(); ?>"</p>
      <a href="<?php echo esc_url( home_url('/') ); ?>" class="btn btn--ghost btn--sm" style="margin-top:1.5rem;display:inline-flex;">← Browse all articles</a>
    </div>
  <?php endif; ?>

</div>
</main>

<?php get_footer(); ?>
