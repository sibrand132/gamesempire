<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "gamesempire");

$result = $conn->query("SELECT * FROM game");

$outp = "";
$str="";
$rs=null;
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{"Tytul":"'  . $rs["title"] . '",';
    $outp .= '"MaleLogo":"'   . $rs["smallLogo"]        . '",';
    $outp .= '"DuzeLogo":"'   . $rs["largeLogo"]        . '",';
    $outp .= '"Opis":"'   . $rs["description"]        . '",';
    $outp .= '"LogoStrony":"'   . $rs["pageLogo"]        . '",';
    $outp .= '"Platforma": [';

    $resultPlatform = $conn->query("Select p.name From platform p, gameplatform gp Where p.idPlatform = gp.idPlatform and gp.idGame=".(string)$rs['id']);
    while($rs2 = $resultPlatform->fetch_array(MYSQLI_ASSOC)){
        $str.='"'.$rs2['name'].'",';
    }
    $str = substr($str,0,strlen($str)-1);
    $outp .=$str.'],';
    $outp .= '"Cena":"'. $rs["price"]     . '"}';


}
$outp ='{"records":['.$outp.']}';

$conn->close();

//$resultPlatform = $conn->query("Select p.name From platform p, gameplatform gp Where p.idPlatform = gp.idPlatform and gp.idGame=$");
echo($outp);

?>