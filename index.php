<!DOCTYPE html>
<html lang="en">
<head>

<?php  include("rdstamps_tree.class.php"); ?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>


  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,300&display=swap" rel="stylesheet"> 
  <!--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">-->


  <link rel="stylesheet" href="/scratch-stamps/src/styles.css">
  <link rel="stylesheet" href="/scratch-stamps/src/modal.css">
  <link rel="stylesheet" href="/scratch-stamps/src/style.min_formatted.css" />
 
  <link rel="stylesheet" href="/src/styles.css">
  <link rel="stylesheet" href="/src/modal.css">
  <link rel="stylesheet" href="/src/style.min_formatted.css" />

   <title> This is the Home page V01.52_XX</title>


<style>
		/*

		This is one of the free scripts from www.rdstamps.com
		You are free to use this script as long as this copyright message is kept intact

		(c) Alf Magne Kalleland, http://www.rdstamps.com - 2005

		*/
		#rdstamps_tree li{
			list-style-type:none;
			font-family: arial;
			font-size:14px;
			
		}
		#rdstamps_topNodes{
			margin-left:0px;
			padding-left:0px;
			
		}
		#rdstamps_topNodes ul{
			margin-left:20px;
			padding-left:0px;
			display:none;
			
		}
		#rdstamps_tree .tree_link{
			line-height:13px;
			padding-left:2px;
			background: white;
		}
		#rdstamps_tree img{
			padding-top:2px;
		
		}
		#rdstamps_tree a{
			color: #000000;
			text-decoration:none;
		}
		.activeNodeLink{
			background-color: #316AC5;
			color: #FFFFFF;
			font-weight:bold;
		}

	/*
		This is one of the free scripts from www.rdstamps.com
  */

	div.container{

  	    position: absolute;
  	    top: 119px;
  	    left: 179px;
  	    border: 1px solid silver;	
	}
	body, h1, h2, h3, h4, h5, h6  {
 		 font-family:  Helvetica, sans-serif ;
	}
  .tree {
            max-width: 180px;
            overflow: auto;
            border: 1px solid silver;
            min-height: 100px;
  }
  header {

    background: #bfff00;
  }

  .image{

    margin-top:10px; /*to have the space above the image*/
    margin-right:10px; /*to have the space under the image*/
    margin-left:1px; /*to have the space above the image*/
    margin-bottom:1px; /*to have the space under the image*/
  }
  </style>
   
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
	            	<form method="get" action="cart.html">
    		          <button class="btn"><i class="fa fa-cart-plus"></i>Cart<span>0</span></button>
		            </form>           
              </li>
           </ul>
          </nav>
   </header>
    
   <div  class="expand" id="clks" >
      <a href="#" onclick="expandAll();return false">Expand all nodes</a><br>
      <a href="#" onclick="collapseAll();return false">Collapse all nodes</a><br>
   </div>

   
    <?php
   

    
    

$tree = new rdstamps_tree();	// Creating new tree object
    // Adding example nodes

$tree->addToArray(1,"CANADA",0,"");
$tree->addToArray(2,"1920-1929",1,"src/stamps_for_sale/CAN/1920-1929","frmMain","");
$tree->addToArray(3,"1930-1939",1,"src/stamps_for_sale/CAN/1930-1939","frmMain","");
$tree->addToArray(4,"1940-1949",1,"src/stamps_for_sale/CAN/1940-1949","frmMain","");
$tree->addToArray(5,"1950-1959",1,"src/stamps_for_sale/CAN/1950-1959","frmMain","");
$tree->addToArray(6,"1960-1969",1,"src/stamps_for_sale/CAN/1960-1969","frmMain","");
$tree->addToArray(7,"1970-1979",1,"src/stamps_for_sale/CAN/1970-1979","frmMain","");
$tree->addToArray(8,"1980-1989",1,"src/stamps_for_sale/CAN/1980-1989","frmMain","");
$tree->addToArray(9,"1990-1999",1,"src/stamps_for_sale/CAN/1990-1999","frmMain","");
$tree->addToArray(10,"USA",0,"");
$tree->addToArray(11,"1920-1929",10,"src/stamps_for_sale/USA/1920-1929","frmMain","");
$tree->addToArray(12,"1930-1939",10,"src/stamps_for_sale/USA/1930-1939","frmMain","");
$tree->addToArray(13,"1940-1949",10,"src/stamps_for_sale/USA/1940-1949","frmMain","");
$tree->addToArray(14,"1950-1959",10,"src/stamps_for_sale/USA/1950-1959","frmMain","");
$tree->addToArray(15,"1960-1969",10,"src/stamps_for_sale/USA/1960-1969","frmMain","");
$tree->addToArray(16,"1970-1979",10,"src/stamps_for_sale/USA/1970-1979","frmMain","");
$tree->addToArray(17,"1980-1989",10,"src/stamps_for_sale/USA/1980-1989","frmMain","");
$tree->addToArray(18,"1990-1999",10,"src/stamps_for_sale/USA/1990-1999","frmMain","");


echo "<div class=\"tree\" id=\"evts\" >"; 
$tree->writeJavascript();
$tree->drawTree();

echo "</div>";  
echo "<div class=\"container\" id=\"stps\">";  

$cookiename="rdstamps_current_folder";

if(!isset($_COOKIE[$cookiename])) {
  $folder = 'src/stamps_for_sale/CAN/1920-1929/*';
}
else{
  $folder=$_COOKIE[$cookiename]."/*";
}	
//Get a list of file paths using the glob function.



//Loop through the array that glob returned.
$fileList = glob("$folder", GLOB_BRACE);
foreach($fileList as $filename){
//print them out onto the screen.

  $str_arr = explode (".", $filename);  
  if (count($str_arr)>5){
    $year = $str_arr[2];
    $name=str_ireplace("_"," ",$str_arr[3]);
    $price = $str_arr[4];
    $cents = $str_arr[5];
  }
  else{
    $year = "Error in name";
  }

  echo "<div class=\"image\">";
  $str1="<img alt=\"stamp_page_image\" src=\"".$filename."\" style=height:100px onclick=enLarge(this)>";
  echo $str1;
  echo "<h5>$year &nbsp; &nbsp;&nbsp;$price.$cents </h5>";
  echo "<h5>$name</h5>";
  echo "<a class=\"add-cart cart2\" href=\"#\">Add Cart</a>";
  echo "</div>"; 
}
//<img id="myImg"            src="src/stamps/0000002.GBR.1960.Queen_Elizabeth.$0.99.jpg" alt="Snow" style="height:100px;" onclick="enLarge(this)">}
//<img id="stamp_page_image" src="src/stamps/0000002.GBR.1960.Queen_Elizabeth.$0.99.jpg" alt="Snow" style="height:100px " onclick="enLarge(this)">
echo "</div>";  

?> 


<div id="myModal" class="modal">
  <span class="close">&times;</span>
  <img class="modal-content" alt="zoom_stamp" id="img01" src="empty">
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
 <script src="/scratch-stamps/src/main.js"></script>
 <script src="/src/main.js"></script>
 

</body>
</html>