<?php
    /**
     * @since 6.5.0 https://github.com/aamplugin/advanced-access-manager/issues/104
     * @since 6.0.0 Initial implementation of the template
     *
     * @version 6.5.0
     * */
?>

<?php if (defined('AAM_KEY')) { ?>
    <iframe src="<?php echo admin_url('admin.php?page=aam&aamframe=user&id=' . $params->user->ID); ?>" width="100%" id="aam-iframe" style="margin-top:10px;"></iframe>
    <script><?php echo file_get_contents(AAM_MEDIA . '/js/iframe-resizer.js'); ?></script>
<?php }