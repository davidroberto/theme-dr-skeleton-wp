<?php

// Twig Global Context
// All entries in the $data Table can be used in any template
function add_to_context($data){
    // add the yoast breadcrumb to the twig context
    if ( function_exists( 'yoast_breadcrumb' ) ) {
        $data['breadcrumb'] = yoast_breadcrumb('<nav class="breadcrumb">','</nav>', false);
    }

    // initialize the menu with timber and add it to the twig context
    $data['menu'] = new TimberMenu('header-menu');

    //$data['options'] = get_fields('option');

    return $data;
}
add_filter('timber_context', 'add_to_context');

// ------------------------------------
//
//     TWIG Filters
//
// ------------------------------------


function add_to_twig($twig){
  /* this is where you can add your own fuctions to twig */
    $twig->addExtension(new Twig_Extension_StringLoader());
    $twig->addFilter('format_date', new Twig_Filter_Function('format_date'));

  return $twig;
}
add_filter('get_twig', 'add_to_twig');

// order the multidim array by term order value, in order to allow the term order plugin to sort the subcategories in template list
function usortFilter($array){

    usort($array, 'cmp');
    return $array;
}