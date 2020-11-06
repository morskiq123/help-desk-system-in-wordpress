function preparations() { //Preparations before proceeding further
	if (sessionStorage.getItem('loaded') !== "true") { //If loadded for the first time or without a selected problem, prevents any artifacts from previous problems from showing
		sessionStorage.clear();
	}
	$(".search-form").remove(); //Removes wordpress search and replaces it with out
	$(".search-bar").append('<div id="autocomplete" class="autocomplete"><input class="autocomplete-input" /><ul class="autocomplete-result-list"></ul></div>');
	document.getElementById("autocomplete").style.marginBottom = "5px";
	$("#custom_html-7 > h2").html("My submited problems"); //Rename first list

}

function load_my_problems() { //Loads my submited problems into the list
	$("#custom_html-5 > h2").remove();
	$.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
			username: "team20",
			password: "Team20pa55word",
			function: "return_all_problemID_username"
		},
		function (data, status) {
			var json_data = JSON.parse(data);
			if (json_data.length !== 0) { //If we do not have problems
				for (var i = 0; i < json_data.length; i++) {
					$('#sidelist_2').append('<li onclick="open_problem_view(' + json_data[i].problem_id + ')">Problem ' + json_data[i].problem_id + " - " + json_data[i].status + '</li>');
				}
			} else {
				$('#sidelist_2').append('<li>None</li>');
			}
		});
}

function load_problems_specialist() { //Loads the problem ids in the corresponding sidelist
	$("#custom_html-5 > h2").html("My unsolved problems");
	$("#custom_html-7 > h2").html("My solved problems");
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

function show_problem() { //shows the desired problem
	if (sessionStorage.getItem("status") == "unsolved") { //Things to do when it is a unsolved problem
		$("form[action='/wordpress/problem-view/#wpcf7-f95-p94-o1']").html(($("form[action='/wordpress/problem-view/#wpcf7-f95-p94-o1']").html().replace("<br>\nProblem Solution<br>", "").replace("<br>\nResolved Date<br>", "")));
		$("#problem_solution").hide();
		$("#resolved_date").hide();
		var fields = ["problem_id", "employee_id", "time", "date", "problem_type", "priority", "reason", "initial_specialist", "current_specialist", "status", "history"]; //Fields to be filled

		//$("#giveSolution").remove();
		$("#solutionSuccessful").remove();
		$("#solutionUnsuccessful").remove();
	} else {
		//Fields of solved problem to be filled
		var fields = ["problem_id", "employee_id", "time", "date", "problem_type", "priority", "reason", "initial_specialist", "current_specialist", "status", "problem_solution", "resolved_date", "history"];

		$("#giveSolution").remove();
	}
	for (var i = 0; i <= fields.length; i++) { //Fill selectedd fields
		$("#" + fields[i]).val(sessionStorage.getItem(fields[i]));
	}
	$.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", { //Set specialist name
			username: "team20",
			password: "Team20pa55word",
			function: "getEmployee",
			employee_id: sessionStorage.getItem("current_specialist")
		},
		function (data, status) {
			var json_data = JSON.parse(data);
			var current_specialist_text = json_data[0].id + " - " + json_data[0].first_name + " " + json_data[0].last_name;
			document.getElementById("current_specialist").value = current_specialist_text;

		})
	if (document.getElementById("reason").value !== "") {
		if (document.getElementById("reason").value.includes("\\")) { //Checks to replace DB escaping 
			document.getElementById("reason").value = document.getElementById("reason").value.replace("\\", "");
		}
	}
	if (document.getElementById("history").value !== "") {
		if (document.getElementById("history").value.includes("\\")) {
			document.getElementById("history").value = document.getElementById("history").value.replace("\\", "");
		}
	}
	if (document.getElementById("solution") !== null) {
		if (document.getElementById("solution").value !== "") {
			if (document.getElementById("solution").value.includes("\\")) {
				document.getElementById("solution").value = document.getElementById("solution").value.replace("\\", "");
			}
		}
	}
}

function workingSolution() {


	$.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
		username: "team20",
		password: "Team20pa55word",
		function: "updateToworking",
		problemId: sessionStorage.getItem('problem_id')
	});
}

function notWorkingSolution() {

	$.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
		username: "team20",
		password: "Team20pa55word",
		function: "updateToNotWorking",
		problemId: sessionStorage.getItem('problem_id')
	});
}

function isSpecialist() {
	$.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
			username: "team20",
			password: "Team20pa55word",
			function: "isSpecialist"
		},
		function (data, status) {
			var json_data = JSON.parse(data);
			if (json_data.length !== 0) {
				for (var i = 0; i < json_data.length; i++) {
					if (json_data[i].job_title == "Specialist") {
						load_problems_specialist();
					} else {
						load_my_problems();
					}
				}
			}
		});
}

//Start here
preparations();
isSpecialist();
show_problem();


if (sessionStorage.getItem("status") == "solved") {
	document.getElementById("solutionSuccessful").onclick = function () {
		workingSolution();
	}
	document.getElementById("solutionUnsuccessful").onclick = function () {
		notWorkingSolution();
		window.open("https://team20.mooo.com/wordpress/problem-solver/", '_self');
	}
}
if (sessionStorage.getItem("status") == "unsolved") {
	document.getElementById("giveSolution").onclick = function () {
		window.open("https://team20.mooo.com/wordpress/problem-solver/", '_self');
	}
}