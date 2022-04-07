$(document).ready(function () {

        let survey_link_initial;
        let description_initial;
        let participants_initial_list;
        let survey_link_post;
        let description_post;
        let removed_participants_list = [];
        let add_new_participant_list = []; // List that will contain all the emails of participants to be added to the project.

    // When the page is rendered at the beginning, the dropdown selection for the project is
    // by default equal to Select Project. Therefore, all selection fields and button need to be
    // disabled
    // disable all selection fields
    document.getElementById("scheduleSendDateInput").disabled = true;
    document.getElementById("scheduleSendDateTimeInput").disabled = true;
    document.getElementById("whenToNotifySelectionId").disabled = true;
    document.getElementById("expirationDateInput").disabled = true;
    document.getElementById("expirationTimeInput").disabled = true;

    // disable set notification btn
    document.getElementById("setNotificationBtnId").disabled = true;

    // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    // When the drop down value is "Select Project"
    $(document).on('change', '#selectedProjectIdNotif', function () {
        // if no project is selected
        if (document.getElementById("selectedProjectIdNotif").value == "Select Project") {

            // Clear all error messages
            clearNotificationPageErrorMessages();

            // disable all selection fields
            document.getElementById("scheduleSendDateInput").disabled = true;
            document.getElementById("scheduleSendDateTimeInput").disabled = true;
            document.getElementById("whenToNotifySelectionId").disabled = true;
            document.getElementById("expirationDateInput").disabled = true;
            document.getElementById("expirationTimeInput").disabled = true;

            // disable set notification btn
            document.getElementById("setNotificationBtnId").disabled = true;

            // Reset data in selection fields
            document.getElementById("scheduleSendDateInput").value = "";
            document.getElementById("scheduleSendDateTimeInput").value = "";
            document.getElementById("whenToNotifySelectionId").value = "Once";
            document.getElementById("expirationDateInput").value = "";
            document.getElementById("expirationTimeInput").value = "";
        }
        // A project has been selected
        else {
            // Clear all error messages
            clearNotificationPageErrorMessages();

            // Reset data in selection fields
            document.getElementById("scheduleSendDateInput").value = "";
            document.getElementById("scheduleSendDateTimeInput").value = "";
            document.getElementById("whenToNotifySelectionId").value = "Once";
            document.getElementById("expirationDateInput").value = "";
            document.getElementById("expirationTimeInput").value = "";

            // disable all selection fields
            document.getElementById("scheduleSendDateInput").disabled = false;
            document.getElementById("scheduleSendDateTimeInput").disabled = false;
            document.getElementById("whenToNotifySelectionId").disabled = false;
            document.getElementById("expirationDateInput").disabled = false;
            document.getElementById("expirationTimeInput").disabled = false;

            // disable set notification btn
            document.getElementById("setNotificationBtnId").disabled = false;
        }
    });

    // when Set Notification btn is clicked, throw error for any empty input
    $("#setNotificationBtnId").click(function () {

        // if the value of the expiration date is empty, then throw red border and label error
        if (document.getElementById("expirationDateInput").value == "") {

            $('#expirationDateLabelId').addClass('error_class_label');
            $('#expirationDateInput').addClass('error_class_input');
        }

        // if the value of the time expiration is empty, then throw red border and label error
        if (document.getElementById("expirationTimeInput").value == "") {

            $('#expirationTimeLabelId').addClass('error_class_label');
            $('#expirationTimeInput').addClass('error_class_input');
        }

        // if the value of the start date is empty, then throw red border and label error
        if (document.getElementById("scheduleSendDateInput").value == "") {

            $('#scheduleSendDateId').addClass('error_class_label');
            $('#scheduleSendDateInput').addClass('error_class_input');
        }

        // if the value of the start time is empty, then throw red border and label error
        if (document.getElementById("scheduleSendDateTimeInput").value == "") {

            $('#scheduleReminderTimeId').addClass('error_class_label');
            $('#scheduleSendDateTimeInput').addClass('error_class_input');
        }
    });

    // Remove red border and text error expiration date label and input
    $("#expirationDateInput").change(function () {
        $('#expirationDateLabelId').removeClass('error_class_label');
        $('#expirationDateInput').removeClass('error_class_input');
    });

    // Remove red border and text error time expiration label and input
    $("#expirationTimeInput").change(function () {
        $('#expirationTimeLabelId').removeClass('error_class_label');
        $('#expirationTimeInput').removeClass('error_class_input');
    });

    // Remove red border and text error start date label and input
    $("#scheduleSendDateInput").change(function () {
        $('#scheduleSendDateId').removeClass('error_class_label');
        $('#scheduleSendDateInput').removeClass('error_class_input');
    });

    // Remove red border and text error start time label and input
    $("#scheduleSendDateTimeInput").change(function () {
        $('#scheduleReminderTimeId').removeClass('error_class_label');
        $('#scheduleSendDateTimeInput').removeClass('error_class_input');
    });

    // Clear all error messages (red label and border)
    function clearNotificationPageErrorMessages() {
        $('#expirationDateLabelId').removeClass('error_class_label');
        $('#expirationDateInput').removeClass('error_class_input');
        $('#expirationTimeLabelId').removeClass('error_class_label');
        $('#expirationTimeInput').removeClass('error_class_input');
        $('#scheduleSendDateId').removeClass('error_class_label');
        $('#scheduleSendDateInput').removeClass('error_class_input');
        $('#scheduleReminderTimeId').removeClass('error_class_label');
        $('#scheduleSendDateTimeInput').removeClass('error_class_input');
    }

    // When a project is selected
    $('#selectedProjectIdNotif').change(function () {

        // Change participant list when a new project is selected
        $("#participantsTableId > tbody").html("");

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

        // Check if surveylink cookie is set every few seconds.
    setInterval(function () {
        //this code runs every few seconds
        let participants = Cookies.get("participants"); // * Note -> the type of this variable is a string
        if (typeof participants !== "undefined") {
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
            Cookies.remove("participants");
        }
    }, 10);






});