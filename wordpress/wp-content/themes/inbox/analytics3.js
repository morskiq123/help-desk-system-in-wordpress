google.charts.load('current', {
    'packages': ['bar']
});
google.charts.setOnLoadCallback(drawChart3);

function drawChart3() {
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", { //Gets all our solved problems
            username: "team20",
            password: "Team20pa55word",
            function: "analytics3",
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            if (json_data.length !== 0) { //In case no solved
                var array = [
                    ['Problem Type', 'Total Number', 'Number Solved', 'Number Unsolved']
                ];
                var problem_types = []
                for (var i = 0; i < json_data.length; i++) { //Opens the solved problem for viewing in the problem_view page
                    if (!(json_data[i].problem_type in problem_types)) {
                        problem_types[json_data[i].problem_type] = 1;
                    } else {
                        problem_types[json_data[i].problem_type] = problem_types[json_data[i].problem_type] + 1;
                    }
                }
                for (var key in problem_types) {
                    problem_types[key] = [key, problem_types[key], 0, 0]
                }

                for (var i = 0; i < json_data.length; i++) {
                    if (json_data[i].status == "solved") {
                        problem_types[json_data[i].problem_type][2] = problem_types[json_data[i].problem_type, json_data[i].problem_type][2] + 1;
                    } else {
                        problem_types[json_data[i].problem_type][3] = problem_types[json_data[i].problem_type][3] + 1;
                    }

                }
                for (var key in problem_types) {
                    array.push(problem_types[key]);
                }
            }


            var data = google.visualization.arrayToDataTable(array);

            var options = {
                chart: {
                    title: 'Types of Problems',
                    subtitle: 'Network, Hardware, Software',
                }
            };

            var chart = new google.charts.Bar(document.getElementById('columnchart_material_3'));

            chart.draw(data, google.charts.Bar.convertOptions(options));


        });
}