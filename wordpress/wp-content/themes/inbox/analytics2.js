google.charts.load("current", {
    packages: ["corechart"]
});
google.charts.setOnLoadCallback(drawChart1);

function drawChart1() {
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", { //Gets all our solved problems
            username: "team20",
            password: "Team20pa55word",
            function: "analytics2",
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            if (json_data.length !== 0) { //In case no solved
                var array = [
                    ['Status', 'Number']
                ];
                for (var i = 0; i < json_data.length; i++) { //Opens the solved problem for viewing in the problem_view page
                    array.push([json_data[i].status[0].toUpperCase() + json_data[i].status.slice(1), parseInt(json_data[i].count)]);
                }
            }
            var data = google.visualization.arrayToDataTable(array);

            var options = {
                title: 'Problem Status',
                is3D: true,
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
            chart.draw(data, options);


        });
}