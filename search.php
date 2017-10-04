<?php
/**
 * Search results page
 *
 * Methods for TimberHelper can be found in the /functions sub-directory
 *
 * @package 	WordPress
 * @subpackage 	Timber
 * @since 		Timber 0.1
 */

    $context = Timber::get_context();
    $context['query'] = get_search_query();
    $context['posts'] = Timber::get_posts();
    $context['pagination'] = Timber::get_pagination();

    $context['menu'] = new TimberMenu('header-menu');

Timber::render(array('search.twig'), $context);