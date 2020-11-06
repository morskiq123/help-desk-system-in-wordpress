<?php

ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *', false);
header("Access-Control-Allow-Headers: *");
require_once("../../../wp-load.php");

$server = "localhost";
$username = "team20";
$password = "Team20pa55word";
$dbname = "main_db";

if( !isset($_POST['username']) or !isset($_POST['password']) ){
        echo("Missing username and/or password");
        exit();
};

if ($_POST['username'] !== $username or $_POST['password'] !== $password)
{
    echo("Wrong credentials");
    exit();
};
global $connection;
$connection = new mysqli($server, $username, $password, $dbname);
if ($connection->connect_error)
{
    exit('Error connecting to database');
};
$connection->set_charset("utf8mb4");
function auto_specialist($type){
    $points =array();
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT current_id, COUNT(current_id) FROM Problems GROUP BY current_id");
    $sql->execute();
    $result = $sql->get_result();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
          $result_array[] = $row;
        };
    }

    foreach ($result_array as $row) {
        $points[$row["current_id"]] = $row["COUNT(current_id)"];
    }
    $result_array_2 = array();
    $sql = $GLOBALS['connection']->prepare("SELECT * FROM Specialist");
    $sql->execute();
    $result = $sql->get_result();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
          $result_array_2[] = $row;
        };
    }

    foreach ($result_array_2 as $row) {
        if ($row["speciality"] == $type) {
            $points[$row["id"]] = $points[$row["id"]] - 5;
        }
        $today = date("Y-m-d");
        $future = date("Y-m-d", strtotime("+3 day"));
        $period = new DatePeriod(
            new DateTime($today),
            new DateInterval('P1D'),
            new DateTime($future)
        );
        foreach ($period as $key => $value) {
            if(strpos($row["speciality"],$value->format('d/m/Y')) !== false){
                $points[$row["id"]] = $points[$row["id"]] + 7;
            }
                 
        }
    }

    $max = 99999999999999999999;
    $specialist = "";
    foreach ($points as $id => $points) {
        if ($points < $max) {
            $max = $points;
            $specialist = $id;
        }
    }
    print_r($specialist);
    return $specialist;
}

function new_problem() {
    $post_date = explode("-",$_POST['Date']);
    $call_date = $post_date[2]."/".$post_date[1]."/".$post_date[0];
    if ($_POST['InitialSpecialist'] == "Auto") {
        $initial_specialist = auto_specialist($_POST['ProblemType']);
    }else{
        $post_initial_specialist = explode(" ",$_POST['InitialSpecialist']);
        $initial_specialist = $post_initial_specialist[2];
    } 
    $history = $call_date." ".$_POST['Time']." Problem created \n";
    $sql = $GLOBALS['connection']->prepare("INSERT INTO Problems(problem_id, employee_id, call_time, call_date, problem_type, priority, reason, assigned_id, current_id, history, status) VALUES (?,?,?,?,?,?,?,?,?,?,'unsolved');");
    $sql->bind_param("ssssssssss",$_POST['ProblemID'], $_POST['EmployeeID'], $_POST['Time'], $call_date, $_POST['ProblemType'], $_POST['Priority'], $_POST['Reason'], $initial_specialist, $initial_specialist, $history);
    $sql->execute();
    if ($sql->affected_rows !== 0)
        {
            echo "Insert failed";
            exit();
        };
    echo("Insert successfull");

}
function getID(){
    $current_user = wp_get_current_user();
    $username = $current_user->user_login;
    $sql = $GLOBALS['connection']->prepare("SELECT id FROM Employee WHERE Employee.username=?");
    $sql->bind_param("s",$username);
    $sql->execute();
    $result = $sql->get_result();
    if ($result->num_rows > 0) {
       // output data of each row
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return $result_array;
}
function return_all_problemID($status){
    $username = getID()[0]["id"];
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT Problems.problem_id FROM Problems WHERE Problems.status=? AND Problems.current_id=? LIMIT 10;");
    $sql->bind_param("ss",$status,$username);
    $sql->execute();
    $result = $sql->get_result();
    if ($result->num_rows > 0) {
       // output data of each row
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function return_all_problemID_username(){
    $username = getID()[0]["id"];
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT Problems.problem_id, status FROM Problems WHERE Problems.employee_id=? LIMIT 20");
    $sql->bind_param("s",$username);
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
       // output data of each row
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function getProblem($problem_id){
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT * FROM (SELECT * FROM Problems LEFT JOIN Employee ON Employee.id=Problems.assigned_id WHERE problem_id=?) AS ONE LEFT JOIN Solution ON ONE.problem_id=Solution.solution_id;");
    $sql->bind_param("s",$problem_id);
    $sql->execute();
    $result = $sql->get_result();
    if ($result->num_rows > 0) {
       // output data of each row
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function return_search($search){//May not be needed
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT * FROM (SELECT * FROM Problems INNER JOIN Solution on Solution.solution_id=Problems.problem_id WHERE Problems.status='solved') AS ONE LEFT JOIN Employee ON Employee.id=ONE.assigned_id;");
    $sql->execute();
    $result = $sql->get_result();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            if (strpos(implode(":",$row), $search) !== false) {
                $result_array[] = $row;
            }
            
        };
    }
    return json_encode($result_array);
}

function update_problem($status){
    if (strlen($_POST['resolved_date']) !== 0) {
        $post_date = explode("-",$_POST['resolved_date']);
        $solve_date = $post_date[2]."/".$post_date[1]."/".$post_date[0];
    }else{
        $solve_date = "";
    }
    if ($_POST['CurrentSpecialist'] == "Auto") {
        $current_id = auto_specialist($_POST['problem_type']);
    }else{
        $post_current_id = explode(" ", $_POST['CurrentSpecialist']);
        $current_id = $post_current_id[2];
    }

    $result_array = array();
        $sql = $GLOBALS['connection']->prepare("UPDATE Problems SET problem_type=?,priority=?,solution_date=?,status=?, current_id=?, history=? WHERE problem_id=?");
        $sql->bind_param("sisssss",$_POST['problem_type'],$_POST['priority'],$solve_date,$_POST['status'],$current_id,$_POST['history'],$_POST['problem_id']);
        $sql->execute();
   $sql_2 = "INSERT INTO Solution(solution_id, solution) VALUES (?,?) ";
    $sql_2->bind_param("ss",$_POST['problem_id'],$_POST['problem_solution']);
    $sql_2->execute();      

}


function generateID() {
    $random_id = mt_rand(100000, 999999);
    $result_array = array_merge(json_decode(return_all_problemID("solved")),json_decode(return_all_problemID("unsolved")));
    for ($i=0; $i < count($result_array) ; $i++) { 
        if($result_array[$i]->problem_id == $random_id){
            generateID();
        }
    }
    return $random_id;
}

function getAllSpecID(){
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT * FROM Employee WHERE Employee.job_title='Specialist';");
    $sql->execute();
    $result = $sql->get_result();
    if ($result->num_rows > 0) {
       // output data of each row
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function getWpUsername(){
    return $current_user = wp_get_current_user()->user_login;
}

function getEmployee($employee_id){
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT * FROM Employee WHERE Employee.id= ?");
    $sql->bind_param("s",$employee_id);
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

 
function add_users(){
	 $sql = $GLOBALS['connection']->prepare("INSERT INTO `Employee`(`id`, `username`, `first_name`, `last_name`, `job_title`, `telephone_num`, `branch`) VALUES (?,?,?,?,?,?,?);");
     $sql->bind_param("sssssss",$_POST['ID'],$_POST['Uname'],$_POST['FirstName'],$_POST['LastName'],$_POST['JobTitle'],$_POST['PhoneNumber'],$_POST['Branch']);
     $sql->execute();
     
 	echo("Insert successfull");
	}

function getRecords(){
  $result_array = array();
  $sql = $GLOBALS['connection']->prepare("SELECT `date` FROM Records");
  $sql->execute();
    $result = $sql->get_result();
  if ($result->num_rows > 0) {
     // output data of each row
      while($row = $result->fetch_assoc()) {
          $result_array[] = $row;
      };
  }
  $sql2 = $GLOBALS['connection']->prepare("SELECT call_date AS date FROM Problems");
  $sql2->execute();
    $result = $sql2->get_result();
  if ($result->num_rows > 0) {
     // output data of each row
      while($row = $result->fetch_assoc()) {
          $result_array[] = $row;
      };
  }
    return json_encode($result_array);
  }

function updateToworking($problem_id){
    $user_id = getID()[0]["id"];
    $date = date("d/m/Y");
	$sql = $GLOBALS['connection']->prepare("INSERT INTO Records(employee_id, problem_id, date, status) VALUES (?,?,?,'working')");
    $sql->bind_param("sss",$user_id,$problem_id,$date);
    $sql->execute(); 

}

function updateToNotWorking($problem_id){

	$user_id = getID()[0]["id"];
    $date = date("d/m/Y");
    $sql = $GLOBALS['connection']->prepare("INSERT INTO Records(employee_id, problem_id, date, status) VALUES (?,?,?,'not working')");
    $sql->bind_param("sss",$user_id,$problem_id,$date);
    $sql->execute();  
 	$sql2 = $GLOBALS['connection']->prepare("UPDATE Problems SET status = 'unsolved' WHERE problem_id =? ");
    $sql2->bind_param("s",$problem_id);
    $sql2->execute();
	
}

function getTypes(){
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT * FROM Speciality;");
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function testSearch($searchTerm){
    $tmp = str_replace(" ", "+", $searchTerm);
    $response = file_get_contents("https://api.datamuse.com/words?ml=".$tmp."&max=4");
    $json_data = json_decode($response);
    $search_terms = [];
    array_push($search_terms,$searchTerm);
    foreach ($json_data as $key => $value) {
        if($value->score > 6000){
            array_push($search_terms,$value->word);
        }
    }
    $final_output = [];
    foreach ($search_terms as $key => $value) {
        $tmp = json_decode(return_search($value));
        foreach ($tmp as $key => $v2) {
            array_push($final_output,$v2);
        }
    }
    print_r(json_encode($final_output));
}

function analytics1(){
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT problem_type, COUNT(problem_type) AS count FROM `Problems` GROUP BY problem_type;");
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function analytics2(){
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT status, COUNT(problem_type) AS `count` FROM `Problems` GROUP BY status;");
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function analytics3(){
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT * FROM Problems");
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function analytics4(){
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT problem_id, call_date, solution_date FROM Problems");
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function analytics6(){
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT problem_id, COUNT(status),status FROM `Records` GROUP BY problem_id,status");
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function getAllUsers(){
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT * FROM Employee");
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function addSolution(){
	 $sql = $GLOBALS['connection']->prepare("INSERT INTO Solution(solution_id, solution) VALUES (?,?) ");
     $sql->bind_param("ss",$problem_id,$_POST['problem_solution']);
     $sql->execute(); 
	 $sql_2 = $GLOBALS['connection']->prepare("UPDATE Problems SET status = 'solved', history =? WHERE problem_id =? ");
     $sql2->bind_param("ss",$_POST['history'],$problem_id);
     $sql2->execute(); 

}

function updateCalendar(){
    $username = getID()[0]["id"];
    $sql = "UPDATE Specialist SET bookings ='".$_POST['bookings']."' WHERE id = '".$username."'";  
    if ($GLOBALS['connection']->query($sql) !== true)
        {
            echo "Insert failed";
            exit();
        };
        echo "Insert successful";

}

function getCalendar(){
    $username = getID()[0]["id"];
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT bookings FROM Specialist WHERE id =? ");
    $sql->bind_param("s",$username);
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function isSpecialist(){
    $id = getID()[0]["id"];
    $result_array = array();
    $sql = $GLOBALS['connection']->prepare("SELECT job_title FROM Employee WHERE id =? ");
    $sql->bind_param("s",$id);
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $result_array[] = $row;
        };
    }
    return json_encode($result_array);
}

function deleteUser($id){
    $sql = $GLOBALS['connection']->prepare("DELETE FROM `Employee` WHERE `Employee`.`id` = ?");
    $sql->bind_param("s",$id);
    $sql->execute();
}


if (function_exists($_POST['function'])){
    if ($_POST['function'] == "new_problem") {
        new_problem();
    }elseif ($_POST['function'] == "return_all_problemID") {
        print_r(return_all_problemID($_POST['status']));
    }elseif ($_POST['function'] == "getProblem") {
        print_r(getProblem($_POST['problem_id']));
    }elseif ($_POST['function'] == "return_search") {
        print_r(return_search($_POST['search']));
    }elseif ($_POST['function'] == "update_problem") {
        update_problem($_POST['problem_id']);
    }elseif ($_POST['function'] == "return_all_problemID_username") {
        print_r(return_all_problemID_username());
    }elseif ($_POST['function'] == "getID") {
        print_r(getID()[0]["id"]);
    }elseif ($_POST['function'] == "generateID") {
        print_r(generateID());
    }elseif ($_POST['function'] == "getEmployee") {
        print_r(getEmployee($_POST['employee_id']));
    }elseif ($_POST['function'] == "getAllSpecID") {
        print_r(getAllSpecID());
    }elseif ($_POST['function'] == "getWpUsername") {
        print_r(getWpUsername());
    }elseif($_POST['function']=="add_users"){
		print_r(add_users());
	}elseif($_POST['function']=="getRecords"){
        print_r(getRecords());
    }elseif($_POST['function']=="updateToworking"){
		updateToworking($_POST['problemId']);
	}elseif($_POST['function']=="updateToNotWorking"){
		updateToNotWorking($_POST['problemId']);
	}elseif($_POST['function']=="getTypes"){
        print_r(getTypes());
    }elseif($_POST['function']=="testSearch"){
        testSearch($_POST['searchTerm']);
    }elseif($_POST['function']=="analytics1"){
        print_r(analytics1());
    }elseif($_POST['function']=="analytics2"){
        print_r(analytics2());
    }elseif($_POST['function']=="analytics3"){
        print_r(analytics3());
    }elseif($_POST['function']=="analytics4"){
        print_r(analytics4());
    }elseif($_POST['function']=="analytics6"){
        print_r(analytics6());
    }elseif($_POST['function']=="getAllUsers"){
        print_r(getAllUsers());
    }elseif($_POST['function']=="addSolution"){
        print_r(addSolution());
    }elseif($_POST['function']=="updateCalendar"){
        updateCalendar();
    }elseif($_POST['function']=="getCalendar"){
        print_r(getCalendar());
    }elseif($_POST['function']=="auto_specialist"){
        auto_specialist($_POST['type']);
    }elseif($_POST['function']=="isSpecialist"){
        print_r(isSpecialist());
    }elseif($_POST['function']=="deleteUser"){
        print_r(deleteUser($_POST['id']));
    }


}
$connection->close();
?>
