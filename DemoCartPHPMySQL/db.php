<?php

$db_host='fdb6.awardspace.net'; //Should contain the "Database Host" value
$db_name='1667504_stamps'; //Should contain the "Database Name" value
$db_user='1667504_stamps'; //Should contain the "Database User" value
$db_pass='Vs9n2591fZUUA'; //Should contain the "Database Password" value

$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
		die();
}

?>