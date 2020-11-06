function open_problem_view(problem_id) { //Preparration for showing problem in view page
    $.post("https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php", {
            username: "team20",
            password: "Team20pa55word",
            function: "getProblem",
            problem_id: problem_id
        },
        function (data, status) { //Gets all details about requested problem and stores then in sessionStorage to preserve across pages
            var json_data = JSON.parse(data);
            sessionStorage.clear();
            sessionStorage.getItem('problem_id');
            sessionStorage.setItem('problem_id', json_data[0].problem_id);
            sessionStorage.getItem('employee_id');
            sessionStorage.setItem('employee_id', json_data[0].employee_id);
            sessionStorage.getItem('time');
            sessionStorage.setItem('time', json_data[0].call_time);
            sessionStorage.getItem('date');
            tmp_date = json_data[0].call_date.split("/");
            call_date = tmp_date[2] + "-" + tmp_date[1] + "-" + tmp_date[0];
            sessionStorage.setItem('date', call_date);
            sessionStorage.getItem('problem_type');
            sessionStorage.setItem('problem_type', json_data[0].problem_type);
            sessionStorage.getItem('status');
            sessionStorage.setItem('status', json_data[0].status);
            sessionStorage.getItem('priority');
            sessionStorage.setItem('priority', json_data[0].priority);
            sessionStorage.getItem('reason');
            sessionStorage.setItem('reason', json_data[0].reason);
            sessionStorage.getItem('initial_specialist');
            sessionStorage.setItem('initial_specialist', json_data[0].assigned_id + " - " + json_data[0].first_name + " " + json_data[0].last_name);
            sessionStorage.getItem('current_specialist');
            sessionStorage.setItem('current_specialist', json_data[0].current_id);
            sessionStorage.getItem('problem_solution');
            sessionStorage.setItem('problem_solution', json_data[0].solution);
            tmp_resolved_date = json_data[0].solution_date.split("/");
            resolved_date = tmp_resolved_date[2] + "-" + tmp_resolved_date[1] + "-" + tmp_resolved_date[0];
            sessionStorage.getItem('resolved_date');
            sessionStorage.setItem('resolved_date', resolved_date);
            sessionStorage.getItem('history');
            sessionStorage.setItem('history', json_data[0].history);
            sessionStorage.getItem('loaded');
            sessionStorage.setItem('loaded', "true");
            window.open("https://team20.mooo.com/wordpress/problem-view/", '_self');
        });

}