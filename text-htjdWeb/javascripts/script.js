(function() {
  'use strict';

  var path = 'myJSON.json';
  var xhr = null;

  if (window.XMLHttpRequest) {
    // 非IE内核
    xhr = new XMLHttpRequest();
  }
  //  else if (window.ActiveXObject) {
  //   // IE内核
  //   xhr = new ActiveXObject('Microsoft.XMLHTTP');
  // } else {
  //   xhr = null;
  // }

  xhr.open('get', path, true);
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var jsonData = JSON.parse(xhr.responseText);
      }
    }
  };


})();
