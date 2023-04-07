<!--https://www.youtube.com/watch?v=IY5UN82FZ2Q-->
<!-- 0001 -->

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
    

    Click to open
    <div id="evts" class="demo"></div>
 
   

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="/src/jstree.min_formatted.js"></script>
 
<script>

var folder  = "src/stamps/*";

$.ajax({
  url: "index.php",
  method: "POST",
  data: { "folder": folder }
})
alert('hello')

</script>


  <script>




//JSTREE
        // interaction and events
        $('#evts_button').on("click", function() {
            var instance = $('#evts').jstree(true);
            instance.deselect_all();
            instance.select_node('1');
        });

        $('#evts')
            .on("changed.jstree", function(e, data) {
                if (data.selected.length) {
                    if (data.instance.get_node(data.selected[0]).text == "1960 to 1969") {
                        //alert(data.instance.get_node(data.selected[0]).id)
                        //<!--alert('The selected node is: ' + data.instance.get_node(data.selected[0]).text);-->
 			
  			

                    }
                    alert(data.instance.get_node(data.selected[0]).id)
                }
            })

    	.jstree({
          'core': {
            'multiple': false,
            'data': 
            [
              {

                        "text": "CANADA",
                        "children": 
                 	[ 
                    	{
                        	"text": "1960 to 1969", "id": 1
                        	
                    	},  
			{               	
                        	"text": "1970 to 1979", "id": 2
                        	
                    	},
                    	{
                        	"text": "1980 to 1989",	 "id": 3
			
                    	}
                	]
                    },

		    {
                        "text": "USA",
                        "children": 
                 	[ 
                    	{
                        	"text": "1981", "id": 4
                        	
                    	},
                    	{
                        	"text": "1965", "id": 5
				
                    	}
                	]

              }
            ]
        }
    });
</script>
  

<div class="container">

<?php

//Get a list of file paths using the glob function.


	
echo $folder;
if(isset($_POST['folder']))
{
    $folder = $_POST['folder'];

    echo ($folder);
}
else{
 echo ("not set");

}

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