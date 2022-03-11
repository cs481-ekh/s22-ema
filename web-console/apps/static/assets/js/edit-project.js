$(document).ready(function () {

    let survey_link_initial;
    let description_initial;
    let survey_link_post;
    let description_post;

    // "Update Project" button disabled at the beginning
    document.getElementById("editProjectBtnId").disabled = true;

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


    //
    // if(document.getElementById("surveyLinkInput").value != "" && document.getElementById("surveyLinkInput").value != survey_link_initial)
    // {
    //     alert("in if statement")
    // }

    $('#surveyLinkInput').change(function ()
    {

        // Values before user modification
        survey_link_post = document.getElementById("surveyLinkInput").value
        description_post = document.getElementById("notesInput").value

        // checking if survey link or description was modified
        if(survey_link_initial != survey_link_post || description_initial != description_post)
        {
            // change detected, enable button
            document.getElementById("editProjectBtnId").disabled = false;
            alert(survey_link_post);
            alert(description_post);
        }
    });

});