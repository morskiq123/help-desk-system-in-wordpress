$("#custom_html-7 > h2").remove();
$("#custom_html-5 > h2").remove();
$( "form[role='search']" ).remove();
google.charts.load("current", {
    packages: ["corechart"]
});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", { //Gets all our solved problems
            username: "team20",
            password: "Team20pa55word",
            function: "analytics4",
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            if (json_data.length !== 0) { //In case no solved
                var array = [
                    ['Problem', 'Time taken']
                ];
                for (var i = 0; i < json_data.length; i++) { //Opens the solved problem for viewing in the problem_view page
                    var tmp_date1 = json_data[i].call_date.split("/");
                    var date1 = moment([tmp_date1[2], ("0" + (tmp_date1[1] - 1)).slice(-2), tmp_date1[0]]);
                    if (json_data[i].solution_date == "") {
                        var date2 = moment();
                    } else {
                        var tmp_date2 = json_data[i].solution_date.split("/");
                        var date2 = moment([tmp_date2[2], ("0" + (tmp_date2[1] - 1)).slice(-2), tmp_date2[0]]);
                    }
                    array.push(["Problem " + json_data[i].problem_id, date2.diff(date1, "days")]);
                }
            }
            var data = google.visualization.arrayToDataTable(array);
            var options = {
                title: 'Time spent on problems',
                legend: {
                    position: 'none'
                },
                width: 800
            };

            var chart = new google.visualization.Histogram(document.getElementById('chart_div'));
            chart.draw(data, options);
        });
    document.getElementById("chart_div").style.marginLeft = "-130px";

}