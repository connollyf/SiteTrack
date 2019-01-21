"use strict";

function deleteItem(event) {
  let listItem = $(event.target).parent();
  let siteName = listItem.html();
  siteName = siteName.substring(0, siteName.length - 36);
  listItem.remove();
  browser.storage.local.get('sites').then(storage => {
    delete storage.sites[siteName];
    browser.storage.local.set(storage);
  });
}

function restoreSettings() {
  return browser.storage.local.get().then(results => {
    let empty = true;
    for (var site in results.sites) {
      empty = false;
      let listEntry = '<li>' + site + '<a href="#" class="deleteLink">X</a></li>';
      $(".siteList").append(listEntry);
    }
    if (empty) {
      let emptyEntry = '<li id="emptyEntry"> No Tracked Sites added yet. Add one now above!</li>';
      $(".siteList").append(emptyEntry);
    }
  });
}




$(document).ready(function() {
  restoreSettings().then(() => {
    $(".deleteLink").click(deleteItem);
  });

  $('#addSiteBtn').click(function(){
    let siteInput = $("#siteInput");
    let site = siteInput.val();
    if (site.length > 0) {
      $('#emptyEntry').remove();
      siteInput.val("");

      browser.storage.local.get('sites').then(storage => {
        if (typeof storage.sites[site] === 'undefined') {
          var listEntry = '<li>' + site + '<a href="#" class="deleteLink">X</a></li>';
          $(".siteList").append(listEntry);

          storage.sites[site] = {};
          storage.sites[site].visits = 0;
          storage.sites[site].daysVisited = 0;
          return browser.storage.local.set(storage);
        }
      }).then(() => {
        let page = browser.extension.getBackgroundPage();
        page.updateTracking();
      });
    }
  });

  $("#siteInput").keypress(function(event){
    if(event.key == "Enter") {
      $("#addSiteBtn").click();
    }
  });
});
