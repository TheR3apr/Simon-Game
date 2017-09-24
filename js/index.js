var app = app || {
  onOrOff: false,
  initializeVars: function(){
    this.tempo = 1300;
    this.count = 0;
    this.numOfTurns = 0,
    this.strict = false,
    this.resp = false,
    this.intervalLength = 7,
    this.audio = undefined,
    this.currentTimeoutId = undefined,
    this.curCombo = [];
  },
  onOrOffClick: function(){
    app.onOrOff = !app.onOrOff;
    if(app.onOrOff){
      $('h2').html('----');
      $('#b3').removeClass('off').addClass('on');
      $('.dbt').removeClass('no');
    }
    else {
      clearTimeout(app.currentTimeoutId);
      $('h2').html(' ');
      $('#b3').removeClass('on').addClass('off');
      $('#led').removeClass('on2').addClass('off2');
      $('.dbt').addClass('no');
      $('.dbt').removeClass('active');
    }
    app.initializeVars();
  },
  display: {
    animate: function(counter){
      var target, audio;
      $('#t'+app.curCombo[counter]).addClass('active');
      audio = document.getElementById('audio'+app.curCombo[counter]);
      audio.play();
      if(counter < app.curCombo.length){
        setTimeout(function(){
          target = document.getElementById('t'+app.curCombo[counter]);
          target.className="dbt"; 
          counter++;
          app.gameEngine.animate(counter);
        }, app.tempo);
      }
      app.resp = true;
      app.gameEngine.startInterval();
    },
    mistake: function(){
      app.count = 0;
      document.getElementById('mistake').play();
      $('h2').html('!!!!');
      if (app.strict){ 
        app.initializeVars();
        app.gameEngine.newMove();
      }
      setTimeout(function(){
        app.gameEngine.move();
        app.gameEngine.startInterval();
      }, app.tempo*2);
    },
    victory: function(){
      document.getElementById('victory').play();
      $('h2').text('WON!');
      $('.dbt').addClass('active');
      setTimeout(function(){
        document.getElementsByClassName('dbt').className = 'dbt';
      }, 5000);
      app.initializeVars();
      app.gameEngine.move();
    }
  },
  gameEngine: {
    randomNum: function(){
      return Math.floor(Math.random() * (4));
    },
    startInterval: function(){
        clearTimeout(app.currentTimeoutId);
        app.currentTimeoutId = setTimeout(function(){
          app.display.mistake();
        }, app.intervalLength*1000);
    },
    newMove: function(){
      if (app.curCombo.length === 20){
        app.display.victory();
      }
      app.count = 0;
      var cur = app.gameEngine.randomNum();
      app.curCombo.push(cur);
      app.numOfTurns++;
      app.gameEngine.move();
    },
    move: function(){
      var str = '';
      if (app.numOfTurns < 10) str = '0';
      $('h2').text(str+app.numOfTurns);
      app.gameEngine.setValues();
      app.display.animate(0);
      app.gameEngine.startInterval();
    },
    setValues: function(){
      if (app.curCombo.length >= 13){ 
        app.intervalLength = 4;
        app.tempo = 600;
      }
      else if(app.curCombo.length >= 9){ 
        app.intervalLength = 5;
        app.tempo = 800;
      }
      else if(app.curCombo.length >= 5){ 
        app.intervalLength = 6;
        app.tempo = 1000;
      }
      else{ 
        app.intervalLength = 7;
        app.tempo = 1200;
      }
    },
    colorButton: function(event){
      var audio, str = '';
      app.gameEngine.startInterval();
      if (app.resp){
        str = event.target.id.slice(1);
        audio = document.getElementById('audio'+str);
        audio.play();
        if (parseInt(str) === app.curCombo[app.count]){
          app.count++;
          if (app.count === app.curCombo.length) 
            setTimeout(function(){
              app.resp = false;
              app.gameEngine.newMove();
            }, app.tempo*2);
        }
        else {
          app.display.mistake();
        }
      }
    },
  },
};
$(document).ready(function(){
  $('#b3').on('click', function(){
    app.onOrOffClick();
  });
  $('#strict').on('click', function(){
    if(app.onOrOff){ 
      app.strict = !app.strict;
      if(app.strict) $('#led').removeClass('off2').addClass('on2');
      else $('#led').removeClass('on2').addClass('off2');
    }
  });
  $('#start').on('click', function(){
    debugger;
    if(app.onOrOff) {
      $('h2').text('00');
      app.initializeVars();
      app.gameEngine.newMove();
    }
  });
  $('.dbt').on('click', function(event){
    app.gameEngine.colorButton(event)
  });
})