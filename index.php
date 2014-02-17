<?php
//set_include_path(get_include_path() . PATH_SEPARATOR . '/home/dudeyjon/public_html/digipoem.co.uk/include'); 
?>

<?php 
echo get_include_path();

include_once('include/head.php'); ?>

<div id="container" data-role="page">

	<?php include_once('include/header.php'); ?>

	<div id="main" role="main">
	
		<div data-role="content" id="content">
		
			<div class="col left">
			<h1>Create a digital poem</h1>
				<p>digiPoem generates visual representations of poetry and other texts using <a href="http://www.flickr.com" alt="flickr">flickr</a>.</p>
				<p>Save, send and share digital poetry, no is registration required. Start by creating a digital poem using the form below...</p>
			<br />
			
			<?php
				include_once('poem-write.php');
			?>
			</div>
		
			<div class="col right">
			<h2>Updates!</h2>
			<p>digiPoem has recently been updated to <a href="http://www.digipoem.co.uk/about" title="About digiPoem">version 3.0</a> and has moved from dudeyjon.com/digipoem to <a href="http://www.digipoem.co.uk" title="digiPoem">digipoem.co.uk</a>.</p>
			<br />
			<?php
				include_once('poem-latest.php');
			?>
			</div>
			
		</div>
			
	</div>

	<?php include_once('footer.php'); ?>

 </div>
 
 <?php include_once('foot.php'); ?>