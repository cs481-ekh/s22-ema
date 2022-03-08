$(document).ready(function () {

    let participant_list = []; // List that will contain all the emails of participants to be added to the project.
    let participant_email;
    let project_name;
    let surveyLink;

    // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    // Check if non_participant_email cookie is set every few seconds.
    setInterval(function () {
        //this code runs every few seconds
        let non_part = Cookies.get("non_participant_email")
        if (typeof non_part !== "undefined") {
            // setting the color of input field and label to red.
            $("#email_label").addClass("error_class_label")
            $("#participantEmailInput").addClass("error_class_input");

            //clear data from participant list.
            participant_list = participant_list.filter(item => item !== non_part)
            // Delete the cookie after usage.
            Cookies.remove("non_participant_email")
        }
    }, 10);

    // Check if participant_email cookie is set every few seconds.
    setInterval(function () {
        //this code runs every few seconds
        let non_part = Cookies.get("participant_email")
        if (typeof non_part !== "undefined") {
            // Adding a participant card to the right
            $("tbody").append(" <tr class=\"unread\">\n" +
                "                                                            <td><img class=\"rounded-circle\" style=\"width:40px;\"\n" +
                "                                                                     src=\"/static/assets/images/user/user-3.png\"\n" +
                "                                                                     alt=\"activity-user\"></td>\n" +
                "                                                            <td>\n" +
                "                                                                <h6 class=\"mb-1\">User3</h6>\n" +
                "                                                                <p class=\"m-0\">User3 email</p>\n" +
                "                                                            </td>\n" +
                "                                                            <td>\n" +
                "                                                                <h6 class=\"text-muted\"><i\n" +
                "                                                                        class=\"fas fa-circle text-c-green f-10 m-r-15\"></i>user3\n" +
                "                                                                    info</h6>\n" +
                "                                                            </td>\n" +
                "                                                            <td><a href=\"#!\" class=\"label theme-bg2 text-white f-12\">Remove</a>\n" +
                "                                                            </td>\n" +
                "                                                        </tr>");
            // Delete the cookie after usage.
            Cookies.remove("participant_email")
        }
    }, 10);

    function check_if_value_exist_in_participant_list(part_email) {
        let exist = false;
        for (let i = 0; i < participant_list.length; i++) {
            if (participant_list[i] == part_email) {
                exist = true;
                return exist;
            }
        }
    }


    // Targeting message that appears on submission of the form ()
    $("#close_button").click(function () {
        $('#message').fadeOut("slow");
    });

    // Targeting Add Participant button
    $("#submitParticipant").click(function (message) {

        participant_email = $("#participantEmailInput").val();
        project_name = $("#projectNameInput").val();
        surveyLink = $("#surveyLinkInput").val();

        if (participant_email != "" && project_name != "" && surveyLink != "") {
            //check if the email already exist in the list, if it does than inform the user else add it to the list.
            if (!check_if_value_exist_in_participant_list(participant_email)) {
                // push the email to the list.
                participant_list.push(participant_email);
                // Post the email to get it checked if it exits in the project
                $.ajax({
                    url: '',
                    method: 'POST', // This is the default though, you don't actually need to always mention it
                    data: {'participantEmail': participant_email, 'project_Id': project_name},
                });

            }

        } else {

            // Set input field, label to red color depending on which one is empty
            if (project_name == "" && surveyLink != "") {
                $('#projectLabel').addClass('error_class_label')
                $('#projectNameInput').addClass('error_class_input');
            } else if (project_name != "" && surveyLink == "") {
                $('#surveyLinkLabel').addClass('error_class_label')
                $('#surveyLinkInput').addClass('error_class_input');
            } else if (project_name == "" && surveyLink == "") {
                $('#projectNameInput').addClass('error_class_input');
                $('#surveyLinkInput').addClass('error_class_input');
                $('#projectLabel').addClass('error_class_label')
                $('#surveyLinkLabel').addClass('error_class_label')

            }


        }
        // Once participant list has been built it needs to be tied into the Create New Project as this data will be getting posted to the same page.
        // Only button of submit type 'value' can be edited which is to be posted.
        $("#createProject").attr("value", participant_list);
    });

    // On focus remove the error class from the input field and label.
    $("#projectNameInput").on('focus', function (message) {
        $('#projectNameInput').removeClass('error_class_input');
        $('#projectLabel').removeClass('error_class_label')
    });

    $("#surveyLinkInput").on('focus', function (message) {
        $('#surveyLinkInput').removeClass('error_class_input');
        $('#surveyLinkLabel').removeClass('error_class_label')
    });

    $("#participantEmailInput").on('focus', function (message) {
        $("#participantEmailInput").removeClass("error_class_input");
        $('#email_label').removeClass('error_class_label')
    });


});