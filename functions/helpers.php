<?php

// Contains all generic global helpers functions

/**
 * Add All Custom Post Types to search
 *
 * Returns the main $query.
 *
 * @access      public
 * @since       1.0
 * @return      $query
 */

function dr_add_cpts_to_search($query) {

    // Check to verify it's search page
    if( is_search() ) {
        // Get post types
        $post_types = get_post_types(array('public' => true, 'exclude_from_search' => false), 'objects');
        $searchable_types = array();
        // Add available post types
        if( $post_types ) {
            foreach( $post_types as $type) {
                $searchable_types[] = $type->name;
            }
        }

        array_push($searchable_types, 'nav_menu_item');
        $query->set( 'post_type', $searchable_types );
    }
    return $query;
}
add_action( 'pre_get_posts', 'dr_add_cpts_to_search' );
