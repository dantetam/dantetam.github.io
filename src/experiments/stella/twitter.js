function testTwitterAuth() {
  console.log("Starting");
  $.ajax(
    {
      //IGE3S3czZGl3NllxSlJzbWhGdmtXQmxqYWE6ZmVCaFcwdjBiMm5oZ3hzcHBvZWp6VmVDcUlrZ21ETkxRMWlrV1dkWjV6blZDSThXOUY=
      type: "POST",
      url: "https://api.twitter.com/oauth2/IGE3S3czZGl3NllxSlJzbWhGdmtXQmxqYWE6ZmVCaFcwdjBiMm5oZ3hzcHBvZWp6VmVDcUlrZ21ETkxRMWlrV1dkWjV6blZDSThXOUY=",
      data: "grant_type=client_credentials",
      dataType: 'jsonp',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Basic IGE3S3czZGl3NllxSlJzbWhGdmtXQmxqYWE6ZmVCaFcwdjBiMm5oZ3hzcHBvZWp6VmVDcUlrZ21ETkxRMWlrV1dkWjV6blZDSThXOUY=");
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
