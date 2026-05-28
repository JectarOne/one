<?php get_header(); ?>

<?php while ( have_posts() ) : the_post(); ?>

<main style="padding-top:5rem;">
<div class="container" style="max-width:860px;padding:4rem 1.5rem 6rem;">

  <header style="margin-bottom:2.5rem;">
    <h1 style="font-family:var(--font-head);font-size:clamp(2rem,4vw,3rem);font-weight:800;color:#fff;line-height:1.15;margin-bottom:1rem;">
      <?php the_title(); ?>
    </h1>
    <p style="font-size:.8rem;color:var(--muted);"><?php echo get_the_date(); ?></p>
  </header>

  <div class="article-body">
    <?php the_content(); ?>
  </div>

</div>
</main>

<?php endwhile; ?>

<?php get_footer(); ?>
