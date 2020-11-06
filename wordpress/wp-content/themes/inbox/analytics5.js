function load_my_problems() { //Loads my submited problems into the list
  $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
      username: "team20",
      password: "Team20pa55word",
      function: "getRecords"
    },
    function (data, status) {
      var json_data = JSON.parse(data);
      var january = 0;
      var february = 0;
      var march = 0;
      var april = 0;
      var may = 0;
      var june = 0;
      var july = 0;
      var august = 0;
      var september = 0;
      var october = 0;
      var november = 0;
      var december = 0;

      for (var i = 0; i < json_data.length; i++) {
        month = json_data[i].date.split("/")[1];
        if (month == "01") {
          january += 1;
        } else if (month == "02") {
          february += 1;
        } else if (month == "03") {
          march += 1;
        } else if (month == "04") {
          april += 1;
        } else if (month == "05") {
          may += 1;
        } else if (month == "06") {
          june += 1;
        } else if (month == "07") {
          jully += 1;
        } else if (month == "08") {
          august += 1;
        } else if (month == "09") {
          september += 1;
        } else if (month == "10") {
          october += 1;
        } else if (month == "11") {
          november += 1;
        } else if (month == "12") {
          december += 1;
        }
      }
      // Create the data table.
      var chartData = new google.visualization.DataTable();
      array_of_months = [january, february, march, april, may, june, july, august, september, october, november, december];
      chartData.addColumn('string', 'Month');
      chartData.addColumn('number', 'Problems');
      chartData.addRows([
        ['January', parseInt(array_of_months[0])],
        ['February', parseInt(array_of_months[1])],
        ['March', parseInt(array_of_months[2])],
        ['April', parseInt(array_of_months[3])],
        ['May', parseInt(array_of_months[4])],
        ['June', parseInt(array_of_months[5])],
        ['July', parseInt(array_of_months[6])],
        ['August', parseInt(array_of_months[7])],
        ['September', parseInt(array_of_months[8])],
        ['October', parseInt(array_of_months[9])],
        ['November', parseInt(array_of_months[10])],
        ['December', parseInt(array_of_months[11])]
      ]);

      // Set chart options
      var options = {
        'title': 'How many logged problems per month',
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('chart_div2'));
      chart.draw(chartData, options);
    });
}


// Load the Visualization API and the corechart package.
google.charts.load('current', {
  'packages': ['corechart']
});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(load_my_problems);