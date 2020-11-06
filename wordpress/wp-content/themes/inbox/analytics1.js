google.charts.load('current', {
    'packages': ['bar']
});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", { //Gets all our solved problems
            username: "team20",
            password: "Team20pa55word",
            function: "analytics1",
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            if (json_data.length !== 0) { //In case no solved
                var array = [
                    ['Problem Type', 'Number']
                ];
                for (var i = 0; i < json_data.length; i++) { //Opens the solved problem for viewing in the problem_view page
                    array.push([json_data[i].problem_type + " Problems", json_data[i].count]);
                }
            }
            var data = google.visualization.arrayToDataTable(array);
            var options = {
                chart: {
                    title: 'Types of Problems',
                    subtitle: 'Network, Hardware, Software',
                }
            };
            var chart = new google.charts.Bar(document.getElementById('columnchart_material'));

            chart.draw(data, google.charts.Bar.convertOptions(options));
        });


}