"use strict";

function initStorage() {
  browser.storage.local.get().then(storage => {
    if(typeof storage.sites === "undefined") {
      storage.sites = {};
      browser.storage.local.set(storage);
    }
  });
}

function removeSubDomainIfPresent(sites, hostname) {
  for (var site in sites) {
    if (hostname.includes(site)) {
      return site;
    }
  }
  return hostname;
}

function updateSiteCount(details) {
  if (details.frameId !== 0) {
    return;
  }
  let hostname = (new URL(details.url)).hostname;
  browser.storage.local.get('sites').then(results => {
    hostname = removeSubDomainIfPresent(results.sites, hostname);
    if (typeof results.sites[hostname] === 'undefined') {
      return;
    }
    results.sites[hostname].visits++;

    let today = new Date();
    if (typeof results.sites[hostname].lastVisit === "undefined") {
      results.sites[hostname].lastVisit = today;
      results.sites[hostname].daysVisited = 1;
    }
    if (results.sites[hostname].lastVisit.getUTCDate() !== today.getUTCDate()
    || results.sites[hostname].lastVisit.getMonth() !== today.getMonth()) {
        results.sites[hostname].daysVisited = results.sites[hostname].daysVisited || 0;
        results.sites[hostname].daysVisited++;
    }
    results.sites[hostname].lastVisit = today;
    browser.storage.local.set(results);
  });
}

function updateTracking() {
  browser.webNavigation.onCommitted.removeListener(updateSiteCount);
  browser.storage.local.get('sites').then(storage => {
    let filters = [];
    for(var site in storage.sites) {
      let thisFilter = {hostContains: '.' + site};
      filters.push(thisFilter);
    }
    browser.webNavigation.onCommitted.addListener(updateSiteCount, {url: filters});
  });

}

initStorage();
updateTracking();
