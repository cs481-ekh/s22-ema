$(document).ready(function () {

    let participant_list = []; // List that will contain all the emails of participants to be added to the project.
    let participant_email;

    // Targeting Add Participant button
    $("#submitParticipant").click(function () {

        participant_email = $("#participantEmailInput").val();
        if (participant_email != "") {
            participant_list.push(participant_email);
            // Once participant list has been built it needs to be tied into the Create New Project as this data will be getting posted to the same page.
            // Only button of submit type 'value' can be edited which is to be posted.
            $("#createProject").attr("value", participant_list);
        }


    });
});