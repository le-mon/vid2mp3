var port = chrome.runtime.connect({name: "pop_to_back"});
var is_downloading = false;

function fancyTimeFormat(time) {
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = time % 60;

  var ret = "";
  if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + Math.round(secs);

  return ret;
}

function sendMsg(msg){
  port.postMessage(msg);
}

port.onMessage.addListener(function(msg) {

  if (msg.status=="is_valid_url") {
    enableDL(msg);
  }

  appendStatus(msg.status);

  if (msg.action=='download') {

    appendProgress(msg.dl_status);

    if ($('#panel_progress').is(':hidden')) {
      $("#panel_progress").slideDown("slow");
    }

    if (msg.dl_status=="downloading") {
      appendPfeil();
      if (msg.dl_progress) {
        div_width = (250/100)*msg.dl_progress;
        document.getElementById('progress').setAttribute("style","width:"+div_width+"px");
      }
    }

    if (msg.dl_status=="converting") {
      appendPfeil();
      document.getElementById('progress').setAttribute("style","width:250px !important");
      document.getElementById('progress').setAttribute("style","background-color:#fcff00");
    }

    if (msg.dl_status=="done") {
      document.getElementById('progress').setAttribute("style","width:250px !important");
      document.getElementById('progress').setAttribute("style","background-color:#009b00");
      document.getElementById('download-button').src = "haken.gif";
      chrome.browserAction.setBadgeText({text: "ok"});
      chrome.browserAction.setBadgeBackgroundColor({color: "green"});
    }

  }

});

function enableDL(msg) {
  const hosturl = new URL(msg.url);
  adresse = hosturl.hostname.replace("www.", "");
  time = fancyTimeFormat(msg.duration);

  document.getElementById('title').innerHTML = "<b>" + msg.title + "</b>";
  document.getElementById('hostname').innerHTML = adresse;
  document.getElementById('duration').innerHTML = time;
  document.getElementById('thumb').style.backgroundImage = ("url('"+msg.thumb+"')");

  $("#panel_info").slideDown("slow");
  $("#panel_control").slideDown("slow");

  document.getElementById('panel_control').addEventListener('click',
    function(url){
      return function(){startDL(msg)};
    }(msg.url),false);
}

function startDL(msg) {
  if (!(msg.action=="download" || is_downloading==true)) {
    is_downloading = true;
    $("#panel_progress").slideDown("slow");
    msg.action = "download";
    sendMsg(msg);
    appendProgress("starting download ...");
    document.getElementById('progress').setAttribute("style","width:1px !important");
    document.getElementById('download-button').src = "pfeil.gif";
  }
}

function appendProgress(text) {
  document.getElementById('dlstatus').innerHTML = "" +text+ "";
}

function appendPfeil() {
  if (document.getElementById('download-button').src != "pfeil.gif") {
    document.getElementById('download-button').src = "pfeil.gif";
  };
}

function appendStatus(status) {
  switch (status) {
    case "is_valid_url":
      text = "Heute im Angebot:";
      break;
    case "is_none":
      text = "nix gefunden";
      break;
    case "is_searching":
      text = "Wir suchen kurz...";
      break;
    case "is_playlist":
      text = "Playlists/Sets gehen nicht.<br />F&uuml;r ne Kiste Bier mach ichs aber!<br /><br />";
      break;
    default:
      text = status;
  }
  document.getElementById('status').innerHTML = "" +text+ "";
}

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
  sendMsg({action:"get_status", tab_id:tabs[0].id});
});
