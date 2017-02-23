stella.forms = [];

var storedResponses = Object.create(null);

stella.forms.push({
  fullName: "finance",
  displayName: "Financial Record Form",
  //names: ["stocks", "symbol", "symbols", "finance"],
  fields: {
    taskCat: "Topic",
    description: "Description/Notes",
    filingCategory: "Folder",
    day: "Date",
    timeStart: "Start Time",
    timeFinish: "Completion Time",
    value: "Revenue/Expense"
  },
  defaults: {
    day: currentDay,
    timeStart: currentTime,
    timeFinish: currentTime
  },
  desc: "Log a task with Stella's productivity forms.",
  execute: function(response) {
    var keys = Object.keys(response);
    for (var i = 0; i < keys.length; i++) {
      if (response[keys[i]] === undefined || response[keys[i]].trim() === "") {
        if (keys[i] in this.defaults) {
          var defaultInput = this.defaults[keys[i]];
          if (typeof defaultInput === "function") {
            defaultInput = defaultInput();
          }
          response[keys[i]] = defaultInput;
        }
        else {
          response[keys[i]] = "";
        }
      }
    }
    console.log(response);
  }
});

stella.forms.push({
  fullName: "memo",
  displayName: "Memorandum/Correspondence",
  //names: ["stocks", "symbol", "symbols", "finance"],
  fields: {
    taskCat: "Memo",
    description: "Description/Notes",
    filingCategory: "Folder",
    day: "Date",
    time: "Time",
    from: "From",
    to: "To"
  },
  defaults: {
    day: currentDay,
    time: currentClock,
    from: username
  },
  desc: "Create a memorandum to sent or stored.",
  execute: function(response) {
    var keys = Object.keys(response);
    for (var i = 0; i < keys.length; i++) {
      if (response[keys[i]] === undefined || response[keys[i]].trim() === "") {
        if (keys[i] in this.defaults) {
          var defaultInput = this.defaults[keys[i]];
          if (typeof defaultInput === "function") {
            defaultInput = defaultInput();
          }
          response[keys[i]] = defaultInput;
        }
        else {
          response[keys[i]] = "";
        }
      }
    }
    console.log(response);
  }
});

stella.forms.push({
  fullName: "time",
  displayName: "Time Record Form",
  //names: ["stocks", "symbol", "symbols", "finance"],
  fields: {
    taskCat: "Topic/Class/Issue",
    description: "Description/Notes",
    filingCategory: "Folder",
    day: "Date",
    timeStart: "Start Time",
    timeFinish: "Completion Time",
    value: "Value"
  },
  defaults: {
    day: currentDay,
    timeStart: currentClock,
    timeFinish: currentClock
  },
  desc: "Log a task with Stella's productivity forms.",
  execute: function(response) {
    var keys = Object.keys(response);
    for (var i = 0; i < keys.length; i++) {
      if (response[keys[i]] === undefined || response[keys[i]].trim() === "") {
        if (keys[i] in this.defaults) {
          var defaultInput = this.defaults[keys[i]];
          if (typeof defaultInput === "function") {
            defaultInput = defaultInput();
          }
          response[keys[i]] = defaultInput;
        }
        else {
          response[keys[i]] = "";
        }
      }
    }
    console.log(response);
  }
});

for (var i = 0; i < stella.forms.length; i++) {
  var form = stella.forms[i];
  var commaFields = "";
  var keys = Object.keys(form.fields);
  for (var j = 0; j < keys.length; j++) {
    commaFields += keys[j];
    if (j !== keys.length - 1) {
      commaFields += ",";
    }
  }
  form["csvColumns"] = commaFields;
}

function responseToCSVRow(response) {
  var commaFields = "";
  var keys = Object.keys(response);
  for (var j = 0; j < keys.length; j++) {
    commaFields += keys[j];
    if (j !== keys.length - 1) {
      commaFields += ",";
    }
  }
  return commaFields;
};

function findStellaFormName(formName) {
  var form = null;
  for (var i = 0; i < stella.forms.length; i++) {
    if (stella.forms[i]["fullName"] === formName) {
      form = stella.forms[i];
    }
  }
  return form;
}

function submitStellaForm(formName) {
  var form = findStellaFormName(formName);

  var response = jQuery.extend({}, form.fields);

  var stellaForm = d3.select("#stella-form");
  stellaForm.selectAll("input").each(function() {
    var inputName = this.id.replace("stella-form-input-", "");
    response[inputName] = this.value;
  });

  form.execute(response);

  if (storedResponses[formName] === null || storedResponses[formName] === undefined) {
    storedResponses[formName] = [];
  }
  storedResponses[formName].push(response);

  stellaForm.html("<h4>Form submitted.</h4>");

  //Not sure how to interrupt this transition if there is input to Stella during the transition period.
  //setTimeout(function() {
    //stellaForm.transition().duration(1000).style("opacity", 0).each("end", function() {stellaForm.html("")});
  //}, 5000);
}

function showStellaForm(form, alreadyWrittenResponses) {
  var stellaForm = d3.select("#stella-form");
  stellaForm.html("<h4>" + form.displayName + "</h4>");
  var keys = Object.keys(form.fields);
  var stringy = "<table>";
  for (var i = 0; i < keys.length; i++) {
    stringy += '<tr><td align="right">' + form.fields[keys[i]] + '</td><td align="left"><input type="text" id="stella-form-input-' + keys[i] + '"></input></td></tr>';
  }
  stringy += "</table>";
  stringy += '<button onclick="javascript:submitStellaForm(&quot;' + form.fullName + '&quot;);" align="left">Submit</button>'
  stellaForm.html(stellaForm.html() + stringy);
  console.log(stellaForm.html());

  var inputs = stellaForm.selectAll("input").each(function() {
    var inputName = this.id.replace("stella-form-input-", "");
    if (inputName in form.defaults) {
      var defaultInput = form.defaults[inputName];
      if (typeof defaultInput === "function") {
        defaultInput = defaultInput();
      }
      this.value = defaultInput;
    }
    if (inputName in alreadyWrittenResponses) {
      this.value = alreadyWrittenResponses[inputName];
    }
  });

}

//showStellaForm(stella.forms[0]);












//A comment to hold the line.
