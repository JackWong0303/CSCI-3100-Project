$(function () {
    $("#customerSignUpForm").submit(function (e) {
        e.preventDefault();
        var form = $(this);
        var url = form.attr('action');

        if (form.validate().valid()){
            $.post(url, form.serialize(), function(data)) {
                alert("Success!");
                window.location.href = "/signupSuccess.html";
            }
        }else{
            alert("Error!");
        }
    });
});
