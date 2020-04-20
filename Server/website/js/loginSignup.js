$(function () {
  $.ajax({
    type: "post",
    async: false,
    url: "/checkLogin"
  })
    .done(res => {
      if (res.isLogined == true) {
        window.location.href = "/";
      }
    })
    .fail((jqXHR, textStatus, err) => {
      alert(err);
    });
});

$(function () {
  $("#loginForm").submit(function (e) {
    var form = $(this);
    var url = form.attr('action');
    $.ajax({
      type: "POST",
      async: false,
      data: form.serialize(),
      url: url
    })
      .done(res => {
        alert(res);
        if (res == "CustomerLoginSuccess" || res == "OwnerLoginSuccess")
          window.location.href = "/";
      })
      .fail((jqXHR, textStatus, err) => {
        alert(err);
      });
    e.preventDefault();
  });
});

$(function () {
  $("#createCustomerBtn").click(() => {
    window.location.href = "/customerSignup";
  });

  $("#createOwnerBtn").click(() => {
    window.location.href = "/ownerSignup";
  });
});
