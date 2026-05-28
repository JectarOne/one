<?php get_header(); ?>

<?php while ( have_posts() ) : the_post(); ?>

<?php
// Prep data
$cats       = get_the_category();
$cat        = $cats ? $cats[0] : null;
$cat_class  = $cat ? jectar_cat_class( $cat->slug ) : '';
$read_time  = jectar_reading_time();
$content    = apply_filters( 'the_content', get_the_content() );
$toc_data   = jectar_generate_toc( $content );
$toc_html   = $toc_data['toc'];

// Share URLs
$post_url   = urlencode( get_permalink() );
$post_title = urlencode( get_the_title() );
$wa_share   = 'https://wa.me/?text=' . $post_title . '%20%E2%80%94%20' . $post_url;
$li_share   = 'https://www.linkedin.com/sharing/share-offsite/?url=' . $post_url;
$tw_share   = 'https://x.com/intent/tweet?text=' . $post_title . '&url=' . $post_url;
?>

<main id="main-content" style="padding-top:5rem;">
<article class="article-layout container">

  <!-- ── MAIN CONTENT ── -->
  <div class="article-main">

    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="https://jectar.one">Home</a>
      <span>›</span>
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Blog</a>
      <?php if ( $cat ) : ?>
      <span>›</span>
      <a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>"><?php echo esc_html( $cat->name ); ?></a>
      <?php endif; ?>
      <span>›</span>
      <span><?php the_title(); ?></span>
    </nav>

    <!-- Article Header -->
    <header class="article-header">
      <div class="article-header__meta">
        <?php if ( $cat ) : ?>
          <a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>"
             class="cat-pill <?php echo esc_attr( $cat_class ); ?>"
             style="text-decoration:none;"><?php echo esc_html( $cat->name ); ?></a>
        <?php endif; ?>
        <span><?php echo get_the_date( 'F j, Y' ); ?></span>
        <span><?php echo jectar_reading_time(); ?></span>
        <?php if ( get_the_date( 'U' ) !== get_the_modified_date( 'U' ) ) : ?>
        <span style="color:var(--emerald);font-size:0.8rem;">Updated <?php echo get_the_modified_date( 'M j, Y' ); ?></span>
        <?php endif; ?>
      </div>
      <h1 itemprop="headline"><?php the_title(); ?></h1>
      <?php
      // Show excerpt as intro paragraph if set
      $excerpt = get_the_excerpt();
      if ( $excerpt && strlen( $excerpt ) > 10 ) :
      ?>
      <p class="article-header__intro" style="font-size:1.1rem;color:rgba(255,255,255,.65);line-height:1.75;margin-top:1rem;max-width:720px;">
        <?php echo esc_html( $excerpt ); ?>
      </p>
      <?php endif; ?>
    </header>

    <!-- Featured Image (if set) -->
    <?php if ( has_post_thumbnail() ) : ?>
    <div style="margin-bottom:2.5rem;border-radius:1rem;overflow:hidden;border:1px solid var(--border);">
      <?php the_post_thumbnail( 'jectar-hero', [
          'style'   => 'width:100%;height:auto;display:block;',
          'loading' => 'eager',
          'fetchpriority' => 'high',
      ] ); ?>
    </div>
    <?php endif; ?>

    <!-- Article Body -->
    <div class="article-body" itemprop="articleBody">
      <?php echo $content; ?>
    </div>

    <!-- Tags -->
    <?php $tags = get_the_tags(); if ( $tags ) : ?>
    <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:2rem;">
      <?php foreach ( $tags as $tag ) : ?>
        <a href="<?php echo esc_url( get_tag_link( $tag->term_id ) ); ?>"
           class="cat-pill" style="font-size:.72rem;text-decoration:none;">
          #<?php echo esc_html( $tag->name ); ?>
        </a>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <!-- Author Bio -->
    <div class="author-bio" style="margin-top:3rem;">
      <div class="author-bio__avatar">J</div>
      <div>
        <strong style="display:block;font-family:var(--font-head);font-size:1rem;margin-bottom:.25rem;">Jectar One</strong>
        <span style="display:block;font-size:.78rem;color:var(--blue);margin-bottom:.5rem;">Moroccan AI &amp; Web Studio</span>
        <p style="font-size:.85rem;color:var(--muted);line-height:1.7;">
          We build digital systems for gyms, clinics, real estate firms, and luxury rentals that rank, convert, and operate on autopilot.
          <a href="https://jectar.one" style="color:var(--blue);">jectar.one</a>
        </p>
      </div>
    </div>

    <!-- Share Bar -->
    <div class="share-bar">
      <span style="font-size:.78rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;">Share:</span>
      <a href="<?php echo esc_url( $wa_share ); ?>" target="_blank" rel="noopener"
         class="btn btn--ghost btn--sm" style="background:rgba(37,211,102,.1);border-color:rgba(37,211,102,.3);color:#25d366;">WhatsApp</a>
      <a href="<?php echo esc_url( $li_share ); ?>" target="_blank" rel="noopener"
         class="btn btn--ghost btn--sm" style="background:rgba(10,102,194,.1);border-color:rgba(10,102,194,.3);color:#0a66c2;">LinkedIn</a>
      <a href="<?php echo esc_url( $tw_share ); ?>" target="_blank" rel="noopener"
         class="btn btn--ghost btn--sm">X / Twitter</a>
    </div>

    <!-- Related Posts -->
    <?php
    $related = new WP_Query( [
        'category__in'   => wp_get_post_categories( get_the_ID() ),
        'post__not_in'   => [ get_the_ID() ],
        'posts_per_page' => 3,
        'orderby'        => 'rand',
    ] );
    if ( $related->have_posts() ) :
    ?>
    <section style="margin-top:4rem;">
      <p class="section-label">Keep Reading</p>
      <h3 style="font-family:var(--font-head);font-size:1.2rem;font-weight:700;color:#fff;margin-bottom:1.5rem;">Related Articles</h3>
      <div class="article-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr));">
        <?php while ( $related->have_posts() ) : $related->the_post(); ?>
          <?php
          $r_cats      = get_the_category();
          $r_cat       = $r_cats ? $r_cats[0] : null;
          $r_cat_class = $r_cat ? jectar_cat_class( $r_cat->slug ) : '';
          ?>
          <a href="<?php the_permalink(); ?>" class="art-card" style="text-decoration:none;">
            <div class="art-card__thumb" style="background:linear-gradient(135deg,#0d0d1e,#0a1a0e);">
              <?php if ( $r_cat ) : ?><div class="art-card__thumb-label"><?php echo esc_html( $r_cat->name ); ?></div><?php endif; ?>
            </div>
            <div class="art-card__body">
              <div class="art-card__meta">
                <span><?php echo get_the_date( 'M Y' ); ?></span>
                <span class="art-card__meta-dot"></span>
                <span><?php echo jectar_reading_time(); ?></span>
              </div>
              <h4 class="art-card__title"><?php the_title(); ?></h4>
              <p class="art-card__excerpt"><?php echo wp_trim_words( get_the_excerpt(), 18 ); ?></p>
              <div class="art-card__footer">
                <div class="art-card__read">Read <span>→</span></div>
              </div>
            </div>
          </a>
        <?php endwhile; wp_reset_postdata(); ?>
      </div>
    </section>
    <?php endif; ?>

  </div><!-- /.article-main -->

  <!-- ── SIDEBAR ── -->
  <aside class="article-sidebar">

    <!-- Table of Contents (auto-generated) -->
    <?php if ( $toc_html ) echo $toc_html; ?>

    <!-- CTA Card -->
    <div class="sidebar-card" style="background:linear-gradient(135deg,rgba(124,58,237,.15),rgba(37,99,235,.15));border:1px solid rgba(124,58,237,.3);text-align:center;padding:1.5rem;">
      <h4 style="color:#a78bfa;margin-bottom:.75rem;font-family:var(--font-head);">Need help with this?</h4>
      <p style="font-size:.875rem;color:var(--muted);margin-bottom:1rem;line-height:1.6;">We implement everything covered in these guides for Moroccan businesses. Free consultation.</p>
      <a href="https://wa.me/212752138075?text=Hi%20Jectar%2C%20I%20read%20your%20blog%20and%20want%20to%20talk"
         class="btn btn--primary" style="width:100%;text-align:center;display:flex;" target="_blank" rel="noopener">
        Talk on WhatsApp →
      </a>
    </div>

    <!-- Related Links -->
    <?php if ( $related = new WP_Query( [ 'category__in' => wp_get_post_categories( get_the_ID() ), 'post__not_in' => [ get_the_ID() ], 'posts_per_page' => 5 ] ) ) : ?>
    <?php if ( $related->have_posts() ) : ?>
    <div class="sidebar-card">
      <h4 class="sidebar-card__title">Also Read</h4>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:.5rem;">
        <?php while ( $related->have_posts() ) : $related->the_post(); ?>
          <li>
            <a href="<?php the_permalink(); ?>"
               style="font-size:.82rem;color:rgba(255,255,255,.55);text-decoration:none;transition:color .2s;display:block;padding:.4rem 0;border-bottom:1px solid rgba(255,255,255,.04);"
               onmouseover="this.style.color='var(--blue)'" onmouseout="this.style.color='rgba(255,255,255,.55)'">
              <?php the_title(); ?>
            </a>
          </li>
        <?php endwhile; wp_reset_postdata(); ?>
      </ul>
    </div>
    <?php endif; ?>
    <?php endif; ?>

  </aside>

</article>
</main>

<?php endwhile; ?>

<?php get_footer(); ?>
