function reset() { //Function to reset fields, so to readonly them and rename some sidelists
    var inputs = ["problem_id", "employee_id", "time", "date", "problem_type", "priority", "reason", "initial_specialist", "current_specialist", "problem_solution", "resolved_date", "history"];
    for (let i = 0; i < inputs.length; i++) {
        $("#" + inputs[i]).prop("readonly", true);
    }
    $("#current_specialist").empty(); //Clears all unwated entries from the specialists select
    $("#custom_html-5 > h2").html("My unsolved problems");
    $("#custom_html-7 > h2").html("My solved problems");
        $(".search-form").remove();
    $(".search-bar").append('<div id="autocomplete" class="autocomplete"><input class="autocomplete-input" /><ul class="autocomplete-result-list"></ul></div>');
    document.getElementById("autocomplete").style.marginBottom = "5px"; //Replace stock search bar with our own
}

function idForm() { //Add an id to the page form so that we can bind listeners to it
    $("form").each(function (index, element) {
        if ($(this).attr("class") == "wpcf7-form wpcf7-acceptance-as-validation") {
            $(this).attr('id', 'main_form');
        }
    });
}

function load_problems() { //Loads the problem ids in the corresponding sidelist
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", { //Gets all our unsolved problems
            username: "team20",
            password: "Team20pa55word",
            function: "return_all_problemID",
            status: "unsolved"
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            $('#sidelist_1').empty(); //Prevent duplicates
            if (json_data.length !== 0) { //In case no problems to be solved
                for (var i = 0; i < json_data.length; i++) { //Will load the selected problem into the form to be edited
                    $('#sidelist_1').append('<li onclick="openProblem(' + json_data[i].problem_id + ')">Problem ' + json_data[i].problem_id + '</li>');
                }
            } else {
                $('#sidelist_1').append('<li>None</li>');
            }
        });
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", { //Gets all our solved problems
            username: "team20",
            password: "Team20pa55word",
            function: "return_all_problemID",
            status: "solved"
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            $('#sidelist_2').empty();
            if (json_data.length !== 0) { //In case no solved
                for (var i = 0; i < json_data.length; i++) { //Opens the solved problem for viewing in the problem_view page
                    $('#sidelist_2').append('<li onclick="open_problem_view(' + json_data[i].problem_id + ')">Problem ' + json_data[i].problem_id + '</li>');
                }
            } else {
                $('#sidelist_2').append('<li>None</li>');
            }
        });
}

function getTypes(){
        $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
            username: "team20",
            password: "Team20pa55word",
            function: "getTypes"
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            $('#problem_type').children().remove(); 
            for (var i = 0; i < json_data.length; i++) {
                $('#problem_type').append('<option value="' + json_data[i].speciality + '">' + json_data[i].speciality + '</option>');
            }
        });
}

function getAllSpecID() { //Loads all the specilists into the correct list
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
            username: "team20",
            password: "Team20pa55word",
            function: "getAllSpecID",
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            $('#current_specialist').append('<option value="Auto">Auto select specialist</option>');
            for (var i = 0; i < json_data.length; i++) {
                var current_specialist_text = json_data[i].first_name + " " + json_data[i].last_name + " " + json_data[i].id;
                $('#current_specialist').append("<option value=\"" + current_specialist_text + "\">" + current_specialist_text + "</option>");
            }
        });
}

function openProblem(problem_id) { //Loads unsolved problems into the form to be edited
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
            username: "team20",
            password: "Team20pa55word",
            function: "getProblem",
            problem_id: problem_id
        },
        function (data, status) {
            getTypes();
            $("#current_specialist").children().remove(); //Remove any unwanted entries in the select field
            var json_data = JSON.parse(data);
            document.getElementById("problem_id").value = json_data[0].problem_id;
            document.getElementById("employee_id").value = json_data[0].employee_id;
            document.getElementById("time").value = json_data[0].call_time;
            document.getElementById("date").value = moment(json_data[0].call_date.replace("\\", ""), "DD/MM/YYYY").format('YYYY-MM-DD');
            document.getElementById("problem_type").value = json_data[0].problem_type;
            array_scale = ["Extreme", "High", "Considerable", "Moderate", "Low"]
            for (var i = 0; i < 5; i++) { //Add verbal clarity to out priority numeric scale
                document.getElementById("priority").options[i].innerHTML = document.getElementById("priority").options[i].value + " - " + array_scale[i];
            }
            document.getElementById("priority").value = json_data[0].priority;
            document.getElementById("reason").value = json_data[0].reason;
            var intitial_specialist_text = json_data[0].first_name + " " + json_data[0].last_name + " " + json_data[0].assigned_id;
            document.getElementById("initial_specialist").value = intitial_specialist_text;
            getAllSpecID(); //Loads all the specislists in the select
            if (json_data[0].assigned_id == json_data[0].current_id) { //In this case way we do not have to query the name of the current_id
                document.getElementById("current_specialist").value = intitial_specialist_text;
                sessionStorage.getItem('tmp');
                sessionStorage.setItem('tmp', false); //Used later to check if we need to query the name of the current id
            } else {
                sessionStorage.getItem('tmp');
                sessionStorage.setItem('tmp', json_data[0].current_id); //Will query the name based on the current id later
            }
            document.getElementById("problem_solution").value = json_data[0].solution;
            var inputs = ["problem_type", "priority", "current_specialist", "status", "problem_solution", "resolved_date"];
            //, "history"
            for (let i = 0; i < inputs.length; i++) {
                if (json_data[0].status !== "solved") {
                    $("#" + inputs[i]).prop("readonly", false); //Allows editing for fields in inputs array
                    $("input[value|='Send']").show(); //Should not be necessary anymore
                }
            }
            document.getElementById("status").value = json_data[0].status;
            if (json_data[0].solution_date !== "") { //Checks if date is not empty to not break the code and formats it to YYYY-MM-DD
                array_date = json_data[0].solution_date.split("/");
                document.getElementById("resolved_date").value = array_date[2] + "-" + array_date[1] + "-" + array_date[0];
            }
            var now = new Date();
            //Adds an automated entru to the history input to make it easier for specialists to fill in the required info/update
            document.getElementById("history").value = json_data[0].history + ("0" + now.getDate()).slice(-2) + "/" + ("0" + (now.getMonth() + 1)).slice(-2) + "/" + now.getFullYear() + " " + ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2);

            if (document.getElementById("reason").value.includes("\\")) { //Series of checks to remove \ due to database escaping
                document.getElementById("reason").value = document.getElementById("reason").value.replace("\\", "");
            }
            if (document.getElementById("history").value.includes("\\")) {
                document.getElementById("history").value = document.getElementById("history").value.replace("\\", "");
            }


        });
    if (sessionStorage.getItem('tmp') != "false") { //If intial_id not equal the current id, we need to query the name of the current id
        $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
                username: "team20",
                password: "Team20pa55word",
                function: "getEmployee",
                employee_id: sessionStorage.getItem('tmp')
            },
            function (data, status) {
                var json_data = JSON.parse(data);
                var current_specialist_text = json_data[0].first_name + " " + json_data[0].last_name + " " + json_data[0].id;
                document.getElementById("current_specialist").value = current_specialist_text;

            })
    }
}

function showProblem(){//loads all the information for the selected problem into the from

	var fields = ["problem_id", "employee_id", "time", "date", "problem_type", "priority", "reason", "initial_specialist", "current_specialist", "status", "history"]; //Fields to be filled
	for (var i = 0; i <= fields.length; i++) {
		$("#" + fields[i]).val(sessionStorage.getItem(fields[i]));
	}
	$("#priority").prop("readonly", false);
	$("#problem_solution").prop("readonly", false);
	
}

function saveSolution(){//saves the new solution 
	$.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
                username: "team20",
                password: "Team20pa55word",
                function: "addSolution",
                problem_solution: document.getElementById("problem_solution").value,
                history: document.getElementById("problem_solution").value + "Problem solved\n"
            })
}



//Starts here
reset();
idForm();
load_problems();
showProblem()


$("#main_form").submit(function () { //To make sure we do not solve problems without solution
    if (document.getElementById("status").value == "solved" && document.getElementById("problem_solution").value == "") {
        alert("A solution must be provided");
    }
});

$("#status").on('change', function () { //Sets the solve date automatically to make life easier and also adds history solved entry
    if (this.value == "solved") {
        var now = new Date();
        document.getElementById("resolved_date").value = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
        document.getElementById("history").value = document.getElementById("history").value + "\n" + ("0" + now.getDate()).slice(-2) + "/" + ("0" + (now.getMonth() + 1)).slice(-2) + "/" + now.getFullYear() + " " + ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + " Problem solved";
        $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
                username: "team20",
                password: "Team20pa55word",
                function: "getID",
            },
            function (data, status) {
                $("#current_specialist option").each(function()
{
    if ($(this).val().includes(data)) {
        $("#current_specialist").val($(this).val());
    }
});

            })
    }
});

$('.wpcf7-response-output').bind('DOMNodeInserted DOMNodeRemoved', function () { //Housekeeping and reloading problems AFTER finished submit
    load_problems();
    reset();
    saveSolution();
});