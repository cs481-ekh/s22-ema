$(document).ready(function () {
    // Once we arrive to the reset password page, disable 'reset password' button and password and confirm password input fields
    document.getElementById("reset-password-button").disabled = true;
    document.getElementById("password-reset-id").disabled = true;
    document.getElementById("confirm-password-reset-id").disabled = true;


    // When the user begins to enter a username, the reset of the input fields and button get enabled
    $('#username-password-reset-id').on("change keyup paste click", function () {
        // Once the user is entering a username, enable all fields and buttons
        document.getElementById("reset-password-button").disabled = false;
        document.getElementById("password-reset-id").disabled = false;
        document.getElementById("confirm-password-reset-id").disabled = false;

        // This will remove the red error border message
        //$('#addParticipantInput-editProject').removeClass('error_class_input')
        //$('#addParticipantLabelId-editProject').removeClass('error_class_label');
    });

});