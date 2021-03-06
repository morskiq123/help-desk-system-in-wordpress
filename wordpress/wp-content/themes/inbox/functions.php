<?php
/**
 * inbox functions and definitions
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License as published by the Free Software Foundation; either version 2 of the License,
 * or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not, write
 * to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 *
 * @package inbox
 * @subpackage Functions
 * @author     MetricThemes <support@metricthemes.com>
 * @copyright  Copyright (c) 2019, MetricThemes
 * @link       http://metricthemes.com/theme/inbox
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 */

if ( ! function_exists( 'inbox_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function inbox_setup() {

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );
	
	// support for guternberg things
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );	

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	//Custom Image Sizes
	set_post_thumbnail_size( 150, 150, true );
	add_image_size( 'inbox-single', 800, 480, true );	

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary-menu' => esc_html__( 'Primary Menu', 'inbox' ),
		'social-menu' => esc_html__( 'Social Menu', 'inbox' ),		
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support( 'custom-logo', array(
		'height'      => 30,
		'width'       => 200,
		'flex-height' => true,
		'flex-width'  => true,
		'header-text' => array( 'site-title', 'site-description' ),				
	) );
		
	$inbox_header_arg = array(
		'default-image'          => '',
		'width'                  => 1900,
		'height'                 => 500,
		'flex-height'            => true,
		'header-text'            => true,
		'default-text-color'     => 'ffffff',		
		'flex-width'             => false,
		'wp-head-callback' 		 => 'inbox_header_title',						
	);
	add_theme_support( 'custom-header', $inbox_header_arg );

}
endif;
add_action( 'after_setup_theme', 'inbox_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function inbox_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'inbox_content_width', 1200 );
}
add_action( 'after_setup_theme', 'inbox_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function inbox_widgets_init() {	
	register_sidebar( array(
		'name'          => esc_html__( 'Main Sidebar', 'inbox' ),
		'id'            => 'sidebar-main',
		'description'   => esc_html__( 'Add widgets here.', 'inbox' ),
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );	
}
add_action( 'widgets_init', 'inbox_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function inbox_scripts() {

	$inbox_theme = wp_get_theme();
    $inbox_version = $inbox_theme['Version'];

	wp_enqueue_style( 'simplebar', get_template_directory_uri() . '/css/simplebar.css' );
	wp_enqueue_style( 'bootstrap', get_template_directory_uri() . '/css/bootstrap.css' );	
	wp_enqueue_style( 'inbox-social', get_template_directory_uri() . '/css/social-icons.css' );	
	wp_enqueue_style( 'inbox-style', get_stylesheet_uri() );
	
	wp_enqueue_script( 'jquery-simplebar', get_template_directory_uri() . '/js/simplebar.js', array('jquery'), $inbox_version, true );		
	wp_enqueue_script( 'jquery-bootstrap', get_template_directory_uri() . '/js/bootstrap.js', array('jquery'), $inbox_version, true );			
	wp_register_script( 'inbox-custom', get_template_directory_uri() . '/js/inbox-custom.js', array('jquery'), $inbox_version, true );			
	
	$inbox_translation_array = array(
		'inbox_load_string' => esc_html( 'Loading...', 'inbox' ),
	);
	wp_localize_script( 'inbox-custom', 'inbox_data', $inbox_translation_array );
	
	// Enqueued script with localized data.
	wp_enqueue_script( 'inbox-custom' );	
	
		
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'inbox_scripts' );

/**
 * Register custom fonts.
 */
function inbox_fonts_url() {

	$fonts_url = '';
	
	/* Translators: If there are characters in your language that are not
	* supported by Karla, translate this to 'off'. Do not translate
	* into your own language.
	*/
	$karla = _x( 'on', 'Karla: on or off', 'inbox' );	 
		 
	if ( 'off' !== $karla ) {
	$font_families = array();	
	 
	if ( 'off' !== $karla ) {
	$font_families[] = 'Karla:400,400i,700,700i';
	}	 
	 
	$query_args = array(
		'family' => urlencode( implode( '|', $font_families ) ),
		'subset' => urlencode( 'latin,latin-ext' ),
	);
	 
	$fonts_url = add_query_arg( $query_args, 'https://fonts.googleapis.com/css' );
	}
	 
	return esc_url_raw( $fonts_url );
}

function inbox_scripts_styles() {
	wp_enqueue_style( 'inbox-fonts', inbox_fonts_url(), array(), null );
}
add_action( 'wp_enqueue_scripts', 'inbox_scripts_styles' );

/**
 * WP Bootstrap Walker Class
 */
require get_template_directory() . '/inc/class-wp-bootstrap-navwalker.php'; 

/**
 * Excerpt Length Control
*/

function inbox_customexcerptlength( $length ) {

	if ( is_admin() ) {
		return $length;
	}
	else {
    	return 20;
	}
}

add_filter('excerpt_length', 'inbox_customexcerptlength');

/**
 * Extra Theme Functions
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Theme Customizer
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * About Theme Page
 */
require get_template_directory() . '/inc/admin/class-inbox-admin.php';
