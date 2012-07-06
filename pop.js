  var getStyleRex = /(style=['"].*?['"])/g;
  var getClassRex = /(class=['"].*?['"])/g;
  var getEmptyDivRex = /(<div><.div>)/g;
  var getSpanRex = /(<.?span.*?>)/g;
  function init() {
    var radioID = localStorage['radio_id'];
    if (radioID == null) radioID = 1;
    setRadioClass(radioID);
    var xhr = new XMLHttpRequest();
    xhr.open("GET","http://www.lagrosseradio.com/playerLGR/ajax_player.php?id_radio="+radioID, false);
    xhr.send();
    var content = xhr.responseText.split('||separe_partie||')[0];
    content = content.replace(getStyleRex, "").replace(getClassRex, "").replace(getEmptyDivRex, "").replace(getSpanRex, "");
    document.getElementById("content").innerHTML = content;

    //redesign after LGR design move
    document.getElementsByTagName('img')[0].style.float = 'left';
    divs = document.getElementsByTagName('div');
    console.log(divs.length);
    for (i = 2; i < divs.length - 1 ; i++) {
console.log(i);
        console.log(divs[i].style.textAlign);
        divs[i].style.marginLeft = '140px';
        divs[i].style.marginBottom = '14px';
        console.log(divs[i].style.textAlign);
    }
    /*
    divs[divs.length - 1].style.float = "left";
    divs[divs.length - 1].style.textAlign = "center";
    divs[divs.length - 1].style.width = "450px";
    divs[divs.length - 1].style.marginBottom = "10px";
    */
    divs[divs.length - 1].style.display = 'none';
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
    var result = new XMLHttpRequest();
    result.open("POST","http://www.lagrosseradio.com/playerLGR/ajax_player.php?id_radio=2&gb_artiste="+bandID+"&gb_titre="+titleID+"&val_gb="+vote+"&gb_radio="+radioID, false);
    result.send();
    init();
  }

console.log("ok");
window.addEventListener("load", function () {
  console.log("in event");
  init();
  var lis = document.getElementsByTagName('li');
  for (i = 0; i<lis.length;i++) {
    lis[i].firstChild.addEventListener('click', setRadio, i + 1 );
}});
