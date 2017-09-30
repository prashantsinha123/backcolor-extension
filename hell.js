
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {   //query() is an asynchronous so callback is needed to hold it.
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

function changeBackgroundColor(color) {
  var script = 'document.body.style.backgroundColor="' + color + '";';
  chrome.tabs.executeScript({   //it is used to inject javascript into the code
    code: script
  });
}

function getSavedBackgroundColor(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);   //for checking any error in the stored data at runtime
  });
}

function saveBackgroundColor(url, color) {
  var items = {};
  items[url] = color;
  chrome.storage.sync.set(items);
}
document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var dropdown = document.getElementById('dropdown');
	
    //This method is not so compulsory we can modify it as per the demand.
    getSavedBackgroundColor(url, (savedColor) => {
      if (savedColor) {
        changeBackgroundColor(savedColor);
        dropdown.value = savedColor;
      }
    });

    dropdown.addEventListener('change', () => {
	
      changeBackgroundColor(dropdown.value);  //changes the current selected color
      saveBackgroundColor(url, dropdown.value);

    });

  });
});

