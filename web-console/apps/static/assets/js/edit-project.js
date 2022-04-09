$(document).ready(function () {

    // Targeting message that appears on submission of the form ()
    $("#close_button_success").click(function () {
        let element = document.getElementById("message_success");
        // add fade out class
        $(element).fadeOut("slow", function () {
            // remove the element
            $(this).remove();
        });
    })


    $(document).on('click', '#close_button_error', function () {
        let element = document.getElementById("message_error");
        // add fade out class
        $(element).fadeOut("slow", function () {
            // remove the element
            $(this).remove();
        });
    });

    // prevent empty form submission on refresh
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }

    let survey_link_initial;
    let description_initial;
    let participants_initial_list;
    let survey_link_post;
    let description_post;
    let removed_participants_list = [];
    let add_new_participant_list = []; // List that will contain all the emails of participants to be added to the project.
    let participantCardTracker = []; // This will keep track of the participant cards displayed on the front end for the admin user

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
        // Clear the error messages
        clearErrorMessages();
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
            // Getting a copy of the cards (participants) that are displayed on the front end (member of the project).
            participantCardTracker = participants_initial_list.match(/(?<=')[^' \054]+(?=')/g);
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

        // Update card tracker of the card removed (participant removed)
        removeElementFromArr(participantCardTracker, participant_removed_email);
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

        // Clear the error messages
        clearErrorMessages();
    });

    // Check if non_participant cookie is set every few seconds. User will be notified with an error that
    // the user does not exist
    setInterval(function () {
        let non_participant = Cookies.get("user_does_not_exist");
        if (typeof non_participant !== "undefined") {
            $('#addParticipantInput-editProject').addClass('error_class_input');
            $('#addParticipantLabelId-editProject').addClass('error_class_label');

            // <---------------- participant does not exist error message START --------------->
            // Get the parent element
            let parent = document.getElementById("div");

            // The error message will be added after blankSpace (<br> tag)
            let blankSpace = document.getElementById("space-after-add-participant-input");

            // Create the new element to be added
            const div = document.createElement("div")

            // The following html will be inserted in the div (friend error message)
            div.innerHTML = "<div class=\"alert alert-danger animate_fade_in\" role=\"alert\" id=\"message_error\">\n" +
                "                                            Participant does not exist!\n" +
                "                                            <button type=\"button\" class=\"close close_button\" aria-label=\"Close\">\n" +
                "                                                <span aria-hidden=\"true\">&times;</span>\n" +
                "                                            </button>\n" +
                "                                        </div>"

            // Insert the created element
            blankSpace.after(div)
            // <---------------- participant does not exist error message END --------------->


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
            // A new participant card has been added, therefore we need to add it to our card tracker
            participantCardTracker.push(newParticipant);
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
                "                                                                <h6 class=\"mb-1\" >" + newParticipant + "</h6>\n" +
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

            // The error message will be added after blankSpace (<br> tag)
            let blankSpace = document.getElementById("space-after-add-participant-input");

            // Create the new element to be added
            const div = document.createElement("div");

            // the participant card is not displayed but the participant is already a member of a project, add the card
            // back since the admin user previously removed it
            const result = participantCardTracker.includes(participant_is_member);
            if (result == false) {
                // Update our card tracker
                participantCardTracker.push(participant_is_member);

                // Remove participant from the array of participants that will be removed from the selected project
                // when the "Update Project" is clicked
                removeElementFromArr(removed_participants_list, participant_is_member);

                // the username and email domain are split and are separately stored in its own location in the array
                let new_split_array = participant_is_member.split("@");

                // location 0 returns the username
                let participant_is_member_Username = new_split_array[0];

                // Adding a participant card to the right
                $("tbody").append(" <tr class=\"unread animate_fade_in\" id=" + participant_is_member + ">\n" +
                    "                                                            <td><img class=\"rounded-circle\" style=\"width:40px;\"\n" +
                    "                                                                     src=\"/static/assets/images/user/user-3.png\"\n" +
                    "                                                                     alt=\"activity-user\">\n" +
                    "                                                            <td>\n" +
                    "                                                                <h6 class=\"mb-1\" >" + participant_is_member + "</h6>\n" +
                    "                                                                <p class=\"m-0\">" + participant_is_member_Username + "</p>\n" +
                    "                                                            </td>\n" +
                    "                                                            <td><button type=\"button\" class=\"label theme-bg2 text-white f-12 remove_card_edit_project removeButton\" name=\"editProjectBtn\" id=\"editProjectBtnId\">Remove</button>\n" +
                    "                                                            </td>\n" +
                    "                                                        </tr>");
            } else // the card is already in the participant list on the front end.
            {
                $('#addParticipantInput-editProject').addClass('error_class_input');
                $('#addParticipantLabelId-editProject').addClass('error_class_label');

                div.innerHTML = "<div class=\"alert alert-danger animate_fade_in\" role=\"alert\" id=\"message_error\">\n" +
                    "                                            Participant is already in the list!\n" +
                    "                                            <button type=\"button\" class=\"close close_button\" id=\"close_button_error\" aria-label=\"Close\">\n" +
                    "                                                <span aria-hidden=\"true\">&times;</span>\n" +
                    "                                            </button>\n" +
                    "                                        </div>"

                // Insert the created element
                blankSpace.after(div);
            }
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

    // Clear all error message that are displayed to the admin user
    function clearErrorMessages() {
        // clear red text and border
        $('#addParticipantInput-editProject').removeClass('error_class_input')
        $('#addParticipantLabelId-editProject').removeClass('error_class_label');

        // Clear the add participant error message. When the error is not occurring, the value of
        // addParticipantErrorMessage is null which will throw an error in the browser console. Therefore, the
        // check for the null value is necessary below.
        let addParticipantErrorMessage = document.querySelector('#message_error');
        let successMessage = document.getElementById('message_success');

        // When the user triggers the error, the message will be displayed on the front end. Therefore, the message will
        // be removed only when the element (error) exists.
        if (addParticipantErrorMessage != null) {
            addParticipantErrorMessage.parentNode.removeChild(addParticipantErrorMessage);
        }

        // Remove success message
        $(successMessage).fadeOut("fast", function () {
            // remove the element
            $(this).remove();
        });
    }

    // This function will take an array and a value. It will delete the value from the array.
    // If the element does not exist in the array, it will just return the original array
    function removeElementFromArr(arr, valueToBeRemoved) {
        for (var i = 0; i < arr.length; i++) {

            if (arr[i] === valueToBeRemoved) {
                arr.splice(i, 1);
                i--;
            }
        }
    }
});