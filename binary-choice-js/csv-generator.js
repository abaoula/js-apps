var csvGenerator = (function() {
  function exportCSV(fileName, data, columns) {
    var headerText = generateCSVHeader(columns);
      var bodyText = generateCSVBodyFromObjectArray(data);
      var csvText = headerText + bodyText;
      downloadCSV(fileName, csvText);
  }
  function generateCSVHeader(columns) {
    columns  = (typeof columns === 'undefined') ? [] : columns;
      var columnText = '';
        for (var i = 0; i < columns.length; i++) {
          if(columnText == '') columnText +=  columns[i];
          else columnText += ", "+ columns[i];
        }
        return columnText+ '\n';
  };
  function generateCSVBodyFromObjectArray(rows) {
      var csvText = '';
        for (var i = 0; i < rows.length; i++) {
          csvText += processObject(rows[i]);
        }
        return csvText;
  };
  function downloadCSV(fileName, csvText) {
        var currentTime = new Date();
        fileName =    fileName + "*.csv";

     var blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
          if (navigator.msSaveBlob) { // IE 10+
              navigator.msSaveBlob(blob, fileName);
          } else {
              var link = document.createElement("a");
              if (link.download !== undefined) { // feature detection
                  // Browsers that support HTML5 download attribute
                  var url = URL.createObjectURL(blob);
                  link.setAttribute("href", url);
                  link.setAttribute("download", fileName);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
              }
          }
  };
  function processObject(object) {
      var finalVal = '';
      for(var prop in object) {
          if(!object.hasOwnProperty(prop)) continue;
          var propertyValue = processPropertyValue(object[prop]);
          finalVal = addPropertyValueToFinalValue(finalVal, propertyValue);
      }
      return finalVal + '\n';
  };
  function processPropertyValue(propertyValue) {
      var propertyValue = propertyValue === null ? '' : propertyValue.toString();
      if (propertyValue.search(/(:|"|,|\n)/g) >= 0)  propertyValue = '"' + propertyValue + '"';
      return propertyValue;
  }
  function addPropertyValueToFinalValue(finalVal, propertyValue) {
      if (finalVal != '') finalVal += ',';
      finalVal += propertyValue;
      return finalVal;
  }
  return {
    exportCSV:exportCSV
  };
})();