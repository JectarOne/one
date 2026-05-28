<?php
// Archive template — same as index but with category/tag context
get_header();
?>

<main style="padding-top:6rem;">
<div class="container">

  <!-- Archive Header -->
  <div class="blog-hero" style="padding-top:4rem;padding-bottom:3rem;">
    <p class="section-label">
      <?php
      if ( is_category() ) echo 'Category';
      elseif ( is_tag() )  echo 'Tag';
      else                 echo 'Archive';
      ?>
    </p>
    <h1 class="blog-hero__title" style="margin-top:.5rem;">
      <?php
      if ( is_category() ) single_cat_title();
      elseif ( is_tag() )  single_tag_title();
      else                 the_archive_title();
      ?>
    </h1>
    <?php $desc = get_the_archive_description(); if ( $desc ) : ?>
    <p class="blog-hero__sub"><?php echo $desc; ?></p>
    <?php endif; ?>
  </div>

  <!-- Category Nav -->
  <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:3rem;">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="cat-pill">All</a>
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

  <!-- Article Grid -->
  <?php if ( have_posts() ) : ?>
    <div class="article-grid" style="margin-bottom:5rem;">
      <?php while ( have_posts() ) : the_post();
        $cats      = get_the_category();
        $cat       = $cats ? $cats[0] : null;
        $cat_class = $cat ? jectar_cat_class( $cat->slug ) : '';
        $thumb     = has_post_thumbnail() ? get_the_post_thumbnail_url( get_the_ID(), 'jectar-card' ) : '';
        $emoji_map = [ 'ai-automation'=>'🧠','local-seo'=>'📍','whatsapp'=>'💬','industry'=>'🏢','morocco-digital'=>'🇲🇦','web-design'=>'🌐','tutorials'=>'🛠️' ];
      ?>
        <a href="<?php the_permalink(); ?>" class="art-card" style="text-decoration:none;">
          <div class="art-card__thumb" style="<?php echo $thumb ? 'background-image:url('.esc_url($thumb).');background-size:cover;background-position:center;' : 'background:linear-gradient(135deg,#0d0d1e,#0a1a0e);'; ?>">
            <?php if ( ! $thumb ) echo '<span style="font-size:3rem;">'.($cat ? ($emoji_map[$cat->slug]??'📝') : '📝').'</span>'; ?>
            <?php if ( $cat ) echo '<div class="art-card__thumb-label">'.esc_html($cat->name).'</div>'; ?>
          </div>
          <div class="art-card__body">
            <div class="art-card__meta">
              <span><?php echo get_the_date('M Y'); ?></span>
              <span class="art-card__meta-dot"></span>
              <span><?php echo jectar_reading_time(); ?></span>
            </div>
            <h2 class="art-card__title"><?php the_title(); ?></h2>
            <p class="art-card__excerpt"><?php echo wp_trim_words( get_the_excerpt(), 22 ); ?></p>
            <div class="art-card__footer">
              <div class="art-card__read">Read <span>→</span></div>
            </div>
          </div>
        </a>
      <?php endwhile; ?>
    </div>

    <div style="display:flex;justify-content:center;margin-bottom:4rem;">
      <?php echo paginate_links( [ 'prev_text' => '← Previous', 'next_text' => 'Next →', 'type' => 'list' ] ); ?>
    </div>

  <?php else : ?>
    <div style="text-align:center;padding:5rem 0;color:var(--muted);">
      <p>No articles in this category yet.</p>
      <a href="<?php echo esc_url( home_url('/') ); ?>" class="btn btn--ghost btn--sm" style="margin-top:1.5rem;display:inline-flex;">← Back to Blog</a>
    </div>
  <?php endif; ?>

</div>
</main>

<?php get_footer(); ?>
