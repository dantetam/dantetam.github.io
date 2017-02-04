function testTwitterAuth() {
  console.log("Starting");
  var token = "YTdLdzNkaXc2WXFKUnNtaEZ2a1dCbGphYTpmZUJoVzB2MGIybmhneHNwcG9lanpWZUNxSWtnbUROTFExaWtXV2RaNXpuVkNJOFc5Rg==";
  $.ajax(
    {
      //IGE3S3czZGl3NllxSlJzbWhGdmtXQmxqYWE6ZmVCaFcwdjBiMm5oZ3hzcHBvZWp6VmVDcUlrZ21ETkxRMWlrV1dkWjV6blZDSThXOUY=
      //YTdLdzNkaXc2WXFKUnNtaEZ2a1dCbGphYTpmZUJoVzB2MGIybmhneHNwcG9lanpWZUNxSWtnbUROTFExaWtXV2RaNXpuVkNJOFc5Rg==
      type: "POST",
      method: "POST",
      url: "https://api.twitter.com/oauth2/token",
      data: {grant_type: "client_credentials"},
      dataType: 'jsonp',
      xhrFields: {
        withCredentials: true
      },
      authorization: "Basic " + token,
      contentType: "application/x-www-form-urlencoded;charset=UTF-8",
      crossDomain: true,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + token);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
      },
      success: function() {
        alert('success');
      },
      error: function (xhr) {
        console.log(xhr.responseText);
      }
    }
  );

}

$(document).ready(function() {
  testTwitterAuth();
  console.log("Doneee");
});













//A comment to hold the line.
