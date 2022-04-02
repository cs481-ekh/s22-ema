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
        else
        {
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

});