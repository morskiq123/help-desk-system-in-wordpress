google.charts.load('current', {
    'packages': ['bar']
});
google.charts.setOnLoadCallback(drawChart3);

function drawChart3() {
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", { //Gets all our solved problems
            username: "team20",
            password: "Team20pa55word",
            function: "analytics6",
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            if (json_data.length !== 0) { //In case no solved
                var array = [
                    ['Problem ID', 'Working solution', 'Bad solution']
                ];
                var problem_ids = []
                for (var i = 0; i < json_data.length; i++) { //Opens the solved problem for viewing in the problem_view page
                    if (!(json_data[i].problem_id in problem_ids)) {
                        problem_ids[json_data[i].problem_id] = [json_data[i].problem_id,0,0];
                    }
                }

                for (var i = 0; i < json_data.length; i++) {
                    if (json_data[i].status == "working") {
                        problem_ids[json_data[i].problem_id][1] =  problem_ids[json_data[i].problem_id][1] + 1;
                    } else {
                        problem_ids[json_data[i].problem_id][2] =  problem_ids[json_data[i].problem_id][2] + 1;
                    }

                }
                for (var key in problem_ids) {
                    array.push(problem_ids[key]);
                }
            }


            var data = google.visualization.arrayToDataTable(array);

            var options = {
                chart: {
                    title: 'Success of solutions',
                }
            };

            var chart = new google.charts.Bar(document.getElementById('columnchart_material_6'));

            chart.draw(data, google.charts.Bar.convertOptions(options));


        });
}