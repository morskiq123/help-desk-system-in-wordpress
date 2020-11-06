function book(array) {
	new_date = "";
	if (array[4] == "togreen") {
		var tmp = array[3] + "/" + array[2] + "/" + array[1];
		console.log(array[0].indexOf(tmp));
		array[0].splice(array[0].indexOf(tmp), 1);
	}

	var test = array;
	for (var i = 0; i < test[0].length; i++) {
		new_date = new_date + test[0][i] + ","
	}
	if (array[4] == "tored") {
		new_date = new_date + array[3] + "/" + array[2] + "/" + array[1];
	}


	$.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
			username: "team20",
			password: "Team20pa55word",
			function: "updateCalendar",
			bookings: new_date
		},
		function (data, status) {
			location.reload();
		});
}

function getBookings() {
	$.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
			username: "team20",
			password: "Team20pa55word",
			function: "getCalendar"
		},
		function (data, status) {
			var bookings = []
			var json_data = JSON.parse(data);
			for (var i = 0; i < json_data.length; i++) {
				tmp = json_data[i].bookings.replace("\\", "").split(",")

				for (var j = 0; j < tmp.length; j++) {
					bookings.push(tmp[j]);
				}
			}

			for (var i = 0; i < bookings.length; i++) {
				tmp_date = bookings[i].split("/");
				$("div[data-year='" + tmp_date[2] + "'][data-month='" + parseInt(parseInt(tmp_date[1], 10)) + "'][data-day='" + parseInt(tmp_date[0], 10) + "']").children("div[data-type='single']").attr("class", "wpsbc-legend-item-icon wpsbc-legend-item-icon-2");
			}
			$(".wpsbc-legend-item-icon-1").each(function (index) {
				if ($(this).parent().attr("class") == "wpsbc-date wpsbc-legend-item-1 ") {
					$(this).parent().click(function () {
						book([bookings, $(this).attr("data-year"), $(this).attr("data-month"), $(this).attr("data-day"), "tored"]);
					});
				}
			});
			$(".wpsbc-legend-item-icon-2").each(function (index) {
				if ($(this).parent().attr("class") == "wpsbc-date wpsbc-legend-item-1 ") {
					$(this).parent().click(function () {
						book([bookings, $(this).attr("data-year"), $(this).attr("data-month"), $(this).attr("data-day"), "togreen"]);
					});
				}

			});

		});
}
$("#custom_html-7 > h2").remove();
$("#custom_html-5 > h2").remove();
$( "form[role='search']" ).remove();
getBookings();