$(document).ready(function () {


    let participant_list = []; // List that will contain all the emails of participants to be added to the project.
    let participant_email;
    let project_name;

    // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    // Check cookie every few seconds.
      setInterval(function () {
        //this code runs every few seconds
        let non_part = Cookies.get("non_participant_email")
        if (typeof non_part !== "undefined") {
            alert(non_part + " does not exist!")
            //clear data from participant list.
            participant_list = participant_list.filter(item => item !== non_part)
            // Delete the cookie after usage.
            Cookies.remove("non_participant_email")
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
    $("#submitParticipant").click(function () {

        participant_email = $("#participantEmailInput").val();
        project_name = $("#protectNameInput").val();

        if (participant_email != "" && project_name != "") {
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


            } else {
                // There needs to be a div here.
                alert("Email has been added already.");
            }

        }
        // Once participant list has been built it needs to be tied into the Create New Project as this data will be getting posted to the same page.
        // Only button of submit type 'value' can be edited which is to be posted.
        $("#createProject").attr("value", participant_list);
    });





});