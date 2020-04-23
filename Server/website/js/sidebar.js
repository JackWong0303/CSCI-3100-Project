//check login
$(function () {
    var userType = 'guest';
    $.ajax({
      type: "post",
      async: false,
      url: "/checkLogin"
    })
      .done(res => {
        if (res.isLogined == true) {
          $('#loginSignupForm').hide();
          $('#userIcon').show();
          $('#userIcon').append(res.user.toUpperCase().charAt(0));
          $('#userName').append(res.user);
          if (res.userType == 'owner') {
            $('#userIcon').css('background-color', '#eb4934');
            userType = 'owner';
          }
          else {
            userType = 'customer';
          }
        }
      })
      .fail((jqXHR, textStatus, err) => {
        alert(err);
      });
  
    $('#userIcon').click(() => {
      $("#sideBar").animate({
        width: "toggle"
      });
    });
  
    $('#bookingRecordBtn').click(() => {
      window.location.href = "/account";
    });
  
    $('#personalInfo').click(() => {
      window.location.href = "/account";
    });
  });
  
  // Logout
  $(function () {
    $('#logoutBtn').click(() => {
      $.ajax({
        type: "post",
        async: false,
        url: "/logout"
      })
        .done(res => {
          window.location.href = "/";
        })
        .fail((jqXHR, textStatus, err) => {
          alert(err);
        });
    });
  });