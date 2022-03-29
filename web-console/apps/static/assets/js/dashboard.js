$(document).ready(function () {

    // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    // #selectedProjectDashboard
    $(document).on('change', '#selectProjectDashbaordId', function () {
        let project_name = $("#selectProjectDashbaordId").val();
        // After getting the project name create a POST request
        if (project_name !== 'Select') {
            $.ajax({
                type: "POST",
                url: '',
                data: {'selectedProject': project_name}
            });

            // Setting Project Count value
            setInterval(function () {
                let part_count = Cookies.get("part_list_count");
                let part_percent = Cookies.get("participant_percentage")
                if (typeof part_count !== "undefined" && part_percent != "undefined") {
                    document.getElementById("projectCountDataId").innerText = part_count;
                    document.getElementById("projectCountPercentageId").innerText = part_percent + '%';
                    // removing cookies
                    Cookies.remove("part_list_count");
                    Cookies.remove("participant_percentage");
                    // unhiding sublabel

                }
            }, 10);
        } else {
            // if project selected == "Select" than
            document.getElementById("projectCountDataId").innerText = "--";
            document.getElementById("projectCountPercentageId").innerText = "--";

        }
    });


});