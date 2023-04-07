<?php

include("dhtmlgoodies_tree.class.php");

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<head>
  	<meta charset="utf-8">
  	<meta name="viewport" content="width=device-width,initial-scale=1.0">
  	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>RDStamps</title>
	<style type="text/css">
	a{
		text-decoration:none;
		font-family:arial;
		font-size:0.8em;
	}
	</style>
</head>
<body>
<a href="#" onclick="expandAll();return false">Expand all nodes</a><br>
<a href="#" onclick="collapseAll();return false">Collapse all nodes</a><br>
<?

$tree = new dhtmlgoodies_tree();	// Creating new tree object

// Adding example nodes
$tree->addToArray(1,"CANADA",0,"");
$tree->addToArray(2,"1950-1959",1,"http://www.3tronics.com","frmMain","");
$tree->addToArray(3,"1960-1969",1,"http://www.3tronics.com","frmMain","");
$tree->addToArray(4,"1970-1979",1,"http://www.3tronics.com","frmMain","");
$tree->addToArray(5,"1980-1989",1,"http://www.3tronics.com","frmMain","");
$tree->addToArray(6,"1990-1999",1,"http://www.3tronics.com","frmMain","");
$tree->addToArray(7,"USA",0,"");
$tree->addToArray(2,"1950-1959",7,"http://www.3tronics.com","frmMain","");
$tree->addToArray(3,"1960-1969",7,"http://www.3tronics.com","frmMain","");
$tree->addToArray(4,"1970-1979",7,"http://www.3tronics.com","frmMain","");
$tree->addToArray(5,"1980-1989",7,"http://www.3tronics.com","frmMain","");
$tree->addToArray(6,"1990-1999",7,"http://www.3tronics.com","frmMain","");


$tree->writeCSS();
$tree->writeJavascript();
$tree->drawTree();

?>
</body>
</html>
	
	