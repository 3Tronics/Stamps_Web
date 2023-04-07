<?php
include("rdstamps_tree.class.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,300&display=swap" rel="stylesheet"> 
  <link rel="stylesheet" href="/src/styles.css">
  <link rel="stylesheet" href="/src/modal.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <title> This is the Home page</title>
  <style>
	
	div.container{

  	    position: absolute;
  	    top: 119px;
  	    left: 179px;
  	    border: 1px solid silver;	
	}
	body, h1, h2, h3, h4, h5, h6  {
 		 font-family:  Helvetica, sans-serif ;
	}
    .demo {
            max-width: 180px;
            overflow: auto;
            border: 1px solid silver;
            min-height: 100px;
    }
  </style>
  <link rel="stylesheet" href="/src/style.min_formatted.css" />
  
</head>

<body>

  
    <header>
        <div class="overlay"></div>
          <nav>
          <h2> RDSTAMPS </h2>
            <ul>
              <li> <a href="index.php">HOME</a></li>
              <li> <a href="#">About</a></li>
              <li class="cart">
                <a href="cart.html">
                  <button class="btn"><i class="fa fa-cart-plus"></i></button>Cart<span>0</span>
                </a>
              </li>
           </ul>
          </nav>
   </header>
    
   <a href="#" onclick="expandAll();return false">Expand all nodes</a><br>
   <a href="#" onclick="collapseAll();return false">Collapse all nodes</a><br>


<?php



$tree = new rdstamps_tree();	// Creating new tree object

// Adding example nodes
$tree->addToArray(1,"CANADA",0,"");
$tree->addToArray(2,"1950-1959",1,"CAN/1952-1959","frmMain","");
$tree->addToArray(3,"1960-1969",1,"CAN/1960-1969","frmMain","");
$tree->addToArray(4,"1970-1979",1,"CAN/1970-1979","frmMain","");
$tree->addToArray(5,"1980-1989",1,"CAN/1980-1989","frmMain","");
$tree->addToArray(6,"1990-1999",1,"CAN/1990-1999","frmMain","");
$tree->addToArray(7,"USA",0,"");
$tree->addToArray(8,"1950-1959",7,"USA/1950-1959","frmMain","");
$tree->addToArray(9,"1960-1969",7,"USA/1960-1969","frmMain","");
$tree->addToArray(10,"1970-1979",7,"USA/1970-1979","frmMain","");
$tree->addToArray(11,"1980-1989",7,"USA/1980-1989","frmMain","");
$tree->addToArray(12,"1990-1999",7,"USA/1990-1999","frmMain","");


$tree->writeCSS();
$tree->writeJavascript();
$tree->drawTree();


//Get a list of file paths using the glob function.


//Loop through the array that glob returned.
$fileList = glob("$folder", GLOB_BRACE);
foreach($fileList as $filename){
//print them out onto the screen.

$str_arr = explode (".", $filename);  
$name = $str_arr[1];
$price = $str_arr[2];
$cents = $str_arr[3];
?> 

<div class="image">
<img id="myImg" src="<?php echo $filename;?>" alt="Snow" style="height:100px;" onclick="enLarge(this)";> <!-- The Modal -->
<h5><?php echo $name;?></h5>
<h5><?php echo $price.".".$cents ;?></h5>
<a class="add-cart cart2" href="#">Add Cart</a>

<?php
echo '</div>';
}
?> 


<div id="myModal" class="modal">
  <span class="close">&times;</span>
  <img class="modal-content" id="img01">
  <div id="caption"></div>
</div>

<script>
  // Get the modal

  var modal = document.getElementById("myModal");
  
  // Get the image and insert it inside the modal - use its "alt" text as a caption
  var img = document.getElementById("myImg");
  var modalImg = document.getElementById("img01");
  var captionText = document.getElementById("caption");
  
  function enLarge(this_img) {
    modal.style.display = "block";
    modalImg.src = this_img.src;
    captionText.innerHTML = this_img.alt;
  }
  
  // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };
  
  </script>
 <script src="/src/main.js"></script>
 

</body>
</html>