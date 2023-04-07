<!--https://www.youtube.com/watch?v=IY5UN82FZ2Q-->
<!-- 14.50-->

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



<div class="container">

<?php
//Get a list of file paths using the glob function.
$fileList = glob('src/stamps/*');
 
//Loop through the array that glob returned.
foreach($fileList as $filename){
//print them out onto the screen.

$str_arr = explode (".", $filename);  
$name = $str_arr[1];
$price = $str_arr[2];
$cents = $str_arr[3];
?> 

<div class="image">
<img id="myImg" src="<?php echo $filename;?>" alt="Snow" style="height:100px;" onclick="enLarge(this)";> <!-- The Modal -->
<h3><?php echo $name;?></h3>
<h3><?php echo $price.".".$cents ;?></h3>
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


<script src="/src/main.js"></script>

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



</body>
</html>