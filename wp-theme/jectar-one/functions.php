<?php
/**
 * Jectar One Theme Functions
 */

/* ── THEME SUPPORT ─────────────────────────────── */
function jectar_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ] );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'custom-logo' );

    add_image_size( 'jectar-card', 720, 405, true );   // 16:9 card thumbnail
    add_image_size( 'jectar-hero', 1200, 630, true );  // OG image size

    register_nav_menus( [
        'primary' => __( 'Primary Menu', 'jectar-one' ),
    ] );
}
add_action( 'after_setup_theme', 'jectar_setup' );


/* ── ENQUEUE STYLES & SCRIPTS ──────────────────── */
function jectar_enqueue() {
    // Google Fonts
    wp_enqueue_style(
        'jectar-fonts',
        'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap',
        [],
        null
    );

    // Parent site CSS (absolute URL — stays in sync with main site)
    wp_enqueue_style(
        'jectar-main',
        'https://jectar.one/css/style.css',
        [ 'jectar-fonts' ],
        '1.0'
    );

    // Blog CSS
    wp_enqueue_style(
        'jectar-blog',
        'https://jectar.one/css/blog.css',
        [ 'jectar-main' ],
        '1.0'
    );

    // Theme style.css (loaded last for any overrides)
    wp_enqueue_style(
        'jectar-theme',
        get_stylesheet_uri(),
        [ 'jectar-blog' ],
        '1.0'
    );

    // GSAP
    wp_enqueue_script(
        'gsap',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        [],
        '3.12.5',
        true
    );

    // Particles (from parent site)
    wp_enqueue_script(
        'jectar-particles',
        'https://jectar.one/js/particles.js',
        [],
        '1.0',
        true
    );

    // Main JS (nav scroll, reveals)
    wp_enqueue_script(
        'jectar-main-js',
        'https://jectar.one/js/main.js',
        [ 'gsap', 'jectar-particles' ],
        '1.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'jectar_enqueue' );


/* ── READING TIME ──────────────────────────────── */
function jectar_reading_time( $post_id = null ) {
    $content   = get_post_field( 'post_content', $post_id ?? get_the_ID() );
    $word_count = str_word_count( strip_tags( $content ) );
    $minutes   = max( 1, ceil( $word_count / 200 ) );
    return $minutes . ' min read';
}


/* ── AUTO TOC FROM HEADINGS ────────────────────── */
function jectar_generate_toc( $content ) {
    preg_match_all( '/<h([23])[^>]*id=["\']([^"\']+)["\'][^>]*>(.*?)<\/h[23]>/i', $content, $matches );

    if ( empty( $matches[0] ) ) {
        // Also try headings without IDs — add IDs
        return [ 'toc' => '', 'content' => $content ];
    }

    $toc  = '<div class="toc sidebar-card"><h3 class="toc__title">Table of Contents</h3><ul class="toc__list">';
    $prev_level = 2;

    foreach ( $matches[1] as $i => $level ) {
        $id    = $matches[2][ $i ];
        $text  = strip_tags( $matches[3][ $i ] );
        $level = (int) $level;

        if ( $level === 3 ) {
            $toc .= '<li class="toc__item toc__item--sub"><a href="#' . esc_attr( $id ) . '">' . esc_html( $text ) . '</a></li>';
        } else {
            $toc .= '<li class="toc__item"><a href="#' . esc_attr( $id ) . '">' . esc_html( $text ) . '</a></li>';
        }
    }

    $toc .= '</ul></div>';

    return [ 'toc' => $toc, 'content' => $content ];
}


/* ── ADD IDS TO HEADINGS IN CONTENT ────────────── */
function jectar_add_heading_ids( $content ) {
    $content = preg_replace_callback(
        '/<h([23])>(.*?)<\/h[23]>/i',
        function( $matches ) {
            $level = $matches[1];
            $text  = $matches[2];
            $id    = sanitize_title( strip_tags( $text ) );
            return '<h' . $level . ' id="' . $id . '">' . $text . '</h' . $level . '>';
        },
        $content
    );
    return $content;
}
add_filter( 'the_content', 'jectar_add_heading_ids', 5 );


/* ── EXCERPT LENGTH ────────────────────────────── */
function jectar_excerpt_length( $length ) {
    return 25;
}
add_filter( 'excerpt_length', 'jectar_excerpt_length' );

function jectar_excerpt_more( $more ) {
    return '…';
}
add_filter( 'excerpt_more', 'jectar_excerpt_more' );


/* ── REGISTER WIDGET AREAS ─────────────────────── */
function jectar_widgets_init() {
    register_sidebar( [
        'name'          => 'Article Sidebar',
        'id'            => 'article-sidebar',
        'description'   => 'Widgets in the blog article sidebar.',
        'before_widget' => '<div class="sidebar-card">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="sidebar-card__title">',
        'after_title'   => '</h4>',
    ] );
}
add_action( 'widgets_init', 'jectar_widgets_init' );


/* ── REMOVE WORDPRESS EMOJI BLOAT ──────────────── */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );


/* ── CATEGORY COLOR MAP ────────────────────────── */
function jectar_cat_class( $cat_slug ) {
    $map = [
        'ai-automation'   => 'cat-pill--blue',
        'local-seo'       => 'cat-pill--green',
        'whatsapp'        => 'cat-pill--green',
        'industry'        => 'cat-pill--amber',
        'morocco-digital' => '',
        'web-design'      => '',
        'tutorials'       => '',
    ];
    return $map[ $cat_slug ] ?? '';
}


/* ── DISABLE COMMENTS (optional) ──────────────── */
// Uncomment if you don't want comments on blog posts:
// add_filter( 'comments_open', '__return_false', 20, 2 );
// add_filter( 'pings_open',    '__return_false', 20, 2 );


/* ── CLEAN UP <HEAD> ───────────────────────────── */
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );


/* ── YOAST / RANK MATH BREADCRUMB SUPPORT ──────── */
function jectar_has_seo_plugin() {
    return defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' );
}


/* ── JSON-LD STRUCTURED DATA ──────────────────── */
function jectar_schema_output() {
    if ( ! is_singular( 'post' ) ) return;

    $post_id   = get_the_ID();
    $title     = get_the_title();
    $excerpt   = get_the_excerpt();
    $url       = get_permalink();
    $published = get_the_date( 'c' );
    $modified  = get_the_modified_date( 'c' );
    $content   = get_post_field( 'post_content', $post_id );
    $words     = str_word_count( strip_tags( $content ) );
    $minutes   = max( 1, ceil( $words / 200 ) );
    $cats      = get_the_category();
    $section   = $cats ? $cats[0]->name : 'Blog';
    $tags      = get_the_tags();
    $keywords  = $tags ? implode( ', ', wp_list_pluck( $tags, 'name' ) ) : '';
    $image     = get_the_post_thumbnail_url( $post_id, 'jectar-hero' );

    $article = [
        '@context'        => 'https://schema.org',
        '@type'           => 'Article',
        'headline'        => $title,
        'description'     => $excerpt,
        'url'             => $url,
        'datePublished'   => $published,
        'dateModified'    => $modified,
        'wordCount'       => $words,
        'timeRequired'    => 'PT' . $minutes . 'M',
        'articleSection'  => $section,
        'author'          => [
            '@type' => 'Organization',
            'name'  => 'Jectar One',
            'url'   => 'https://jectar.one',
        ],
        'publisher'       => [
            '@type' => 'Organization',
            'name'  => 'Jectar One',
            'logo'  => [
                '@type' => 'ImageObject',
                'url'   => 'https://jectar.one/favicon-32x32.png',
            ],
        ],
        'mainEntityOfPage' => [ '@type' => 'WebPage', '@id' => $url ],
    ];

    if ( $image )    $article['image']    = $image;
    if ( $keywords ) $article['keywords'] = $keywords;

    echo '<script type="application/ld+json">' . wp_json_encode( $article, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";

    // Breadcrumb schema
    $breadcrumb = [
        '@context'        => 'https://schema.org',
        '@type'           => 'BreadcrumbList',
        'itemListElement' => [
            [ '@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => 'https://jectar.one/' ],
            [ '@type' => 'ListItem', 'position' => 2, 'name' => 'Blog', 'item' => home_url( '/' ) ],
        ],
    ];

    if ( $cats ) {
        $breadcrumb['itemListElement'][] = [
            '@type'    => 'ListItem',
            'position' => 3,
            'name'     => $cats[0]->name,
            'item'     => get_category_link( $cats[0]->term_id ),
        ];
        $breadcrumb['itemListElement'][] = [
            '@type'    => 'ListItem',
            'position' => 4,
            'name'     => $title,
        ];
    } else {
        $breadcrumb['itemListElement'][] = [
            '@type'    => 'ListItem',
            'position' => 3,
            'name'     => $title,
        ];
    }

    echo '<script type="application/ld+json">' . wp_json_encode( $breadcrumb, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
}
add_action( 'wp_head', 'jectar_schema_output', 20 );


/* ── ADD LAZY LOADING TO CONTENT IMAGES ──────── */
function jectar_lazy_load_content_images( $content ) {
    $content = preg_replace(
        '/<img(?![^>]*loading=)([^>]*)>/i',
        '<img loading="lazy"$1>',
        $content
    );
    return $content;
}
add_filter( 'the_content', 'jectar_lazy_load_content_images', 99 );
