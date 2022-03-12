$(document).ready(function () {

    let survey_link_initial;
    let description_initial;
    let survey_link_post;
    let description_post;

    // "Update Project" button disabled at the beginning
    document.getElementById("editProjectBtnId").disabled = true;
    document.getElementById("surveyLinkInput").disabled = true;
    document.getElementById("notesInput").disabled = true;

    // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    // When the drop down value is "Select"
    $(document).on('change', '#selectProjectEditId', function () {
        // if no project is selected
        if (document.getElementById("selectProjectEditId").value == "Select") {
            // disable text fields
            document.getElementById("surveyLinkInput").disabled = true;
            document.getElementById("notesInput").disabled = true;
            // Clear Text in text fields
            document.getElementById("surveyLinkInput").value = "";
            document.getElementById("notesInput").value = "";
        }
    });


    // When a project is selected
    $('#selectProjectEditId').change(function () {

        // A project is selected, enable text fields
        document.getElementById("surveyLinkInput").disabled = false;
        document.getElementById("notesInput").disabled = false;

        let selectVal = $(this).val()

        // if value of dropdown is "Select" don't POST
        if(selectVal != "Select")
        {
            $.ajax({
            type: "POST",
            url: '',
            data: {'selected_project': selectVal},
        });
        }

    })

    // Check if surveylink and description cookie is set every few seconds.
    setInterval(function () {
        //this code runs every few seconds
        let survey_link = Cookies.get("surveyLink");
        let description = Cookies.get("description");
        if (typeof survey_link !== "undefined" && typeof description !== "undefined") {
            // setting the input field for the survey link and description
            survey_link_initial = document.getElementById("surveyLinkInput").value = survey_link;
            description_initial = document.getElementById("notesInput").value = description;

            // Delete the cookie after usage.
            Cookies.remove("surveyLink");
            Cookies.remove("description");
        }
    }, 10);


    // If the surveylink field has been modified
    $("#surveyLinkInput").on("change keyup paste click", function(){
        // Values before user modification
        survey_link_post = document.getElementById("surveyLinkInput").value


        // checking if survey link was modified
        if (survey_link_initial != survey_link_post)
        {
            // change detected, enable button
            document.getElementById("editProjectBtnId").disabled = false;

        }
    });

    // If the description field has been modified
    $("#notesInput").on("change keyup paste click", function(){
        // Values before user modification
        description_post = document.getElementById("notesInput").value

        // checking if description was modified
        if(description_initial != description_post)
        {
            // change detected, enable button
            document.getElementById("editProjectBtnId").disabled = false;
        }
    });
});