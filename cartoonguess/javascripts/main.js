/*--------------------------------------------------------------
 Settings
---------------------------------------------------------------*/
var start_time = 60; //amount of time on the start clock
var correct_plus = 5; //amount of time added to timer on correct answer
var wrong_plus = 0; //amount of time added on wrong answer
var total_possible_matches = 56; 
var start_countdown_length = 3; //length of start countdown
// Position of start countdown/matches left number block;
var two_digit_pos = '0em'; 
var one_digit_pos = '0em'; 
var time_left_bonus = 5;
var default_font_size = 10; 

/*--------------------------------------------------------------
 End Settings
---------------------------------------------------------------*/  
/*--------------------------------------------------------------
Audio Settings
---------------------------------------------------------------*/
//Used to check for audio support
var audioObjSupport = false; 
var basicAudioSupport = false; 
var canPlayOgg = false;
var canPlayMp3 = false;
//End Used to check audio support

//-------Sounds------------
//Each Array loads sounds found in a 
//specific sound folder on the server side.
//sounds are loaded using ajax.
//Arrays are named sound_[folder where sounds are found]
var sounds_scoreTab = Array();
sounds_scoreTab['Thud'] = null;

var sounds_wrong = Array();
sounds_wrong['Arcade Action 04'] = null;
sounds_wrong['Breath 02'] = null;
sounds_wrong['Doooh Reaction Male'] = null;
sounds_wrong['ehh'] = null;
sounds_wrong['Grunts Male'] = null;
sounds_wrong['Lightbulb Break 02'] = null;
sounds_wrong['no'] = null;
sounds_wrong['Ooooh Reaction Male 02'] = null;
sounds_wrong['Screams Male 01'] = null;
sounds_wrong['Sword Whip 04'] = null;
sounds_wrong['Whip 01'] = null;
sounds_wrong['Wild Laughs Male 02'] = null;
sounds_wrong['Window Break 01'] = null;

var sounds_correct = Array();
sounds_correct['Bell 01'] = null;
sounds_correct['bong'] = null;
sounds_correct['excelent'] = null;
sounds_correct['Laser Gun'] = null;
sounds_correct['sisi'] = null;
sounds_correct['toasty'] = null;
sounds_correct['uhhuh-yeah'] = null;
sounds_correct['whistle'] = null;
sounds_correct['whoo'] = null;
sounds_correct['yeahthatright'] = null;
sounds_correct['yeeup'] = null;
sounds_correct['yougotit'] = null;

var sounds_finalResult = Array();
sounds_finalResult['bigwin'] = null;
sounds_finalResult['fail'] = null;
sounds_finalResult['ok'] = null;
sounds_finalResult['win'] = null;
/*--------------------------------------------------------------
End Audio Settings
---------------------------------------------------------------*/
/*--------------------------------------------------------------
Final Result Settings
---------------------------------------------------------------*/
var finalResult = Array(); //Array to hold final reslut sounds and strings
finalResult.push({mscore: 1, text: 'Herp-derp, anime is for kids, losers, and neckbeards', audio : 'fail'});   
finalResult.push({mscore: 5, text: 'Narutard newfag', audio : 'fail'});
finalResult.push({mscore: 11, text: 'Used to like anime, but grew out of it', audio : 'fail'});
finalResult.push({mscore: 21, text: 'You should probably go try again', audio : 'ok'});
finalResult.push({mscore: 31, text: 'Unimpressive, but not too bad either', audio : 'ok'});
finalResult.push({mscore: 41, text: 'Not bad… really not bad', audio : 'win'});
finalResult.push({mscore: 51, text: 'Certified anime hipster', audio : 'win'});
finalResult.push({mscore: 56, text: 'Your waifu would be proud, but your wife (if existing) would be deeply ashamed', audio : 'bigwin'});
finalResult.push({mscore: 61, text: 'You are good enough to work in the industry', audio : 'bigwin'});
finalResult.push({mscore: 62, text: '3DPD, you should have been born in anime Japan', audio : 'bigwin'});    
/*--------------------------------------------------------------
End Final Result Settings
---------------------------------------------------------------*/
//Globals
var score = 0; 
var gameStarted = false; 
var count_down = start_time;
var popupStatus = 0;  //whether white box is visible or not
var timeoutID = null;
var thumb_imgs = Array();  //populate during doLoad
var main_imgs = Array();  //populate during doLoad
var unused_imgs = {};  //all images that haven't had a match attempt yet
var correct_guesses = {};  //id of thumbs that were guessed correctly
var matches_attempted = 0;   //Lets us know if we have gone through all the images yet
var currentImg = null;   //The current main img id that is being attempted
var current_font_size = default_font_size; 
//End Globals

/*--------------------------------------------------------------
Function to check for audio support
---------------------------------------------------------------*/
doCheckAudioSupport = function() { 
	// disabling audio because it's annoying
	audioObjSupport = false;
	basicAudioSupport = false;
	return;

  // Checking for the audio object
  try {
      // The 'src' parameter is mandatory in Opera 10, so have used an empty string "",
      // otherwise an exception is thrown.
 
      var myAudioObj = new Audio("");
 
      audioObjSupport = !!(myAudioObj.canPlayType);
      basicAudioSupport = !!(!audioObjSupport ? myAudioObj.play : false);
        // Need to check the canPlayType first or an exception will be thrown for those browsers that don't support it
        //windows only supports mp3 firefox only ogg
      if (myAudioObj.canPlayType) {
        // Currently canPlayType(type) returns: "no", "maybe" or "probably"
        canPlayOgg = ("no" != myAudioObj.canPlayType("audio/ogg")) && ("" != myAudioObj.canPlayType("audio/ogg"));
        canPlayMp3 = ("no" != myAudioObj.canPlayType("audio/mpeg")) && ("" != myAudioObj.canPlayType("audio/mpeg"));
      }
  } catch (e) {
      audioObjSupport = false;
      basicAudioSupport = false;
  }
}

/*-------------------------------------------------------------------
Function called at the beginning of each new game
-------------------------------------------------------------------*/
startGame = function() {
  //reset everything in case "try again"
  score = 0;
  $('#score').html(score);
  $('#score').show();
  $('#timer').show();
  $('#score-anim').hide();
  $('score-anim').css('left', '-100px');   
  //Reset unused imgs array
  for (i=1; i<57; i++) {
    unused_imgs[i.toString()] = true; 
  }
  correct_guesses = {};
  matches_attempted = 1; //first match has abeen shown
  setTimer(start_time);
  var start = $('#start');
  start.css ({'-webkit-box-shadow' : '2px 2px 1px #888;',
              '-moz-box-shadow': '2px 2px 1px #888;',
              'box-shadow' : '2px 2px 1px #888;'}); 
  $("#backgroundPopup").fadeOut("slow");
  $("#start-container").fadeOut("slow");
  popupStatus = 0; //popup has been hidden

  buildThumbsGrid();
  var start_countdown = start_countdown_length;  
  var mm2 = $('#mm2');
  $('#mm2-c').html(start_countdown); 
  // bring in the block behind the main image
  mm2.animate({
    opacity: 'show',
    right: one_digit_pos,
  }, 500, function() {
    //When Animation complete 
    // do countdown to start
    doStartCountdown = function() {
      if (start_countdown > 0) {
        playSound(sounds_scoreTab['Thud']);
        start_countdown -= 1; 
        $('#mm2-c').empty();        
        $('#mm2-c').html(start_countdown);
        setTimeout(doStartCountdown, 1000);
      }
      else {
        gameStarted = true; 
        $('#mm2-c').empty();
        mm2.css('right', two_digit_pos); //position for two digit numbers (1 digit = +55%)
        $('#mm2-c').html(total_possible_matches-1);
        doStartNewMatch(false); // false because we built the first grid above
        if (timeoutID) {
          clearTimeout(timeoutID); //just in case timer is still counting
          setTimer(start_time); 
        }
        doCountDown();  //start the game timer
      }
    }
    playSound(sounds_scoreTab['Thud']); //Play first "thud"
    setTimeout(doStartCountdown, 1000); 
  }); 
}

/*-------------------------------------------------------------------
Function called at the end of each game
-------------------------------------------------------------------*/
endGame = function() {
  //Stop the game timer
  if (timeoutID) {
    clearTimeout(timeoutID); 
  } 
  gameStarted = false;
  //Hide the last match image. 
  $('#mm1').hide();
  $('#mm3').hide();
  //Do score count up.
  var score_countup = 1;
  var mm2 = $('#mm2');
  mm2.hide(); 
  if (score < 10) {
    mm2.css('right', one_digit_pos); 
  }
  else {
    mm2.css('right', two_digit_pos); 
  }
  $('#mm2-c').html(score_countup);
  
  var mm2_pos = mm2.position(); 
  var jscore = $('#score'); 
  jscore.hide();
  $('#timer').hide();
  
  showTryAgain = function() {
    //Find the correct score text and audio to show in the results
    for (i=0; i < finalResult.length; i++) {
      r = finalResult[i];
      if (score > r.mscore) {
        continue; 
      }
      else {
        $('#final-score').html(r.text);
        playSound(sounds_finalResult[r.audio]);
        break; 
      }
    } 
    //Show try Again and Social media links
    if(popupStatus==0){
      $('#instructions').hide(); 
      $('#share-score').show();
      $('#start').hide();
      $('#start').html('TRY AGAIN'); 
      //request data for centering  
      var windowWidth = document.documentElement.clientWidth;
      var windowHeight = document.documentElement.clientHeight;  
      var popupHeight = $('#start-container').height();  
      var popupWidth = $('#start-container').width();  
      //centering  
      $('#start-container').css({  
        'position': 'absolute',  
        'top': windowHeight/2-popupHeight/2,  
        //'left': windowWidth/2-popupWidth/2  
      });      
      $('#backgroundPopup').css({  
        'opacity': '0.7'  
      });  
      $('#backgroundPopup').fadeIn('slow');  
      $('#start-container').fadeIn('slow');
      //$('#start').show(); 
      popupStatus = 1;  
    }
  }   
  showTryAgain();
  
  var end_score = Array(); 
  var i;
  i = 0; 
  end_score.push({txt: 'Game Over!', val: null});
  
  var time_bonus = 0; 
  if (count_down > 0) {time_bonus = time_left_bonus; }
  end_score.push({txt: 'Time Bonus:', val: time_bonus});

  var total_score = score+time_bonus;
  end_score.push({txt: 'Your Score:', val: total_score});
    
  var score_anim = $('#score-anim');  
  var sa_ow = 0; //score animation outer width
  var left = 0;
  doEndScore = function() {
    score_anim.animate({
      opacity: 'hide',
      left: '+90%',
    }, 300, function() {
      // Animation complete
      $('#score-anim-txt').empty();
      $('#score-anim-txt').html(end_score[i].txt);
      $('#score-anim-val').empty();
      if (end_score[i] != null) {
        $('#score-anim-val').html(end_score[i].val);
      }
      left = 20*current_font_size; 
      score_anim.css('left', '-20em');
      score_anim.animate({
        opacity: 'show',
        left: left+'px',
      }, 300, function() {
        // Animation complete.
        playSound(sounds_scoreTab['Thud']);
        if (i < end_score.length-1) {
          i += 1; 
          setTimeout(doEndScore, 1000);
        }
        else{
          $('#start').show();
        }
      });
    });
  }
  doEndScore();
}

/*-------------------------------------------------------------------
Function to load all of the images and sound effects
-------------------------------------------------------------------*/
doLoad = function() {
  //Setup and show load status
  var loading_container = $('#loading-container'); 
  loading_container.bind('game-loaded', function() {
    if(popupStatus==1){  
      $('#start').click(startGame);
      $("#loading-container").fadeOut("slow", function() {
            $("#start").fadeIn("slow"); 
      }); 
      popupStatus = 0;  
    }  
  }); 

  if(popupStatus==0){
    //request data for centering  
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;  
    var popupHeight = $('#start-container').height();  
    var popupWidth = $('#start-container').width();  
    //centering  
    $('#start-container').css({  
      'position': 'absolute',  
      'top': windowHeight/2-popupHeight/2,  
      //'left': windowWidth/2-popupWidth/2  
    });      
    $('#backgroundPopup').css({  
      'opacity': '0.7'  
    });  
    $('#backgroundPopup').fadeIn('slow');  
    $('#start-container').fadeIn('slow');
    $('#loading-container').show(); 
    popupStatus = 1;  
  }    
  
  //setup and load images (thumbs and main)
  //Not true % rather a indicator of the count of files loaded
  var pb_left = $('#pb-left'); //red part of loading inidicator
  var pb_right = $('#pb-right'); //% part of loading indicator
  var img = null;
  var p = 0;  //%loaded
  var ploaded = 0; //count of loaded files
  var total_files = PIC_COUNT*2;
  
  //path: path on server to folder containing image files
  //imgs: an array holding image names. Replaced with actual images
  loadImgs = function(path, imgs){  
    for (i=1; i<=PIC_COUNT; i++) {
      img = $(new Image());
      imgs.push(img);  
      img.load(function () {
        ploaded += 1; 
        p = Math.floor((ploaded/total_files)*100); 
        pb_left.css('width' , p+'%');
        pb_right.html(p+'%');
        if (ploaded+1 == total_files) {loading_container.trigger('game-loaded');} 
      }); 
      img.attr('src', path+i+'.png');
    }  
  }
  
  loadImgs('animethumbs/', thumb_imgs);
  loadImgs('animeImages/', main_imgs);

  //Load the audio
  if (audioObjSupport) { 
    var file_end = ".mp3";  //assume support for mp3
    if (canPlayOgg) {file_end = ".ogg";} //but use ogg if available
    //path: path to folder on server containing sounds
    //sounds: an array of sound file names (no extension). replaced with sound objects
    loadAudio = function(path, sounds) {
      for (sound in sounds) {
        s = new Audio("");
        sounds[sound] = s;
        s.src = path+sound+file_end;  //sound file+".mp3" or ".ogg"
        s.load();
        $(s).bind('canplaythrough', function() {
          ploaded += 1; 
          p = Math.floor((ploaded/total_files)*100);
          pb_left.css('width' , p+'%');
          pb_right.html(p+'%');
          if (ploaded+1 == total_files) {loading_container.trigger('game-loaded');}  
        });
      }
    }
    loadAudio ('gameSounds/scoreTabulation/', sounds_scoreTab);
    
    loadAudio ('gameSounds/wrong/', sounds_wrong);
    //since we choose a wrong sound at random put sounds in an indexed array
    a = Array();
    for (sound in sounds_wrong) {
        a.push(sounds_wrong[sound]);
    }
    sounds_wrong = a;
    
    loadAudio ('gameSounds/correct/', sounds_correct);
    //since we choose a wrong sound at random put sounds in an indexed array
    a = Array();
    for (sound in sounds_correct) {
        a.push(sounds_correct[sound]);
    }
    sounds_correct = a;
    
    loadAudio ('gameSounds/finalResult/', sounds_finalResult);

  }

}

setTimer = function(time) {
  if (time < 0) time=0; 
  count_down = time;
  timer = $('#timer');  
  timer.html(time); 
}

doCountDown = function() {  
  if (count_down > 0) {
    setTimer(count_down-1);    
    timeoutID = setTimeout(doCountDown, 1000); 
  }
  else {
    setTimer(0);
    endGame(); 
  }
}

doStartNewMatch = function(buildGrid) {
  if (matches_attempted == total_possible_matches) {
    endGame();
    score += time_left_bonus;  
    return; 
  }
  var mm2 = $('#mm2');  
  var mm1 = $('#mm1');
  mm1.animate({
    opacity: 'hide',
    left: '+90%',
  }, 500, function() {
    // Animation complete (old match image has been moved off).
    mm1.empty();
    currentImg=Math.floor(Math.random()*55)+1;
    while(!(unused_imgs[currentImg.toString()])) {
      currentImg=Math.floor(Math.random()*55)+1;
    }
    var matches_left = total_possible_matches-matches_attempted;
    if (matches_left < 10) {
      mm2.css('right', one_digit_pos); 
    }
    $('#mm2-c').html(matches_left);
    matches_attempted += 1;
    //mm2.empty();
    
    unused_imgs[currentImg.toString()] = false; 
    mm1.append(main_imgs[currentImg]); 
    mm1.css('left', '0px');
    mm1.animate({
      opacity: 'show',
      left: '+32%',
    }, 500, function() {
      // Animation complete.
      playSound(sounds_scoreTab['Thud']);
      if (buildGrid){
        buildThumbsGrid();
      }
    });
  });
}

playSound = function(sound) {
	return;
  sound.currentTime = 0;
  sound.play();
}

playRandomSound = function(sound_array) {
	return;
  sound = Math.floor(Math.random()*sound_array.length);
  sound = sound_array[sound];
  playSound(sound); 
}

updateScore = function(plus) {
  score += plus; 
  $('#score').html(score);
  $('#score').vibrate(); 
}

buildThumbsGrid = function() {
  var thumbs = Array();
  var thumb = null;  
  thumb=Math.floor(Math.random()*36)+1; 
  var thumbs_grid = $('#thumbs-grid');
  thumbs_grid.empty(); 
  for (i=0; i<7; i++) {    
    var w = $('<div class="thumb-row"></div>'); //create a row
    thumbs_grid.append(w); 
    for (j=1; j<=8; j++) {
      var t = $('<div class="thumb"></div>');  //create a thumb
      thumb=Math.floor(Math.random()*56)+1; 
      while (thumbs.indexOf(thumb) >= 0){
        thumb=Math.floor(Math.random()*56)+1; 
      }
      t.append(thumb_imgs[thumb-1]);
      t.addClass(thumb.toString());
      if (thumb in correct_guesses){
        t.addClass('thumb-correct'); 
      }
      else {
        t.mouseleave({thumbID: thumb}, function(event) {
          var mm3 = $('#mm3')
          mm3.hide(); 
          mm3.empty(); 
        }); 
         
        t.mouseenter({thumbID: thumb}, function(event) {
          var mm3 = $('#mm3'); 
          var thumbID = event.data.thumbID; 
          mm3.empty(); 
          mm3.show();
   
      
  	    	mm3.append(thumb_imgs[thumbID-1].clone());
        });
            
        t.click({thumbID : thumb}, function(event) {
          //Do this on the click of a thumb
          if (!gameStarted) return;
          var thumbID = event.data.thumbID;
          $('.'+thumbID.toString()).css({'-webkit-box-shadow' : '2px 2px 1px #888;',
              '-moz-box-shadow': '2px 2px 1px #888;',
              'box-shadow' : '2px 2px 1px #888;'});

          if (thumbID == currentImg+1) {
            correct_guesses[thumbID] = 'true';
            setTimer(count_down + correct_plus);
            playRandomSound(sounds_correct);
            updateScore(1);
            doStartNewMatch(true);          
          }
          else {
            $('.'+(currentImg+1).toString()).vibrate(); 
            setTimer(count_down+wrong_plus);
            playRandomSound(sounds_wrong);
            $('#timer').vibrate(); 
            doStartNewMatch(true);
          }
        });
      }
      w.append(t);
      thumbs.push(thumb);
    }
    thumbs_grid.append('<div class="thumb-clear"></div>');
  }
}

$(document).ready(function() {
  var wh = $(window).height()-10; 
  current_font_size = wh/70;
  $('body').css('font-size', current_font_size+'px'); 
  $(window).resize(function() {
    wh = $(window).height()-10; 
    current_font_size = wh/70;
    $('body').css('font-size', current_font_size+'px'); 
  });
  doCheckAudioSupport();
  doLoad(); 
 });
