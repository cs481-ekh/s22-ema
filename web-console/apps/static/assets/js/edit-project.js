$(document).ready(function () {

    let survey_link_initial;
    let description_initial;
    let participants_initial_list;
    let survey_link_post;
    let description_post;
    let removed_participants_list = [];
    let add_new_participant_list = []; // List that will contain all the emails of participants to be added to the project.


    // "Update Project" button disabled at the beginning
    document.getElementById("editProjectBtnId").disabled = true;
    document.getElementById("surveyLinkInput").disabled = true;
    document.getElementById("notesInput").disabled = true;
    document.getElementById("addParticipantInput-editProject").disabled = true;
    document.getElementById("addParticipant-editProject").disabled = true;

    // "Delete Project" disabled at the begining
    document.getElementById("delete-project-id").disabled = true;

    // checks if delete cookie project cookie is set, if so than it is deleted.
    let delete_project_cookie = Cookies.get('selectedDeleteProject');
    if (delete_project_cookie !== 'undefined') {
        Cookies.remove('selectedDeleteProject');
    }

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
            document.getElementById("addParticipantInput-editProject").disabled = true;
            // Clear Text in text fields
            document.getElementById("surveyLinkInput").value = "";
            document.getElementById("notesInput").value = "";
            document.getElementById("addParticipantInput-editProject").value = "";
        }
    });


    // When a project is selected
    $('#selectProjectEditId').change(function () {

        // Change participant list when a new project is selected
        $("#participantsTableId > tbody").html("");

        // A project is selected, enable text fields
        document.getElementById("surveyLinkInput").disabled = false;
        document.getElementById("notesInput").disabled = false;
        document.getElementById("addParticipantInput-editProject").disabled = false;

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
        // Enabling the "Update Project" button
        document.getElementById("editProjectBtnId").disabled = false;
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
    $(document).on('click', '#editProjectBtnId', function () {
        $("#editProjectBtnId").attr("name", "remove_participants");
        $("#editProjectBtnId").attr("value", removed_participants_list);

    });

    // Targeting Add Participant button
    $("#addParticipant-editProject").click(function () {

        let new_participant_email = $("#addParticipantInput-editProject").val();
        let proj_name = $("#selectProjectEditId").val();

        // A participant needs to be added to a project
        if (new_participant_email != "" && proj_name != "") {
            // POST the new participant's email and project name to the server to be checked if the user exists
            $.ajax({
                url: '',
                method: 'POST', // This is the default though, you don't actually need to always mention it
                data: {'new_participant_email': new_participant_email, 'proj_name': proj_name},
            });
        }

    });

    // enable update project and add participant buttons
    $("#addParticipantInput-editProject").on("change keyup paste click", function () {
        document.getElementById("addParticipant-editProject").disabled = false;
        document.getElementById("editProjectBtnId").disabled = false;
        $('#addParticipantInput-editProject').removeClass('error_class_input')
        $('#addParticipantLabelId-editProject').removeClass('error_class_label');
    });

    // Check if non_participant cookie is set every few seconds. User will be notified with an error that
    // the user does not exist
    setInterval(function () {
        let non_participant = Cookies.get("user_does_not_exist");
        if (typeof non_participant !== "undefined") {
            $('#addParticipantInput-editProject').addClass('error_class_input');
            $('#addParticipantLabelId-editProject').addClass('error_class_label');
            Cookies.remove("user_does_not_exist");
        }
    }, 10);

    // Check if participant cookie is set every few seconds. User will see a new card confirming the participant
    // has been added
    setInterval(function () {
        // newParticipant contains the full email
        let newParticipant = Cookies.get("user_does_exist");
        if (typeof newParticipant !== "undefined") {
            // Adding our newParticipant to the new participant list
            add_new_participant_list.push(newParticipant);
            // the username and email domain are split and are separately stored in its own location in the array
            let new_split_array = newParticipant.split("@");

            // location 0 returns the username
            let newParticipantUsername = new_split_array[0];

            // Adding a participant card to the right
            $("tbody").append(" <tr class=\"unread animate_fade_in\" id=" + newParticipant + ">\n" +
                "                                                            <td><img class=\"rounded-circle\" style=\"width:40px;\"\n" +
                "                                                                     src=\"/static/assets/images/user/user-3.png\"\n" +
                "                                                                     alt=\"activity-user\">\n" +
                "                                                            <td>\n" +
                "                                                                <h6 class=\"mb-1\">" + newParticipant + "</h6>\n" +
                "                                                                <p class=\"m-0\">" + newParticipantUsername + "</p>\n" +
                "                                                            </td>\n" +
                "                                                            <td><button type=\"button\" class=\"label theme-bg2 text-white f-12 remove_card_edit_project removeButton\" name=\"editProjectBtn\" id=\"editProjectBtnId\">Remove</button>\n" +
                "                                                            </td>\n" +
                "                                                        </tr>");

            Cookies.remove("user_does_exist");
        }
    }, 10);

    // When client is adding a participant that is already a member of the project, the client will
    // get an error
    setInterval(function () {
        // the participant_is_member contains the email of a user who is a member of the project
        let participant_is_member = Cookies.get("user_is_member_of_project");
        if (typeof participant_is_member !== "undefined") {
            $('#addParticipantInput-editProject').addClass('error_class_input');
            $('#addParticipantLabelId-editProject').addClass('error_class_label');
            Cookies.remove("user_is_member_of_project");
        }
    }, 10);


    // drop down for project deletion
    $(document).on('change', '#selectProjectDeleteId', function () {
        let project_name = document.getElementById("selectProjectDeleteId").value;
        // if no project is selected
        if (project_name == "Select") {
            // disable the delete button
            document.getElementById("delete-project-id").disabled = true;
        } else {
            // enable the button
            document.getElementById("delete-project-id").disabled = false;
            // set the cookie as project name for server to know what cookie to delete.
            Cookies.set('selectedDeleteProject', project_name)
        }

    });


    // When a delete method is clicked than modal shows up
    $("#delete-project-id").click(function () {
        let super_modal = document.getElementById('super-modal');

        super_modal.innerHTML += '<div class="bg-modal animate_fade_in" id="bg-modal-id">\n' +
            '    <div class="modal-content">\n' +
            '        <img src="/static/assets/images/exclamation-mark.png"\n' +
            '             width=100px\n' +
            '             alt="exclamation-image">\n' +
            '\n' +
            '        <form action="" method="post" id="delete_project_form">\n' +
            '            <label for="fname">Are you sure you want to delete this project?</label><br>\n' +
            '            <div class = "modalButtons">' +
            '               <button type="submit" class="btn btn-danger" id="yesButton">Yes\n' +
            '               </button>\n' +
            '               <button type="button" class="btn btn-success" id="noButton">No\n' +
            '               </button>\n' +
            '            </div>' +
            '        </form>\n' +
            '    </div>\n' +
            '\n' +
            '</div>\n';

        // setting the csrf token for the form included in the above tag. So that the submission goes smoothly.
        let form = document.getElementById('delete_project_form'),
            input = document.createElement('input');

        input.name = "csrfmiddlewaretoken";
        input.type = "hidden";
        input.value = Cookies.get('csrftoken');

        form.appendChild(input);


    });

    // when No is clicked then modal is removed, when Yes is clicked then the project is deleted
    $(document).on('click', '#noButton', function () {
        document.getElementById("bg-modal-id").classList.add("animate_fade_out");
        document.getElementById("bg-modal-id").remove();
    });

});