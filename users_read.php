<?php
// Set the JSON header
//header("Content-type: text/json");


$username = "Kevin";
$password = "Flipper1679$";
$database = "makeohio";

mysql_connect(localhost, $username, $password);
@mysql_select_db($database) or die("Unable to find database");

if(isset($_POST['action']) && !empty($_POST['action'])) {
	
    $action = $_POST['action'];
    switch($action) {
        case 'pullAll' : pullAll();break;
        case 'pullOne' : pullone();break;
	}
}

function pullAll(){
	
	$query = "SELECT * FROM users";
	$resultsRaw = mysql_query($query);
	while($row = mysql_fetch_array($resultsRaw, MYSQL_ASSOC)){
		$results[] = $row;
	}
	
	echo json_encode($results);
}

function pullOne(){
	$id = $_POST['user_id'];
	$query = "SELECT * FROM users WHERE user_id ="+$id;
	$result = mysql_query($query);
	return json_encode($result);
}

?>	