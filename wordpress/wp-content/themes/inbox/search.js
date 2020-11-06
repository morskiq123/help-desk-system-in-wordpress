function return_search_results(result) { //Autocomplete suggest to display with fixes for db escaping

    out = "ID: " + result.problem_id + "<br>Reason: "
    if (result.reason.includes("\\")) {
        out = out + result.reason.replace("\\", "") + "<br>Solution: ";
    } else {
        out = out + result.reason + "<br>Solution: ";
    }
    if (result.solution.includes("\\")) {
        out = out + result.solution.replace("\\", "");
    } else {
        out = out + result.solution;
    }
    return out
}

//Starts here
new Autocomplete('#autocomplete', { //create search bar, specific to autocomplete js, only for solved problems

    search: input => { //What to do with the input
        let formData = new FormData();
        formData.append('searchTerm', input);
        formData.append('function', "testSearch");
        formData.append('username', "team20");
        formData.append('password', "Team20pa55word");
        return new Promise(resolve => {
            if (input.length < 3) { //Under 3 characters nothing
                return resolve([])
            }
            fetch('https://team20.mooo.com/wordpress/wp-content/themes/inbox/database.php', { //Else search in in db for search term
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                        resolve(data);
                })
        })
    },

    getResultValue: result => return_search_results(result), //Fixes db escaping 

    onSubmit: result => { //Saves the different info into sessionStorage
        $("#autocomplete input").val("")
        sessionStorage.clear()
        sessionStorage.getItem('problem_id')
        sessionStorage.setItem('problem_id', result.problem_id)
        sessionStorage.getItem('employee_id')
        sessionStorage.setItem('employee_id', result.employee_id)
        sessionStorage.getItem('time')
        sessionStorage.setItem('time', result.call_time)
        sessionStorage.getItem('date')
        tmp_date = result.call_date.split("/")
        call_date = tmp_date[2] + "-" + tmp_date[1] + "-" + tmp_date[0]
        sessionStorage.setItem('date', call_date)
        sessionStorage.getItem('problem_type')
        sessionStorage.setItem('problem_type', result.problem_type)
        sessionStorage.getItem('priority')
        sessionStorage.setItem('priority', result.priority)
        sessionStorage.getItem('reason')
        sessionStorage.setItem('reason', result.reason)
        sessionStorage.getItem('initial_specialist')
        sessionStorage.setItem('initial_specialist', result.assigned_id + " - " + result.first_name + " " + result.last_name)
        sessionStorage.getItem('current_specialist')
        sessionStorage.setItem('current_specialist', result.current_id)
        sessionStorage.getItem('status');
        sessionStorage.setItem('status', result.status)
        sessionStorage.getItem('problem_solution')
        sessionStorage.setItem('problem_solution', result.solution)
        tmp_resolved_date = result.solution_date.split("/")
        resolved_date = tmp_resolved_date[2] + "-" + tmp_resolved_date[1] + "-" + tmp_resolved_date[0]
        sessionStorage.getItem('resolved_date')
        sessionStorage.setItem('resolved_date', resolved_date)
        sessionStorage.getItem('history')
        sessionStorage.setItem('history', result.history)
        sessionStorage.getItem('loaded')
        sessionStorage.setItem('loaded', "true")
        window.open("https://team20.mooo.com/wordpress/problem-view/", '_self') //Opens the problem_view page with these details
    },

})