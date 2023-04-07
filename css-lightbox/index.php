<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">

	<title>CSS Lightbox Made Practicle with PHP</title>
	<meta name="description" content="CSS Lightbox Made Practicle with PHP">
	<meta name="author" content="Stephen Greig - Tangled in Design">

	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
	<link rel="stylesheet" href="css/style.css">

	<!--[if lt IE 9]>
	<script src="js/html5-enabler.js"></script>
	<![endif]-->

</head>

<body>

	<div class="container">

		<h1>New Zealand North Island (CSS Lightbox)</h1>

		<ul class="gallery">

			<?php
				$captions = array(
					/*01*/ "Hunua Falls, Auckland",
					/*02*/ "Hobbit House, Hobbiton (Matamata)",
					/*03*/ "'Hole in the Rock', Bay of Islands",
					/*04*/ "Cape Reinga Lighthouse, the Northmost point of New Zealand",
					/*05*/ "Rainbow Falls, Kerikeri",
					/*06*/ "Arai Te Uru, Northland",
					/*07*/ "View from Tourist Drive near Matauri Bay, Northland",
					/*08*/ "Kitekite Falls, Piha, Auckland",
					/*09*/ "The distinctive line where the Pacific Ocean and Tasman Sea meet",
					/*10*/ "View over Auckland from the summit of Mt Eden",
					/*11*/ "View over The Green Dragon Inn, Hobbiton (Matamata)",
					/*12*/ "View over Matauri Bay, Northland",
					/*13*/ "Auckland Harbour Bridge Bungy Jump",
					/*14*/ "Sandboarding at the Ninety Mile Beach",
					/*15*/ "Haruru Falls, near Paihia"
				); 

				for($n = 1; $n <= count($captions); $n++):
			?>

			<li>
				<a href="#img<?php echo $n; ?>"><img src="images/<?php echo $n; ?>.jpg" alt="<?php echo $captions[$n-1]; ?> Thumb"></a>
				<article id="img<?php echo $n; ?>">
					<figure>
						<a href="#img<?php if($n == count($captions)) { echo 1; } else { echo $n+1; } ?>"><img src="images/<?php echo $n; ?>.jpg" alt="<?php echo $captions[$n-1]; ?>"></a>
					    <figcaption><?php echo $captions[$n-1]; ?></figcaption>
					</figure>
					<nav>
						<a class="close" href="#close">Close</a>
						<a class="arrow prev" href="#img<?php if($n == 1) { echo count($captions); } else { echo $n-1; } ?>">Previous</a>
						<a class="arrow next" href="#img<?php if($n == count($captions)) { echo 1; } else { echo $n+1; } ?>">Next</a>
					</nav>
				</article>
			</li>

			<?php endfor; ?>

	    </ul>

	</div>

</body>
</html>