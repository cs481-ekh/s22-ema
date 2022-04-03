$(document).ready(function () {

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
    $(document).on('change', '#selectedProjectId', function () {
        // if no project is selected
        if (document.getElementById("selectedProjectId").value == "Select Project") {

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
});