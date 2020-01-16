<?php
/**
* Plugin Name: WooCommerce Email Check
* Description: Check email address entered by the customer on the checkout page and notify them if we believe there is a typo
* Version: 1.0.0
* Author: Alexander Mravcak
* Author URI: https://vizio.sk
* License: GPLv2
* Text Domain: woocommerce-email-check
* Domain Path: /languages/
*/

function woocommerce_email_check_run() {
	add_action( 'wp_enqueue_scripts', 'woocommerce_email_check_enqueue' );
	add_action( 'plugins_loaded', 'woocommerce_email_check_textdomain' );
}

function woocommerce_email_check_textdomain() {
	load_plugin_textdomain( 'woocommerce-email-check', false, 'woocommerce-email-check/languages' );
}

function woocommerce_email_check_enqueue() {
	if( !class_exists('WooCommerce') ) {
		return;
	}

	if( is_checkout() ) {
		wp_enqueue_script( 'woocommerce-email-check', plugin_dir_url( __FILE__ ) . '/public/woocommerce-email-check.js', [], '1.0.0', true );

		wp_localize_script( 'woocommerce-email-check', 'translations', array(
			'dym'      => esc_html__( 'Did you mean', 'woocommerce-email-check' ),
		));
	}
}

woocommerce_email_check_run();
