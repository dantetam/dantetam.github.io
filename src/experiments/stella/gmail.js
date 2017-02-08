var clientId = '424136181163-bv5drepde8ruaug755ilqck7i599s2ci.apps.googleusercontent.com';
var apiKey = 'AIzaSyClTWJV_mKBgGjO4MZ4t2kxnilvNHSjHes';
var scopes = 'https://www.googleapis.com/auth/gmail.readonly' + ' ' + 'https://www.googleapis.com/auth/calendar';

function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth, 1);
}

function checkAuth() {
  gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: true,
    cookie_policy: 'single_host_origin'
  }, handleAuthResult);
}

function handleAuthClick() {
  gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: false,
    cookie_policy: 'single_host_origin'
  }, handleAuthResult);
  return false;
}

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    //loadGmailApi();
    //loadCalendarApi();
    //testRequestCreateEvent();
    //$('#authorize-button').remove();
    $('.table-inbox').removeClass("hidden");
  } else {
    //$('#authorize-button').removeClass("hidden");
    $('#authorize-button').on('click', function(){
      handleAuthClick();
    });
  }
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', function() {
    //testRequestCreateEvent();
    //listUpcomingEvents();
  });
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date('2000-1-1')).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;
    console.log('Upcoming events:');

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        console.log(event.summary + ' (' + when + ')')
      }
    } else {
      console.log('No upcoming events found.');
    }

  });
}


function logOutGmail() {
  gapi.auth.signOut();
  $('.table-inbox tbody').html("");

  d3.select("#authorize-button").style("opacity", 0);
  d3.select("#logout-button").style("opacity", 0);
  d3.select("#email-display").style("display", "none");
  //$('body').html("");
}

function loadGmailApi() {
  gapi.client.load('gmail', 'v1', displayInbox);
}

function displayInbox() {
  var request = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'INBOX',
    'maxResults': 50
  });

  request.execute(function(response) {
    $.each(response.messages, function() {
      var messageRequest = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': this.id
      });
      messageRequest.execute(appendMessageRow);
    });
  });
}

function appendMessageRow(message) {
  var labelsString = "";
  for (var i = 0; i < message.labelIds.length; i++) {
    labelsString += message.labelIds[i] + " ";
  }
  $('.table-inbox tbody').append(
    '<tr>\
      <td>'+getHeader(message.payload.headers, 'From')+'</td>\
      <td>'+getHeader(message.payload.headers, 'Subject')+'</td>\
      <td>'+labelsString+'</td>\
      <td>'+getHeader(message.payload.headers, 'Date')+'</td>\
    </tr>'
  );
}

function appendMessageRow(message) {
  var labelsString = "";
  for (var i = 0; i < message.labelIds.length; i++) {
    labelsString += message.labelIds[i] + " ";
  }
  $('.table-inbox tbody').append(
    '<tr>\
      <td>'+getHeader(message.payload.headers, 'From')+'</td>\
      <td>\
        <a href="#message-modal-' + message.id +
          '" data-toggle="modal" id="message-link-' + message.id+'">' +
          getHeader(message.payload.headers, 'Subject') +
        '</a>\
      </td>\
      <td>'+labelsString+'</td>\
      <td>'+getHeader(message.payload.headers, 'Date')+'</td>\
    </tr>'
  );
  $('body').append(
    '<div class="modal fade" id="message-modal-' + message.id +
        '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
      <div class="modal-dialog modal-lg">\
        <div class="modal-content">\
          <div class="modal-header">\
            <button type="button"\
                    class="close"\
                    data-dismiss="modal"\
                    aria-label="Close">\
              <span aria-hidden="true">&times;</span></button>\
            <h4 class="modal-title" id="myModalLabel">' +
              getHeader(message.payload.headers, 'Subject') +
            '</h4>\
          </div>\
          <div class="modal-body">\
            <iframe id="message-iframe-'+message.id+'" style="width: 100%;" height="' + ($(window).height() * 0.8) + '" srcdoc="<p>Loading...</p>">\
            </iframe>\
          </div>\
        </div>\
      </div>\
    </div>'
  );
  $('#message-link-'+message.id).on('click', function() {
    var ifrm = $('#message-iframe-'+message.id)[0].contentWindow.document;
    $('body', ifrm).html(getBody(message.payload));
  });
}

function getHeader(headers, index) {
  var header = '';
  $.each(headers, function() {
    if (this.name === index) {
      header = this.value;
    }
  });
  return header;
}
function getBody(message) {
  var encodedBody = '';
  if (typeof message.parts === 'undefined') {
    encodedBody = message.body.data;
  }
  else {
    encodedBody = getHTMLPart(message.parts);
  }
  encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  return decodeURIComponent(escape(window.atob(encodedBody)));
}
function getHTMLPart(arr) {
  for (var x = 0; x <= arr.length; x++) {
    if (typeof arr[x].parts === 'undefined') {
      if (arr[x].mimeType === 'text/html') {
        return arr[x].body.data;
      }
    }
    else {
      return getHTMLPart(arr[x].parts);
    }
  }
  return '';
}
