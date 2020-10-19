const moment = require("moment");

// Returns the dates in between @startDate and @endDate (inclusive)
function getDates(startDate, stopDate) {
  var dateArray = [];
  var currentDate = moment(startDate, "DD-MM-YYYY");
  var stopDate = moment(stopDate, "DD-MM-YYYY");
  while (currentDate <= stopDate) {
      dateArray.push( currentDate.format('YYYY-MM-DD') )
      currentDate = currentDate.add(1, 'days');
  }
  return dateArray;
}
arr = getDates("12/12/2020", "14/12/2020")
console.log()
for (var i = 0; i < arr.length; i++) {
  console.log(arr[i])
}