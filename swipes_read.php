<?php
// Set the JSON header
header("Content-type: text/json");


$username = "Kevin";
$password = "Flipper1679$";
$database = "makeohio";

mysql_connect(localhost, $username, $password);
@mysql_select_db($database) or die("Unable to find database");

function pullAll(){
	
}

$query = "SELECT * FROM temperatures WHERE device_ID_FK = '9' ORDER BY timestamp DESC";
$result = mysql_query($query);

    while($row = mysql_fetch_array($result)) {
        $value = $row['tempI'];
        $value2 = $row['tempO'];
        $timestamp = strtotime($row['timestamp']) * 1000;
        $dataInside[] = [$timestamp, floatval($value)];
        $dataOutside[] = [$timestamp, floatval($value2)];
    }   
   
    $allDataTemp = [$dataInside,$dataOutside];
   echo json_encode($allDataTemp);
?>	