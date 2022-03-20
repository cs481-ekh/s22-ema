$(document).ready(function () {

        // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    // #selectedProjectDashboard
    $(document).on('change', '#selectProjectDashbaordId', function () {
        let project_name = $("#selectProjectDashbaordId").val();
        // After getting the project name create a POST request
         $.ajax({
                type: "POST",
                url: '',
                data: {'selectedProject': project_name}
            });

    });


});