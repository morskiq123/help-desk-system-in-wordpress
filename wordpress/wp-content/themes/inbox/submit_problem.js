function preparations() { //Some modification to the theme to match desired layout
    var element = document.getElementById("custom_html-5");
    element.parentNode.removeChild(element); //Removes second not used list
    sessionStorage.clear(); //To prevent remains from problem_view 
    $("#custom_html-7 > h2").html("My submited problems"); //Change title of our list
    $(".search-form").remove();
    $(".search-bar").append('<div id="autocomplete" class="autocomplete"><input class="autocomplete-input" /><ul class="autocomplete-result-list"></ul></div>');
    document.getElementById("autocomplete").style.marginBottom = "5px"; //Replace stock search bar with our own
}

function load_my_problems() { //Adds to the sidelist all problems ever submited by the logged in user
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
            username: "team20",
            password: "Team20pa55word",
            function: "return_all_problemID_username"
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            if (json_data.length !== 0) { //Checks if they not empty, else returns "None"
                for (var i = 0; i < json_data.length; i++) {
                    $("#sidelist_2").each(function () {
                        if (!$(this).html().includes(json_data[i].problem_id)) { //Prevent duplicate entries
                            $('#sidelist_2').append('<li onclick="open_problem_view(' + json_data[i].problem_id + ')">Problem ' + json_data[i].problem_id + " - " + json_data[i].status + '</li>');
                        }
                    });
                }
            } else {
                $('#sidelist_2').empty();
                $('#sidelist_2').append('<li>None</li>');
            }
        });
}

function generateID() { //Gets server side generated problemID
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
            username: "team20",
            password: "Team20pa55word",
            function: "generateID"
        },
        function (data, status) {
            document.getElementById("problem_id").value = data;
        });
}

function getID() { //Gets the employee id of the current user based on wp login
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
            username: "team20",
            password: "Team20pa55word",
            function: "getID"
        },
        function (data, status) {
            document.getElementById("employee_id").value = data;
        });
}

function setDate() { //Automatically enters the current date ("YYYY-MM-DD") and time ("23:00") based on the specific format required 
    var now = new Date();
    document.getElementById("time").value = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2);
    document.getElementById("date").value = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
}

function getTypes(){
        $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
            username: "team20",
            password: "Team20pa55word",
            function: "getTypes"
        },
        function (data, status) {problem_type
            var json_data = JSON.parse(data);
            $('#problem_type').children().remove(); 
            for (var i = 0; i < json_data.length; i++) {
                $('#problem_type').append('<option value="' + json_data[i].speciality + '">' + json_data[i].speciality + '</option>');
            }
        });
}

function setPriority() { //Add verbal clarity to out priority numeric scale
    array_scale = ["Extreme", "High", "Considerable", "Moderate", "Low"]
    for (var i = 0; i < 5; i++) {
        document.getElementById("priority").options[i].innerHTML = document.getElementById("priority").options[i].value + " - " + array_scale[i];
    }
}

function getAllSpecID() { //Adds all specilists in from database to select
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
            username: "team20",
            password: "Team20pa55word",
            function: "getAllSpecID",
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            $('#initial_specialist').children().remove(); //Removes all options so we only add the ones we want
            $('#initial_specialist').append('<option value="Auto">Auto select specialist</option>');
            for (var i = 0; i < json_data.length; i++) {
                var initial_specialist_text = json_data[i].first_name + " " + json_data[i].last_name + " " + json_data[i].id;
                $('#initial_specialist').append('<option value="' + initial_specialist_text + '">' + initial_specialist_text + '</option>');
            }
            
        });
}

function blinkSearch(){
    $(".autocomplete-input").css("background-color", "orange");
    setTimeout(() => {  $(".autocomplete-input").css("background-color", "white"); }, 500);
    setTimeout(() => {  $(".autocomplete-input").css("background-color", "orange"); }, 1000);
    setTimeout(() => {  $(".autocomplete-input").css("background-color", "white"); }, 1500);
    setTimeout(() => {  $(".autocomplete-input").css("background-color", "orange"); }, 2000);
    setTimeout(() => {  $(".autocomplete-input").css("background-color", "white"); }, 2500);
}


//Starts here
$('.wpcf7-response-output').bind('DOMNodeInserted DOMNodeRemoved', function () { //Refresh problem list AFTER submit
    load_my_problems();
    generateID();
    getID();
    setDate();
    getTypes();
    setPriority();
    getAllSpecID();
});

preparations();
load_my_problems();
generateID();
getID();
setDate();
getTypes();
setPriority();
getAllSpecID();
