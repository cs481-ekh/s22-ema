$(document).ready(function () {

    // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    // #selectedProjectDashboard
    $(document).on('change', '#selectProjectDashbaordId', function () {

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
                            // Get data from JSON on client end
                            $.get("JSON/", function (data) {
                                for (let i = 0; i < data.length; i++) {
                                    let email = data[i].email;
                                    let username = email.split("@");
                                    // let username = data[i].email.split("@");
                                    if (data[i].streak < 1) {

                                        $("#table_body_Dashboard").append("<tr class=\"animate_fade_in\"" + "id=" + data[i].email + ">\n" +
                                            "                                                <td><img class=\"rounded-circle\" style=\"width:40px;\"\n" +
                                            "                                                         src=\"/static/assets/images/user/user-3.png\"\n" +
                                            "                                                         alt=\"activity-user\"></td>\n" +
                                            "                                                <td>\n" +
                                            "                                                    <h6 class=\"mb-1\">" + username[0] + "</h6>\n" +
                                            "                                                    <p class=\"m-0\">" + data[i].email + "</p>\n" +
                                            "                                                </td>\n" +
                                            "                                                <td>\n" +
                                            "                                                    <h6 class=\"text-muted\"><i\n" +
                                            "                                                            class=\"fas fa-circle text-c-red f-10 m-r-15\"></i>" + data[i].streak +
                                            "                                                        </h6>\n" +
                                            "                                                </td>\n" +
                                            "                                                <td><a href=\"#!\" class=\"label theme-bg2 text-white f-12\">Reject</a><a\n" +
                                            "                                                        href=\"#!\" class=\"label theme-bg text-white f-12\">Approve</a>\n" +
                                            "                                                </td>\n" +
                                            "                                            </tr>")
                                    }
                                    else {
                                                     $("#table_body_Dashboard").append("<tr class=\"animate_fade_in\"" + "id=" + data[i].email + ">\n" +
                            "                                                <td><img class=\"rounded-circle\" style=\"width:40px;\"\n" +
                            "                                                         src=\"/static/assets/images/user/user-3.png\"\n" +
                            "                                                         alt=\"activity-user\"></td>\n" +
                            "                                                <td>\n" +
                            "                                                    <h6 class=\"mb-1\">" + username[0] + "</h6>\n" +
                            "                                                    <p class=\"m-0\">" + data[i].email + "</p>\n" +
                            "                                                </td>\n" +
                            "                                                <td>\n" +
                            "                                                    <h6 class=\"text-muted\"><i\n" +
                            "                                                            class=\"fas fa-circle text-c-green f-10 m-r-15\"></i>" + data[i].streak +
                            "                                                        </h6>\n" +
                            "                                                </td>\n" +
                            "                                                <td><a href=\"#!\" class=\"label theme-bg2 text-white f-12\">Reject</a><a\n" +
                            "                                                        href=\"#!\" class=\"label theme-bg text-white f-12\">Approve</a>\n" +
                            "                                                </td>\n" +
                            "                                            </tr>")

                                    }

                                }
                            });
                            // send request to the server to clear the participant list dictionary
                            $.ajax({
                                type: "POST",
                                url: '',
                                data: {'clear_list': true}
                            });
                            Cookies.remove("set_json");

                        }
                    }
                    ,
                    10
                )
                ;

            } else {
                // if project selected == "Select" than
                document.getElementById("projectCountDataId").innerText = "--";
                document.getElementById("projectCountPercentageId").innerText = "--";
                // remove the participants
                $('#participantCardId').removeClass('participantCardId');
                $('#participantCardId').addClass('animate_fade_out');

            }

            // // Setting card data
            // setInterval(function () {
            //     // user data from Cookie
            //     let user_email = Cookies.get("user_email")
            //     let user_date_created = Cookies.get("user_date_created");
            //     let user_streak_value = Cookies.get("user_streak_value");
            //     let user_number_of_projects = Cookies.get("user_number_of_projects");
            //     let user_streak_flag = Cookies.get("user_streak_flag");
            //
            //     if (typeof user_date_created !== "undefined" && user_streak_value != "undefined" && user_number_of_projects != "undefined" && user_email != "undefined") {
            //         // Append the card below the dropdown box
            //         let username = user_email.split("@")
            //         if (user_streak_flag === "red") {
            //             $("#table_body_Dashboard").append("<tr class=\"animate_fade_in\"" + "id=" + user_email + ">\n" +
            //                 "                                                <td><img class=\"rounded-circle\" style=\"width:40px;\"\n" +
            //                 "                                                         src=\"/static/assets/images/user/user-3.png\"\n" +
            //                 "                                                         alt=\"activity-user\"></td>\n" +
            //                 "                                                <td>\n" +
            //                 "                                                    <h6 class=\"mb-1\">" + username[0] + "</h6>\n" +
            //                 "                                                    <p class=\"m-0\">" + user_email + "</p>\n" +
            //                 "                                                </td>\n" +
            //                 "                                                <td>\n" +
            //                 "                                                    <h6 class=\"text-muted\"><i\n" +
            //                 "                                                            class=\"fas fa-circle text-c-red f-10 m-r-15\"></i>" + user_streak_value +
            //                 "                                                        </h6>\n" +
            //                 "                                                </td>\n" +
            //                 "                                                <td><a href=\"#!\" class=\"label theme-bg2 text-white f-12\">Reject</a><a\n" +
            //                 "                                                        href=\"#!\" class=\"label theme-bg text-white f-12\">Approve</a>\n" +
            //                 "                                                </td>\n" +
            //                 "                                            </tr>").ready(function () {
            //                 // remove cookies
            //                 Cookies.remove("user_email");
            //                 Cookies.remove("user_date_created");
            //                 Cookies.remove("user_streak_value");
            //                 Cookies.remove("user_number_of_projects");
            //                 Cookies.remove("user_streak_flag");
            //
            //             });
            //             ;
            //         } else {
            //
            //             $("#table_body_Dashboard").append("<tr class=\"animate_fade_in\"" + "id=" + user_email + ">\n" +
            //                 "                                                <td><img class=\"rounded-circle\" style=\"width:40px;\"\n" +
            //                 "                                                         src=\"/static/assets/images/user/user-3.png\"\n" +
            //                 "                                                         alt=\"activity-user\"></td>\n" +
            //                 "                                                <td>\n" +
            //                 "                                                    <h6 class=\"mb-1\">" + username[0] + "</h6>\n" +
            //                 "                                                    <p class=\"m-0\">" + user_email + "</p>\n" +
            //                 "                                                </td>\n" +
            //                 "                                                <td>\n" +
            //                 "                                                    <h6 class=\"text-muted\"><i\n" +
            //                 "                                                            class=\"fas fa-circle text-c-green f-10 m-r-15\"></i>" + user_streak_value +
            //                 "                                                        </h6>\n" +
            //                 "                                                </td>\n" +
            //                 "                                                <td><a href=\"#!\" class=\"label theme-bg2 text-white f-12\">Reject</a><a\n" +
            //                 "                                                        href=\"#!\" class=\"label theme-bg text-white f-12\">Approve</a>\n" +
            //                 "                                                </td>\n" +
            //                 "                                            </tr>").ready(function () {
            //                 // remove cookies
            //                 Cookies.remove("user_email");
            //                 Cookies.remove("user_date_created");
            //                 Cookies.remove("user_streak_value");
            //                 Cookies.remove("user_number_of_projects");
            //                 Cookies.remove("user_streak_flag");
            //
            //             });
            //
            //         }
            //
            //
            //     }
            // }, 10);
        }
    )
    ;


});