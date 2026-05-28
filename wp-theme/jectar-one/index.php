<?php get_header(); ?>

<main style="padding-top:6rem;">
<div class="container">

  <!-- BLOG HERO -->
  <div class="blog-hero">
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(124,58,237,.1) 0%,transparent 70%);top:-100px;right:-150px;pointer-events:none;position:absolute;"></div>
    <p class="section-label">Jectar Blog</p>
    <h1 class="blog-hero__title" style="margin-top:.5rem;">
      Insights that<br><span class="g-text">actually build businesses.</span>
    </h1>
    <p class="blog-hero__sub">
      No SEO fluff. No generic advice. Practical guides on AI automation, WhatsApp systems, web design, and local SEO — written for Moroccan business owners who want results.
    </p>

    <?php if ( is_category() ) : ?>
      <div style="margin-top:1.5rem;">
        <span class="cat-pill active" style="font-size:.85rem;">
          <?php single_cat_title(); ?>
        </span>
        <?php $cat_desc = category_description(); if ( $cat_desc ) echo '<p style="margin-top:1rem;color:var(--muted);max-width:480px;font-size:.9rem;">' . $cat_desc . '</p>'; ?>
      </div>
    <?php endif; ?>
  </div>

  <!-- CATEGORY NAV -->
  <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:3rem;">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>"
       class="cat-pill <?php echo ( ! is_category() ) ? 'active' : ''; ?>">All</a>
    <?php
    $cats = get_categories( [ 'orderby' => 'count', 'order' => 'DESC', 'hide_empty' => true ] );
    foreach ( $cats as $cat ) :
      $active = is_category( $cat->term_id ) ? 'active' : '';
      $color  = jectar_cat_class( $cat->slug );
    ?>
    <a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>"
       class="cat-pill <?php echo esc_attr( $color ); ?> <?php echo esc_attr( $active ); ?>">
      <?php echo esc_html( $cat->name ); ?>
    </a>
    <?php endforeach; ?>
  </div>

  <!-- ARTICLE GRID -->
  <?php if ( have_posts() ) : ?>

    <div class="article-grid" style="margin-bottom:5rem;">
      <?php while ( have_posts() ) : the_post(); ?>

        <?php
        $cats       = get_the_category();
        $cat        = $cats ? $cats[0] : null;
        $cat_class  = $cat ? jectar_cat_class( $cat->slug ) : '';
        $read_time  = jectar_reading_time();
        $thumb      = has_post_thumbnail() ? get_the_post_thumbnail_url( get_the_ID(), 'jectar-card' ) : '';
        ?>

        <a href="<?php the_permalink(); ?>" class="art-card" style="text-decoration:none;">

          <div class="art-card__thumb" style="<?php echo $thumb ? 'background-image:url(' . esc_url( $thumb ) . ');background-size:cover;background-position:center;' : 'background:linear-gradient(135deg,#0d0d1e,#0a1a0e);'; ?>">
            <?php if ( ! $thumb ) : ?>
              <span style="font-size:3rem;"><?php
                $emoji_map = [
                  'ai-automation'   => '🧠',
                  'local-seo'       => '📍',
                  'whatsapp'        => '💬',
                  'industry'        => '🏢',
                  'morocco-digital' => '🇲🇦',
                  'web-design'      => '🌐',
                  'tutorials'       => '🛠️',
                ];
                echo $cat ? ( $emoji_map[ $cat->slug ] ?? '📝' ) : '📝';
              ?></span>
            <?php endif; ?>
            <?php if ( $cat ) : ?>
              <div class="art-card__thumb-label"><?php echo esc_html( $cat->name ); ?></div>
            <?php endif; ?>
          </div>

          <div class="art-card__body">
            <div class="art-card__meta">
              <span><?php echo get_the_date( 'M Y' ); ?></span>
              <span class="art-card__meta-dot"></span>
              <span><?php echo $read_time; ?></span>
            </div>
            <h2 class="art-card__title"><?php the_title(); ?></h2>
            <p class="art-card__excerpt"><?php echo wp_trim_words( get_the_excerpt(), 22 ); ?></p>
            <div class="art-card__footer">
              <div class="art-card__read">Read the guide <span>→</span></div>
            </div>
          </div>

        </a>

      <?php endwhile; ?>
    </div>

    <!-- PAGINATION -->
    <div style="display:flex;justify-content:center;gap:1rem;margin-bottom:4rem;">
      <?php
      echo paginate_links( [
          'prev_text' => '← Previous',
          'next_text' => 'Next →',
          'before_page_number' => '',
          'type'      => 'list',
      ] );
      ?>
    </div>

  <?php else : ?>

    <div style="text-align:center;padding:6rem 0;color:var(--muted);">
      <p style="font-size:1.1rem;">No articles yet — check back soon.</p>
      <a href="https://wa.me/212752138075" class="btn btn--primary" style="margin-top:2rem;display:inline-flex;" target="_blank" rel="noopener">Contact us on WhatsApp</a>
    </div>

  <?php endif; ?>

  <!-- NEWSLETTER CTA -->
  <div class="glass" style="padding:2.5rem;border-radius:1.5rem;max-width:640px;margin:0 auto 5rem;text-align:center;border:1px solid rgba(124,58,237,.2);">
    <p style="font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:var(--purple);margin-bottom:.75rem;">Stay Updated</p>
    <h3 style="font-family:var(--font-head);font-size:1.35rem;font-weight:700;margin-bottom:.65rem;">New guides every week.</h3>
    <p style="color:rgba(255,255,255,.45);font-size:.88rem;margin-bottom:1.5rem;line-height:1.7;">
      Practical AI, automation, and web strategy for Moroccan businesses. No spam.
    </p>
    <a href="https://wa.me/212752138075?text=I%20want%20to%20follow%20the%20Jectar%20blog"
       class="btn btn--primary" target="_blank" rel="noopener">
      Follow on WhatsApp →
    </a>
  </div>

</div>
</main>

<?php get_footer(); ?>
