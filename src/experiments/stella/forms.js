stella.forms = [];

stella.forms.push({
  fullName: "time",
  displayName: "Time Record Form",
  //names: ["stocks", "symbol", "symbols", "finance"],
  fields: {
    taskCat: "Topic/Class/Issue",
    description: "Description/Notes",
    day: "Date",
    timeStart: "Start Time",
    timeFinish: "Completion Time",
    value: "Value"
  },
  defaults: {
    day: currentDay,
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
  fullName: "finance",
  displayName: "Financial Record Form",
  //names: ["stocks", "symbol", "symbols", "finance"],
  fields: {
    taskCat: "Memo",
    description: "Description/Notes",
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

function submitStellaForm() {
  var stellaForm = d3.select("#stella-form");
  stella.selectAll("input").each(function() {

  });
}

function showStellaForm(form) {
  var stellaForm = d3.select("#stella-form");
  stellaForm.html("<h4>" + form.displayName + "</h4>");
  var keys = Object.keys(form.fields);
  var stringy = "<table>";
  for (var i = 0; i < keys.length; i++) {
    stringy += '<tr><td align="right">' + form.fields[keys[i]] + '</td><td align="left"><input type="text" id="stella-form-input-' + keys[i] + '"></input></td></tr>';
  }
  stringy += "</table>";
  stringy += '<button onclick="javascript:submitStellaForm();" align="left">Submit</button>'
  stellaForm.html(stellaForm.html() + stringy);
  console.log(stellaForm.html());
}

showStellaForm(stella.forms[0]);












//A comment to hold the line.
