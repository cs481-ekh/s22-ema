$(document).ready(function () {

    // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    // #selectedProjectDashboard
    $(document).on('change', '#selectProjectDashbaordId', function () {
            // if project selected == "Select" than
            document.getElementById("projectCountDataId").innerText = "--";
            document.getElementById("projectCountPercentageId").innerText = "--";
            // remove the participants
            $('#participantCardId').removeClass('participantCardId');
            $('#participantCardId').addClass('animate_fade_out');

            // get all ids of the card inside table
            let card_Ids = [];
            $("#table_body_Dashboard").find("tr").each(function () {
                card_Ids.push(this.id);
            });
            for (let i = 0; i < card_Ids.length; i++) {
                let element = document.getElementById(card_Ids[i])
                //remove fade in class
                $(element).removeClass('animate_fade_in');
                // add fade out class
                $(element).fadeOut("normal", function () {
                    // remove the element
                    $(this).remove();
                });
            }

            let project_name = $("#selectProjectDashbaordId").val();
            // After getting the project name create a POST request
            if (project_name !== 'Select') {
                $.ajax({
                    type: "POST",
                    url: '',
                    data: {'selectedProject': project_name}
                });

                // Setting Project Count value
                setInterval(function () {
                    let part_count = Cookies.get("part_list_count");
                    let part_percent = Cookies.get("participant_percentage");
                    let part_list = Cookies.get("participant_list");


                    // Cleaning participant list
                    //let participant_list = part_list.match(/(?<=')[^' \054]+(?=')/g);

                    if (typeof part_count !== "undefined" && part_percent != "undefined" && part_list != "undefined") {
                        document.getElementById("projectCountDataId").innerText = part_count;
                        document.getElementById("projectCountPercentageId").innerText = part_percent + '%';
                        // removing cookies
                        Cookies.remove("part_list_count");
                        Cookies.remove("participant_percentage");
                        Cookies.remove("part_list");

                    }


                }, 10);

                setInterval(function () {
                        let set_json = Cookies.get("set_json");
                        if (typeof set_json != "undefined") {
                            Cookies.remove("set_json");
                            // Get data from JSON on client end
                            $.get("JSON/", function (data) {
                                for (let i = 0; i < data.length; i++) {
                                    if (data[i].length !== 1 ) {
                                        console.log(typeof data[i].length)
                                        let email = data[i].email;
                                        let dateCreated = data[i].dateCreated;
                                        let dateCreated_clean = dateCreated.split("T");
                                        let username = email.split("@");
                                        let totalProjects = (data[i].projectId)
                                        if (data[i].streak < 1) {
                                            // getting the activity_user image. Clean string than add. Due to bad user behaviour
                                            let user_pic_url = String(window.location.origin).replace("/ema/activity_user/", "").trim() + "/ema/editProject/activity_user/"
                                            $.ajax({
                                                url: user_pic_url,
                                                timeout: 5000,
                                                success: function () {
                                                    $("#table_body_Dashboard").append("<tr class=\"animate_fade_in card_remove_on_select\"" + "id=" + data[i].email + ">\n" +
                                                        "                                                <td><img class=\"rounded-circle\" style=\"width:40px;\"\n" +
                                                        "                                                         src=" + user_pic_url + "\n" +
                                                        "                                                         alt=\"activity-user\"></td>\n" +
                                                        "                                                <td>\n" +
                                                        "                                                    <h6 class=\"mb-1\">" + username[0] + "</h6>\n" +
                                                        "                                                    <p class=\"m-0\">" + data[i].email + "</p>\n" +
                                                        "                                                </td>\n" +
                                                        "                                                <td>\n" +
                                                        "                                                    <h6 class=\"text-muted\"><i\n" +
                                                        "                                                            class=\"fas fa-circle text-c-red f-10 m-r-15\"></i>" + "Streaks: " + data[i].streak +
                                                        "                                                        </h6>\n" +
                                                        "                                                </td>\n" +
                                                        "                                                <td><a href=\"#!\" class=\"label theme-bg2 text-white f-12 disabled-link\">" + "Total Projects: " + totalProjects.length + "</a>\n" +
                                                        "                                                </td>\n" +
                                                        "                                                <td>" + "<a" +
                                                        "                                                        href=\"#!\" class=\"label theme-bg text-white f-12 disabled-link\">" + "Date Created: " + dateCreated_clean[0] + "</a>\n" +
                                                        "                                                </td>\n" +
                                                        "                                            </tr>")
                                                    cardCreated = true;
                                                }
                                            });
                                        } else {
                                            // getting the activity_user image. Clean string than add. Due to bad user behaviour
                                            let user_pic_url = String(window.location.origin).replace("/ema/activity_user/", "").trim() + "/ema/editProject/activity_user/"
                                            $.ajax({
                                                url: user_pic_url,
                                                timeout: 5000,
                                                success: function () {
                                                    $("#table_body_Dashboard").append("<tr class=\"animate_fade_in card_remove_on_select\"" + "id=" + data[i].email + ">\n" +
                                                        "                                                <td><img class=\"rounded-circle\" style=\"width:40px;\"\n" +
                                                        "                                                         src=" + user_pic_url + "\n" +
                                                        "                                                         alt=\"activity-user\"></td>\n" +
                                                        "                                                <td>\n" +
                                                        "                                                    <h6 class=\"mb-1\">" + username[0] + "</h6>\n" +
                                                        "                                                    <p class=\"m-0\">" + data[i].email + "</p>\n" +
                                                        "                                                </td>\n" +
                                                        "                                                <td>\n" +
                                                        "                                                    <h6 class=\"text-muted\"><i\n" +
                                                        "                                                            class=\"fas fa-circle text-c-green f-10 m-r-15\"></i>" + "Streaks: " + data[i].streak +
                                                        "                                                        </h6>\n" +
                                                        "                                                </td>\n" +
                                                        "                                                <td><a href=\"#!\" class=\"label theme-bg2 text-white f-12 disabled-link\">" + "Total Projects: " + totalProjects.length + "</a>\n" +
                                                        "                                                </td>\n" +
                                                        "                                                <td>" + "<a" +
                                                        "                                                        href=\"#!\" class=\"label theme-bg text-white f-12 disabled-link\">" + "Date Created: " + dateCreated_clean[0] + "</a>\n" +
                                                        "                                                </td>\n" +
                                                        "                                            </tr>")
                                                }
                                            });
                                        }
                                    }
                                }
                                // send request to the server to clear the participant list dictionary
                                $.ajax({
                                    type: "POST",
                                    url: '',
                                    data: {'clear_list': true}
                                });
                            });
                        }
                    },
                    10);
            }
        }
    );


});