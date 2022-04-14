$(document).ready(function () {

    let uuid_list;
    let removed_participants_list = [];

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
        if (document.getElementById("selectedProjectIdNotif").value == "Select") {

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

        // Remove the error message that appears only when the user triggers the error
        let msg_err = document.querySelector('#message_error');
        if (msg_err != null) {
            msg_err.parentNode.removeChild(msg_err);
        }

        // Clear temp variables
        sDateTemp = "";
        eDateTemp = "";
        sTimeTemp = null;
        eTimeTemp = null;
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
        let uuid_list = Cookies.get("uuid"); // * Note -> the type of this variable is a string
        let time_list = Cookies.get("reminderTime");
        let date_list = Cookies.get("startDate");
        let datedate_list = Cookies.get("startDateDate");
        if (typeof uuid_list !== "uuid") {
            // Setting the participants cookie variable as a global variable
            // The selected project contains participants
            uuid_list = uuid_list.replace('[', '');
            uuid_list = uuid_list.replace(']', '');
            uuid_list = uuid_list.replaceAll('\'', '');
            uuid_list = uuid_list.split("\\054");
            time_list = time_list.replace('[', '');
            time_list = time_list.replace(']', '');
            time_list = time_list.replaceAll('\'', '');
            time_list = time_list.split("\\054");
            date_list = date_list.replace('[', '');
            date_list = date_list.replace(']', '');
            date_list = date_list.replaceAll('\'', '');
            date_list = date_list.split("\\054");
            datedate_list = datedate_list.replace('[', '');
            datedate_list = datedate_list.replace(']', '');
            datedate_list = datedate_list.replaceAll('\'', '');
            datedate_list = datedate_list.split("\\054");

            if (uuid_list[0] != "") {
                for (let i = 0; i < uuid_list.length; i++) {

                    // Adding a participant card to the right
                    $("tbody").append(" <tr class=\"unread animate_fade_in\" id=" + uuid_list[i] + ">\n" +
                        "                                                            <td><img class=\"rounded-circle\" style=\"width:40px;\"\n" +
                        "                                                                     src=\"/static/assets/images/user/user-3.png\"\n" +
                        "                                                                     alt=\"activity-user\">\n" +
                        "                                                            <td>\n" +
                        "                                                                <h6 class=\"mb-1\">" + time_list[i] + " " + date_list[i] + ", Starting " + datedate_list[i] + "</h6>\n" +
                        "                                                                <p class=\"m-0\">" + uuid_list[i] + "</p>\n" +
                        "                                                            </td>\n" +
                        "                                                            <td><button type=\"button\" class=\"label theme-bg2 text-white f-12 remove_card_edit_project removeButton\" name=\"editProjectBtn\" id=\"editProjectBtnId\">Remove</button>\n" +
                        "                                                            </td>\n" +
                        "                                                        </tr>");
                }
            }

            // Delete the cookie after usage.
            Cookies.remove("uuid");
            Cookies.remove("reminderTime");
            Cookies.remove("startDate");
            Cookies.remove("datedate_list");
        }
    }, 10);

    //When the "remove" button is clicked, remove the participant card
    $(document).on('click', '.remove_card_edit_project', function () {
        // Enabling the "Update Project" button
        let uuid = $(this).closest('tr').attr('id');

        // Before removing the div remove the animate class from the div
        document.getElementById(uuid).classList.remove("animate_fade_in")
        // fadeout the element first
        document.getElementById(uuid).classList.add("animate_fade_out");
        // //remove the parent element
        setTimeout(function () {
            // Wait for the element to exist
            if ($(document.getElementById(uuid)).length > 0) {
                $(document.getElementById(uuid)).remove();
            }
        }, 1000)
        Cookies.set("removed_participants_list", uuid, 365)
        $.ajax({
            type: "POST",
            url: '',
            data: {'removed_participants_list': uuid},
        });
    });


    // These variables are for the validate functions
    const form = document.querySelector('#notificationFormId'); // Grab the form needing validation
    let sDate = form.elements.namedItem("startDate"); // Grab the reminder start date input
    let eDate = form.elements.namedItem("endDate"); // Grab the expiration date input
    let sTime = form.elements.namedItem("startTime"); // Grab the reminder time input
    let eTime = form.elements.namedItem("endTime");

    // these temp variables will be used to validate temporary selected start date/times and end date/times
    let sDateTemp = "";
    let eDateTemp = "";
    let sTimeTemp = null;
    let eTimeTemp = null;

    // add an event listener to validate input everytime an event occurs
    sDate.addEventListener('input', validate);
    eDate.addEventListener('input', validate);
    sTime.addEventListener('input', validate);
    eTime.addEventListener('input', validate);

    // function to validate all start and end date/time selection inputs
    function validate(e) {
        // if the event (e) occurred on the reminder startDate input
        if (e.target.name == "startDate") {

            // convert date string to Date object
            sDateTemp = new Date(e.target.value.split('-'));

            // if the start date is greater than end date and the expiration date selection is not empty
            if (sDateTemp > eDateTemp && eDateTemp != "") {

                // disable set notification btn
                document.getElementById("setNotificationBtnId").disabled = true;

                // The error message will be added after scheduleSendDateInput (<input> tag)
                let targetTag = document.getElementById("scheduleSendDateInput");

                // Create the new div tag to be added
                const div = document.createElement("div")

                // The following html will be inserted in the div (friendly error message)
                div.innerHTML = "<br><div class=\"alert alert-danger animate_fade_in\" role=\"alert\" id=\"message_error\">\n" +
                    "                                            Reminder start date must be before expiration date!\n" +
                    "                                        </div>"

                // Insert the created element
                targetTag.after(div)
            }
            // if the dates are equal
            else if (sDateTemp.toDateString() == eDateTemp.toDateString() && sDateTemp != "" && eDateTemp != "" && sTimeTemp > eTimeTemp && eTimeTemp != null && sTimeTemp != null) {

                // if start time is large than expiration time
                if (sTimeTemp > eTimeTemp && eTimeTemp != null && sTimeTemp != null) {
                    // disable set notification btn
                    document.getElementById("setNotificationBtnId").disabled = true;

                    // The error message will be added after expirationTimeInput (<input> tag)
                    let targetTag = document.getElementById("expirationTimeInput");

                    // Create the new div tag to be added
                    const div = document.createElement("div")

                    // The following html will be inserted in the div (friendly error message)
                    div.innerHTML = "<br><div class=\"alert alert-danger animate_fade_in\" role=\"alert\" id=\"message_error\">\n" +
                        "                                           Expiration time must be after reminder time!\n" +
                        "                                        </div>"

                    // Insert the created element
                    targetTag.after(div)
                }
            } else // valid start Date input selection
            {
                // enable set notification btn
                document.getElementById("setNotificationBtnId").disabled = false;

                // Remove the error message that appears only when the user triggers the error
                let msg_err = document.querySelector('#message_error');
                if (msg_err != null) {
                    msg_err.parentNode.removeChild(msg_err);
                }
            }
        }

        // if the event (e) occurred on the expiration date input
        if (e.target.name == "endDate") {

            // convert date string to Date object
            eDateTemp = new Date(e.target.value.split('-'));

            // if end date is less than start date and reminder start date input selection is not empty
            if (eDateTemp < sDateTemp && sDateTemp != "") {

                // disable set notification btn
                document.getElementById("setNotificationBtnId").disabled = true;

                // The error message will be added after expirationDateInput (<input> tag)
                let targetTag2 = document.getElementById("expirationDateInput");

                // Create the new element to be added
                const div = document.createElement("div")

                // The following html will be inserted in the div (friendly error message)
                div.innerHTML = "<br><div class=\"alert alert-danger animate_fade_in\" role=\"alert\" id=\"message_error\">\n" +
                    "                                            Expiration date must be after start date!\n" +
                    "                                        </div>"

                // Insert the created element
                targetTag2.after(div)
            }

            // if the dates are equal
            else if (sDateTemp.toDateString() == eDateTemp.toDateString() && sDateTemp != "" && eDateTemp != "" && sTimeTemp > eTimeTemp && eTimeTemp != null && sTimeTemp != null) {

                // if start time is large than expiration time
                if (sTimeTemp > eTimeTemp && eTimeTemp != null && sTimeTemp != null) {
                    // disable set notification btn
                    document.getElementById("setNotificationBtnId").disabled = true;

                    // The error message will be added after expirationTimeInput (<input> tag)
                    let targetTag = document.getElementById("expirationTimeInput");

                    // Create the new div tag to be added
                    const div = document.createElement("div")

                    // The following html will be inserted in the div (friendly error message)
                    div.innerHTML = "<br><div class=\"alert alert-danger animate_fade_in\" role=\"alert\" id=\"message_error\">\n" +
                        "                                           Expiration time must be after reminder time!\n" +
                        "                                        </div>"

                    // Insert the created element
                    targetTag.after(div)
                }
            } else // valid start Date input selection
            {

                // enable set notification btn
                document.getElementById("setNotificationBtnId").disabled = false;

                // Remove the error message that appears only when the user triggers the error
                let msg_err = document.querySelector('#message_error');
                if (msg_err != null) {
                    msg_err.parentNode.removeChild(msg_err);
                }
            }
        }

        // if the event (e) occurred on the reminder start time input
        if (e.target.name == "startTime") {

            // parse hour and minutes to set a time object
            sTimeTemp = new Date().setHours(parseHours(e.target.value), parseMinutes(e.target.value), 0);

            // if the reminder start time is greater than expiration time and the expiration time selection is not empty
            if (sTimeTemp > eTimeTemp && eTimeTemp != null && sDateTemp.toDateString() == eDateTemp.toDateString()) {

                // disable set notification btn
                document.getElementById("setNotificationBtnId").disabled = true;

                // The error message will be added after scheduleSendDateInput (<input> tag)
                let targetTag = document.getElementById("scheduleSendDateTimeInput");

                // Create the new div tag to be added
                const div = document.createElement("div")

                // The following html will be inserted in the div (friendly error message)
                div.innerHTML = "<br><div class=\"alert alert-danger animate_fade_in\" role=\"alert\" id=\"message_error\">\n" +
                    "                                            Reminder Time must be before expiration time!\n" +
                    "                                        </div>"

                // Insert the created element
                targetTag.after(div)
            } else // valid start Date input selection
            {
                // enable set notification btn
                document.getElementById("setNotificationBtnId").disabled = false;

                // Remove the error message that appears only when the user triggers the error
                let msg_err = document.querySelector('#message_error');
                if (msg_err != null) {
                    msg_err.parentNode.removeChild(msg_err);
                }
            }
        }

        // if the event (e) occurred on the expiration date input
        if (e.target.name == "endTime") {

            // parse hour and minutes to set a time object
            eTimeTemp = new Date().setHours(parseHours(e.target.value), parseMinutes(e.target.value), 0);

            // if expiration time is less than reminder start time and reminder start time input selection is not empty
            if (eTimeTemp < sTimeTemp && sTimeTemp != null && sDateTemp.toDateString() == eDateTemp.toDateString()) {

                // disable set notification btn
                document.getElementById("setNotificationBtnId").disabled = true;

                // The error message will be added after expirationDateInput (<input> tag)
                let targetTag2 = document.getElementById("expirationTimeInput");

                // Create the new element to be added
                const div = document.createElement("div")

                // The following html will be inserted in the div (friendly error message)
                div.innerHTML = "<br><div class=\"alert alert-danger animate_fade_in\" role=\"alert\" id=\"message_error\">\n" +
                    "                                            Expiration time must be after reminder time!\n" +
                    "                                        </div>"

                // Insert the created element
                targetTag2.after(div)
            } else // valid start Date input selection
            {
                // enable set notification btn
                document.getElementById("setNotificationBtnId").disabled = false;

                // Remove the error message that appears only when the user triggers the error
                let msg_err = document.querySelector('#message_error');
                if (msg_err != null) {
                    msg_err.parentNode.removeChild(msg_err);
                }
            }
        }
    }

    // parse hours from string time
    function parseHours(d) {
        var h = parseInt(d.split(':')[0]);
        if (d.split(':')[1].split(' ')[1] == "PM") {
            h = h + 12;
        }
        return h;
    }

    // parse minutes from string time
    function parseMinutes(d) {
        return parseInt(d.split(':')[1].split(' ')[0]);
    }

    // Disable all date selections before current date
    $(document).ready(function () {
        var todaysDate = new Date();
        var yr = todaysDate.getFullYear();
        var mon = ("0" + (todaysDate.getMonth() + 1)).slice(-2);
        var day = ("0" + todaysDate.getDate()).slice(-2);
        var maxDate = (yr + "-" + mon + "-" + day);

        // apply it to the reminder start date and expiration date
        $('#scheduleSendDateInput').attr('min', maxDate);
        $('#expirationDateInput').attr('min', maxDate);
    });

    // removes the error/success card upon submission
    $(document).on('click', '.close_button', function () {
        // remove fade_in class from the element
        document.getElementById("message_error").classList.remove("animate_fade_in");
        // add fade_out class to the element
        document.getElementById("message_error").classList.add("animate_fade_out");

        // delete the element after 1 second
        // //remove the parent element
        setTimeout(function () {
            // Wait for the element to exist
            if ($(document.getElementById("message_error")).length > 0) {
                $(document.getElementById("message_error")).remove();
            }
        }, 1000)
    });
});