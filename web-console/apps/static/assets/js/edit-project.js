$(document).ready(function () {

    let survey_link_initial;
    let description_initial;
    let participants_initial_list;
    let survey_link_post;
    let description_post;
    let removed_participants_list = [];

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

        // Change participant list when a new project is selected
        $("#participantsTableId > tbody").html("");

        // A project is selected, enable text fields
        document.getElementById("surveyLinkInput").disabled = false;
        document.getElementById("notesInput").disabled = false;

        let selectVal = $(this).val()

        // if value of dropdown is "Select" don't POST
        if (selectVal != "Select") {
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
        let participants = Cookies.get("participants"); // * Note -> the type of this variable is a string
        if (typeof survey_link !== "undefined" && typeof description !== "undefined" && typeof participants !== "undefined") {
            // setting the input field for the survey link and description
            survey_link_initial = document.getElementById("surveyLinkInput").value = survey_link;
            description_initial = document.getElementById("notesInput").value = description;
            // Setting the participants cookie variable as a global variable
            participants_initial_list = participants;
            // A regular expression scans the 'participants_initial_list' to extract emails only and add them in an array
            participants_initial_list = participants_initial_list.match(/(?<=')[^' \054]+(?=')/g); // Note -> this will be null if there are no participants in selected project

            // The selected project contains participants
            if (participants_initial_list != null) {
                for (let i = 0; i < participants_initial_list.length; i++) {

                    // the username and email domain are split and are separately stored in its own location in the array
                    let split_array = participants_initial_list[i].split("@");

                    // location 0 returns the username
                    let userName = split_array[0];

                    // Adding a participant card to the right
                    $("tbody").append(" <tr class=\"unread animate_fade_in\" id=" + participants_initial_list[i] + ">\n" +
                        "                                                            <td><img class=\"rounded-circle\" style=\"width:40px;\"\n" +
                        "                                                                     src=\"/static/assets/images/user/user-3.png\"\n" +
                        "                                                                     alt=\"activity-user\">\n" +
                        "                                                            <td>\n" +
                        "                                                                <h6 class=\"mb-1\">" + participants_initial_list[i] + "</h6>\n" +
                        "                                                                <p class=\"m-0\">" + userName + "</p>\n" +
                        "                                                            </td>\n" +
                        "                                                            <td><button type=\"button\" class=\"label theme-bg2 text-white f-12 remove_card_edit_project removeButton\" name=\"editProjectBtn\" id=\"editProjectBtnId\">Remove</button>\n" +
                        "                                                            </td>\n" +
                        "                                                        </tr>");
                }
            }

            // Delete the cookie after usage.
            Cookies.remove("surveyLink");
            Cookies.remove("description");
            Cookies.remove("participants");
        }
    }, 10);


    // If the surveylink field has been modified
    $("#surveyLinkInput").on("change keyup paste click", function () {
        // Values before user modification
        survey_link_post = document.getElementById("surveyLinkInput").value


        // checking if survey link was modified
        if (survey_link_initial != survey_link_post) {
            // change detected, enable button
            document.getElementById("editProjectBtnId").disabled = false;

        }
    });

    // If the description field has been modified
    $("#notesInput").on("change keyup paste click", function () {
        // Values before user modification
        description_post = document.getElementById("notesInput").value

        // checking if description was modified
        if (description_initial != description_post) {
            // change detected, enable button
            document.getElementById("editProjectBtnId").disabled = false;
        }
    });

    //When the "remove" button is clicked, remove the participant card
    $(document).on('click', '.remove_card_edit_project', function () {
        let participant_removed_email = $(this).closest('tr').attr('id');

        // Before removing the div remove the animate class from the div
        document.getElementById(participant_removed_email).classList.remove("animate_fade_in")
        // fadeout the element first
        document.getElementById(participant_removed_email).classList.add("animate_fade_out");
        // //remove the parent element
        setTimeout(function () {
            // Wait for the element to exist
            if ($(document.getElementById(participant_removed_email)).length > 0) {
                $(document.getElementById(participant_removed_email)).remove();
            }
        }, 1000)
        // Store the participant to be removed in a separate list
        removed_participants_list.push(participant_removed_email);

    });

    // When the "Update Project" button is clicked
    $(document).on('click', '#editProjectBtnId', function (){
        $("#editProjectBtnId").attr("name", "remove_participants");
        $("#editProjectBtnId").attr("value", removed_participants_list);

    });
});