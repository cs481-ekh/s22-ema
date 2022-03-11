$(document).ready(function () {

    // setting up ajax header
    $.ajaxSetup({
        headers: {"X-CSRFToken": Cookies.get("csrftoken")}
    });

    $('#selectProjectEditId').change(function () {
        let selectVal = $(this).val()

        $.ajax({
            type: "POST",
            url: '',
            data: {'selected_project': selectVal},
        });


        alert($(this).val());
    })


});