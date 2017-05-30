// ### VARS ###
var hostName = "com.hemperium.vid2mp3";
var nativePort = null;
var port = null;
var tab_info = [];

chrome.runtime.onConnect.addListener(function(_port) {
  port = _port;
  console.assert(port.name == "pop_to_back");
  port.onMessage.addListener(function(msg) {


    if (msg.action=='download') {
      //status = "starting_download";
      sendNativeMessage(msg);
    }

    if (msg.action=='get_status') {
      if (tab_info[msg.tab_id].check==true) {
        tab_info[msg.tab_id].status = "is_searching";
      }
    }

    sendMessage(tab_info[msg.tab_id]);

  });
  port.onDisconnect.addListener(function() {
    port = null;
  })
});


function sendNativeMessage(msg) {
  connect();
  nativePort.postMessage(msg);
}

function onNativeMessage(msg) {

  if (msg.action=="get_info" && msg.title!="none") {
    chrome.browserAction.setBadgeText({text: "1"});
    chrome.browserAction.setBadgeBackgroundColor({color: "red"});
  }

  tab_info[msg.tab_id] = msg;
  tab_info[msg.tab_id].check = false;

  sendMessage(tab_info[msg.tab_id]);

}

function onDisconnected() {
  nativePort = null;
}

function connect() {
  nativePort = chrome.runtime.connectNative(hostName);
  nativePort.onMessage.addListener(onNativeMessage);
  nativePort.onDisconnect.addListener(onDisconnected);
}


function sendMessage(msg) {
  if (port!=null) {
    port.postMessage(msg);
  }
}

function handle_on_url() {
  chrome.browserAction.setBadgeText({text: ""});
  chrome.tabs.getSelected(null, function(tab) {

    if (!tab_info[tab.id] || (tab_info[tab.id].url != tab.url)) {

      tab_info[tab.id] = {
        url: tab.url,
        title: "none",
        check: true
      }

      sendNativeMessage({
        action: 'get_info',
        url: tab.url,
        tab_id: tab.id
      });

    } else if (tab_info[tab.id].dl_status=="done") {
      chrome.browserAction.setBadgeText({text: "ok"});
      chrome.browserAction.setBadgeBackgroundColor({color: "green"});
    } else if (tab_info[tab.id].status=="is_valid_url") {
      chrome.browserAction.setBadgeText({text: "1"});
      chrome.browserAction.setBadgeBackgroundColor({color: "red"});
    }

  });
}

chrome.tabs.onSelectionChanged.addListener(handle_on_url);
chrome.tabs.onUpdated.addListener(handle_on_url);
chrome.tabs.onRemoved.addListener();

document.addEventListener('DOMContentLoaded', function () {
  handle_on_url();
});
