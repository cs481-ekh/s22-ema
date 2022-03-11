$(document).ready(function () {

    // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    // When the drop down is changed, a new project is selected
    $('#selectProjectEditId').change(function () {
        let selectVal = $(this).val()

        $.ajax({
            type: "POST",
            url: '',
            data: {'selected_project': selectVal},
        });
    })

    // Check if non_participant_email cookie is set every few seconds.
    setInterval(function () {
        //this code runs every few seconds
        let survey_link = Cookies.get("surveyLink");
        let description = Cookies.get("description");
        if (typeof survey_link !== "undefined" && typeof description !== "undefined") {
            // setting the input field for the survey link and description
            document.getElementById("surveyLinkInput").value = survey_link;
            document.getElementById("notesInput").value = description;

            // Delete the cookie after usage.
            Cookies.remove("surveyLink");
            Cookies.remove("description");
        }
    }, 10);

});