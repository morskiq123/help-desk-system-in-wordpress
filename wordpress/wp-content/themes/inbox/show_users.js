function generateID() { //Gets server side generated problemID
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
            username: "team20",
            password: "Team20pa55word",
            function: "getAllUsers"
        },
        function (data, status) {
            var json_data = JSON.parse(data);
            $("#deleteUser").empty();
            $("#user_list").empty();
            for (var i = 0; i < json_data.length; i++) {
            	$("#user_list").append('<li>'+json_data[i].id+ " "+json_data[i].first_name+" "+json_data[i].last_name+'</li>');json_data[i]
                $("#deleteUser").append("<option value='"+json_data[i].id+"'>"+json_data[i].id+ " "+json_data[i].first_name+" "+json_data[i].last_name+"</option>");
            }
        });
}

function deleteUser(user_id) { //Gets server side generated problemID
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
            username: "team20",
            password: "Team20pa55word",
            function: "deleteUser",
            id: user_id
        },
        function (data, status) {
            generateID();
        });
}

$("#custom_html-7 > h2").remove();
$("#custom_html-5 > h2").remove();
$( "form[role='search']" ).remove();
generateID();
