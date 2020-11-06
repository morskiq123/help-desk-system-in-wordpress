<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** MySQL database username */
define( 'DB_USER', 'team20' );

/** MySQL database password */
define( 'DB_PASSWORD', 'Team20pa55word' );

/** MySQL hostname */
define( 'DB_HOST', 'team20.mooo.com' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );
/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         ',L)#xI.:}LA4}ol5N(K>{/1(VgdjoNi8D/!*uH[t#;qSXeD/7iZ*Qgm|M6{Q{nMs' );
define( 'SECURE_AUTH_KEY',  'OwxOo|f|_#]<;ziuzL=I8v10PW=1SzK]l{zrv< *<@1;gO#R!U[O mG1j,&>RTp|' );
define( 'LOGGED_IN_KEY',    '!}*D{ExID JffpIIryG(@tfuQs[7sx`E_.}9V3e0bOhUDqWzrtd:3nW}p fm{$3 ' );
define( 'NONCE_KEY',        'F  x*V{>2vc-<aL%Zn90)`sHIe#xbA?-`B5M.TP#e6=0KkP;;zy[=Y^O}{}9FlT=' );
define( 'AUTH_SALT',        '<P38>zL.dKCo6z9/Y3R63;/QDBm7Bz-wRN-VQK#5T;+;e/:Af9zSo^*@a:FBMvBI' );
define( 'SECURE_AUTH_SALT', 'yRF5 YXV-/gU:cUNnQ;n,WOB-!~nuqcw=_9q_.Yc<?!7yq@QvpzyBnH{+[T/L}>J' );
define( 'LOGGED_IN_SALT',   '4<t@cY(9RRD5VS8OdK,m&Hsw<HJ_k)A-F(:*N@;g/3Y|j9A%WL:~S(o66THai8U8' );
define( 'NONCE_SALT',       ')ARJ4W`>fiCymk.0kEOB;kPq2Ip+a,R }Y)<Gp>kgh75,DXz[T!`WE:v8QJgW./!' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once( ABSPATH . 'wp-settings.php' );
