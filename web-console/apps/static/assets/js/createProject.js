$(document).ready(function () {
    let participant_list = []; // List that will contain all the emails of participants to be added to the project.
    let participant_email;

    // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    // Targeting Add Participant button
    $("#submitParticipant").click(function () {

        participant_email = $("#participantEmailInput").val();

        if (participant_email != "") {
            // push the email to the list.
            participant_list.push(participant_email);

            // Post the email to get it checked if it exits in the project
            $.ajax({
                url: '',
                method: 'POST', // This is the default though, you don't actually need to always mention it
                data: {'participantEmail': participant_email},
            });
        }
        // Once participant list has been built it needs to be tied into the Create New Project as this data will be getting posted to the same page.
        // Only button of submit type 'value' can be edited which is to be posted.
        $("#createProject").attr("value", participant_list);
    });


});