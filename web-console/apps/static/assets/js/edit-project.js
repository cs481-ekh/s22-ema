$(document).ready(function () {

    //let selectedProject = document.getElementById('selectProjectEditId');
    //let textOption = selectedProject.options[selectedProject.selectedIndex].text
    // let survey_link_input_field = document.forms['editProjectInformation']['surveyLink'];
    // let survey_link_input_field2 = document.forms['editProjectInformation']['surveyLink'];
    // let edit_project_form = document.getElementById('editProjectInformationId');

    // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    $('#selectProjectEditId').change(function(){
        let selectVal = $(this).val()

            $.ajax({
            type: "POST",
            url: '',
            data: {'selected_project': selectVal},
        });


    alert($(this).val());
})


    // On the Edit Project page, when the user selects a project,
    // $("#selectProjectEditId").change(function (event) {
    //
    //     let selected_project = $("#selectProjectEditId");
    //     alert(selectProjectEditId);
    //
    //     $.ajax({
    //         type: "POST",
    //         url: '',
    //         data: {'selected_project': selected_project},
    //     });
    // });
});