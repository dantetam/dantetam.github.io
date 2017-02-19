var stella.forms = [];

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
  }
  desc: "Log a task with Stella's productivity forms.",
  execute: function(response) {
    var keys = Object.keys(response);
    for (var i = 0; i < keys.length; i++) {
      if (response[keys[i]] === undefined || response[keys[i]].trim() === "") {
        if (keys[i] in this.defaults) {
          var default = this.defaults[keys[i]];
          if (typeof default === "function") {
            default = default();
          }
          response[keys[i]] = default;
        }
        else {
          response[keys[i]] = "";
        }
      }
    }
    console.log(response);
  }
});

function showStellaForm(form) {
  var stellaForm = d3.select("#stella-form");
  stellaForm.html()
}












//A comment to hold the line.
