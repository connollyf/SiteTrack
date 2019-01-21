"use strict";

$(document).ready(function() {
  $('.settingsLink').click(() => {
    browser.runtime.openOptionsPage();
  });


  let empty = true;
  browser.storage.local.get('sites').then(storage => {
    let siteList = $(".siteList");
    for (var site in storage.sites) {
      let openDiv = '<div class="siteContainer">';
      let closeDiv = '</div>';
      let siteName = '<p class="siteName">' + site + '</p>';
      let numVisits= '<p class="numVisits">' + storage.sites[site].visits + ' visits</p>';
      let avgVisits = storage.sites[site].daysVisited === 0 ? 0 : storage.sites[site].visits / storage.sites[site].daysVisited;
      let avgVisitsP = '<p class="avgVisits">' + avgVisits.toFixed(2) + ' visits per day</p>';

      siteList.append(openDiv + siteName + numVisits + avgVisitsP + closeDiv);


      empty = false;
    }
    if (empty) {
      let emptyItem = '<div class="emptyMessageContainer"><p class="emptyMessage">You\'re not tracking any sites. Go to settings to start tracking one now!</p></div>'
      siteList.append(emptyItem);
    }
  });
});
