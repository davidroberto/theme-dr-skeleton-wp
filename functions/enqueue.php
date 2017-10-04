<?php

function dr_setup() {
  add_theme_support('post-formats');
  add_theme_support('post-thumbnails');
  add_theme_support('menus');

  // Suppr balise méta non nécessaire
  remove_action('wp_head', 'rsd_link');
  remove_action('wp_head', 'wlwmanifest_link');
  remove_action('wp_head', 'wp_generator');
}
add_action( 'after_setup_theme', 'dr_setup' );


// ------------------------------------
//
//     enqueue scripts
//
// ------------------------------------

function dr_enqueue_scripts() {

    // load custom script
    wp_enqueue_script('custom-js', get_template_directory_uri() . '/gulp-assets/js/dist/global.min.js', array( 'jquery' ), false, true);

    // pass the template url to my global js script
    $translation_array = array( 'templateUrl' => get_stylesheet_directory_uri() );
    wp_localize_script( 'custom-js', 'myScript', $translation_array );

    // load the global css
    wp_enqueue_style( 'global-css', get_template_directory_uri() . '/gulp-assets/css/dist/styles.min.css' );


}
add_action('wp_enqueue_scripts', 'dr_enqueue_scripts', 0);
