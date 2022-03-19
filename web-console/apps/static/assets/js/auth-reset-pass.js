$(document).ready(function () {
    // Once we arrive to the reset password page, disable 'reset password' button and password and confirm password input fields
    document.getElementById("reset-password-button").disabled = true;

    // Gathering input after POST
    let user_password_not_valid_input = document.getElementById("password-reset-id").value;
    let user_confirm_password_not_valid_input = document.getElementById("confirm-password-reset-id").value;

    //  If password fields do not match, throw error via css (red border around input fields)
    if (user_password_not_valid_input != user_confirm_password_not_valid_input) {
        // Enable red border on input fields
        $('#password-reset-id').addClass('error_class_input');
        $('#confirm-password-reset-id').addClass('error_class_input');
        document.getElementById("reset-password-button").disabled = false;
    }

    // When the user begins to enter a username, the reset of the input fields and button get enabled
    $('#confirm-password-reset-id').on("change keyup paste click", function () {
        // Once the user is entering a username, enable button
        document.getElementById("reset-password-button").disabled = false;
    });

    // Once the user begins typing on the input box (password) with a red border, the red border will go away
    $('#password-reset-id').on("change keyup paste click", function () {
        // This will remove the red error border message
        $('#password-reset-id').removeClass('error_class_input');
    });

    // Once the user begins typing on the input box (confirm password) with a red border, the red border will go away
    $('#confirm-password-reset-id').on("change keyup paste click", function () {
        // This will remove the red error border message
        $('#confirm-password-reset-id').removeClass('error_class_input');
    });

    // removes the error/warning message
    $(document).on('click', '.close_button', function () {
        // remove fade_in class from the element
        document.getElementById("pw_instructions_msg").classList.remove("animate_fade_in");
        // add fade_out class to the element
        document.getElementById("pw_instructions_msg").classList.add("animate_fade_out");

        // delete the element after 1 second
        // //remove the parent element
        setTimeout(function () {
            // Wait for the element to exist
            if ($(document.getElementById("pw_instructions_msg")).length > 0) {
                $(document.getElementById("pw_instructions_msg")).remove();
            }
        }, 1000)
    });
});