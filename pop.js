var getStyleRex = /( style=['"].*?['"])/g;
var getClassRex = /( class=['"].*?['"])/g;
var getEmptyDivRex = /(<div><.div>)/g;
var getSpanRex = /(<.?span.*?>)/g;
var avisRex = /javascript:avis_gb\('(\d+)', '(\d+)', '(\d+)', '(\d+)'\);/;

function init() {
  var radioID = localStorage['radio_id'];
  if (radioID == null) radioID = 1;
  setRadioClass(radioID);

  fetch(new Request("http://www.lagrosseradio.com/playerLGR/ajax_player.php?id_radio=" + radioID))
  .then(function(response) {
    response.text()
    .then(function (text) {
      var content = text.split('||separe_partie||')[0];
      content = content.replace(getStyleRex, "").replace(getClassRex, "").replace(getEmptyDivRex, "").replace(getSpanRex, "");
      document.getElementById("content").innerHTML = content;

      //redesign after LGR design move
      document.getElementById('content').getElementsByTagName('a')[0].style.float = 'left';
      divs = document.getElementById('content').getElementsByTagName('div');
      for (i = 0; i < divs.length ; i++) {
          divs[i].style.marginLeft = '140px';
          divs[i].style.marginBottom = '8px';
          var as = divs[i].getElementsByTagName('a');
          for (j = 0; j < as.length ; j++) {
            var avisMatch = avisRex.exec(as[j].href);
            if (avisMatch != null) {
              as[j].removeAttribute('href');
              as[j].addEventListener('click',
                function(bandID, titleID, vote, radioID) {
                  return function() {
                    avis_gb(bandID, titleID, vote, radioID);
                  };
                }(avisMatch[1], avisMatch[2], avisMatch[3], avisMatch[4]));
            }
          }
      }

      /*Share mgmt*/
      var as = divs[divs.length - 1].getElementsByTagName('a');
      if (as.length > 0) {
        var oldHref = as[0].href;
        var end = "', 'facebook', 'menubar=no, resizable=no, status=no, width=500, height=300, scrollbars=auto');void(0);";
        var start = "javascript:window.open('";

        divs[divs.length - 1].getElementsByTagName('a')[0].href = oldHref.substring(start.length, oldHref.length - end.length);

        for (j = 0; j < as.length ; j++) {
          as[j].addEventListener('click',
            function() {
              chrome.tabs.create({url: this.href});
              return false;
          }
          );
        }
      }

      /*styles...*/
      divs[0].id = "artiste";

      divs[1].id = "titre";

      if (divs.length > 2) {
        divs[2].id = 'infos';
        if (divs[3].getElementsByTagName('a').length > 0) {
          divs[3].id = 'votes';
      }else {
      divs[3].id = 'voted';
      }
        divs[4].id = 'shares';
      }
    });
  });
}

function setRadio(radioID) {
  radioID = radioID.target.rel;
  localStorage['radio_id'] = radioID;
  init();
  return false;
}

function setRadioClass(radioID) {
  document.getElementById("radio_1").className="";
  document.getElementById("radio_2").className="";
  document.getElementById("radio_3").className="";
  document.getElementById("radio_"+radioID).className="selectedRadio";
}

function avis_gb(bandID, titleID, vote, radioID) {
  fetch(
    new Request("http://www.lagrosseradio.com/playerLGR/ajax_player.php?id_radio="+radioID+"&gb_artiste="+bandID+"&gb_titre="+titleID+"&val_gb="+vote+"&gb_radio="+radioID),
    {method: "POST"}
    ).then(init);
}

window.addEventListener("load", function () {
  init();
  var lis = document.getElementsByTagName('li');
  for (i = 0; i<lis.length;i++) {
    lis[i].firstChild.addEventListener('click', setRadio, i + 1 );
}});
