// phina.js をグローバル領域に展開
phina.globalize();

var ASSETS = {
  image: {
    startImage: './img/startImage.jpg',
    bgImg: './img/bg_dote.jpg',
    tongUpKarin: './img/tongUpKarin.png',
    tongDownKarin: './img/tongDownKarin.png',
    banana: './img/banana_kawa.png',
    gameOverImage: './img/gameOverImage.jpg'
  }
};
var SCREEN_WIDTH  = 465;
var SCREEN_HEIGHT = 665;
var moveSpeed = 5;
var stopScroll = false;
var notSpawnCount = 0;
var KARIN_START_X = SCREEN_WIDTH / 2 - 50;
var KARIN_START_Y = SCREEN_HEIGHT / 2 + 80;
var score = 0;
var gameOver = false;

phina.define('StartImage', {
  superClass: 'Sprite',
  init: function(){
    this.superInit('startImage', 396, 428);
    this.x = SCREEN_WIDTH / 2;
    this.y = SCREEN_WIDTH / 2 + 100;
  }
});

phina.define('TitleScene', {
  superClass: 'DisplayScene',
  /**
   * @constructor
   */
  init: function(params) {
    this.superInit(params);

    params = ({}).$safe(params, phina.game.TitleScene.defaults);

    this.backgroundColor = params.backgroundColor;
    this.startImage = StartImage().addChildTo(this);

    this.fromJSON({
      children: {
        titleLabel: {
          className: 'phina.display.Label',
          arguments: {
            text: params.title,
            fill: params.fontColor,
            stroke: false,
            fontSize: 64,
          },
          x: this.gridX.center(),
          y: this.gridY.span(1.5),
        }
      }
    });

    if (params.exitType === 'touch') {
      this.fromJSON({
        children: {
          touchLabel: {
            className: 'phina.display.Label',
            arguments: {
              text: "TOUCH START",
              fill: params.fontColor,
              stroke: false,
              fontSize: 32,
            },
            x: this.gridX.center(),
            y: this.gridY.span(14.5),
          },
        },
      });

      this.on('pointend', function() {
        this.exit();
      });
    }
  }

});

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    //グローバル変数を初期値に
    moveSpeed = 5;
    stopScroll = false;
    notSpawnCount = 0;
    score = 0;
    gameOver = false;
    // 背景色を指定
    this.backgroundColor = '#444';
    this.bg0 = Bg().addChildTo(this);
    this.bg1 = Bg().addChildTo(this);
    this.bg1.x = -SCREEN_WIDTH*2 - moveSpeed;

    this.karin = Karin().addChildTo(this);

    this.bananas = DisplayElement().addChildTo(this);
    this.scoreText = ScoreText().addChildTo(this);
  },
  update: function(app){
    if(!gameOver){
      var p = app.pointer;
      if(p.getPointingStart()){
        this.karin.catchBanana();
      }
      if(this.checkHit()){
        gameOver = true;
        stopScroll = true;
        this.karin.slip();
      }
    }
  },
  spawnBanana: function(){
    notSpawnCount += 1;
    var rnd = Random.randint(0, 3)
    if(rnd == 0||notSpawnCount == 3){
      Banana().addChildTo(this.bananas);
      notSpawnCount = 0;
    }
  },
  checkHit: function(){
    return this.bananas.children.first && this.bananas.children.first.x <= this.karin.x;
  }
});

phina.define('Bg', {
  superClass: 'Sprite',
  init: function(){
    this.superInit('bgImg', SCREEN_WIDTH * 2, SCREEN_HEIGHT);
    this.x = 0;
    this.y = SCREEN_HEIGHT / 2;
  },
  update: function(){
    if(!stopScroll){
      this.move();
    }
  },
  move: function(){
    this.x -= moveSpeed;
    if(this.checkOutOfWindow()){
      this.x = SCREEN_WIDTH * 2 - moveSpeed * 2;
    }
  },
  checkOutOfWindow: function(){
    return this.x < -SCREEN_WIDTH;
  }
});

phina.define('Karin', {
  superClass: 'Sprite',
  init: function(){
    this.superInit('tongUpKarin', 230 * 1.3, 188 * 1.3);
    this.x = KARIN_START_X;
    this.y = KARIN_START_Y;
    this.scaleX *= -1;
    this.nextCatch = false;
  },
  update: function(){
    if(!stopScroll){
      this.hopping();
    }
  },
  hopping: function(){
    this.x -= moveSpeed;
    this.tweener
    .call(function(){
      this.target.parent.spawnBanana();
    })
    .to({
      x: KARIN_START_X + moveSpeed,
      y: KARIN_START_Y - 20
    },250,"swing")
    .to({
      x: KARIN_START_X + moveSpeed,
      y: KARIN_START_Y
    },180,"swing")
    .wait(150)
    .play();
  },
  catchBanana: function(){
    stopScroll = true;
    this.tweener
    .clear()
    .set({
      y: KARIN_START_Y
    })
    .call(function(){
      this.target.setImage('tongDownKarin', 230 * 1.3, 188 * 1.3);
    })
    .by({
      x: 45,
      rotation: 30
    }, 100, "swing")
    .call(function(){
      var nextBanana = this.target.parent.bananas.children.first;
      if(nextBanana&&this.target.x + 50 < nextBanana.x && nextBanana.x <= this.target.x + 120){
        nextBanana.remove();
        score += 1;
        moveSpeed += 1;
      }else{
        //gameOver = true; //thanks bode!!
        this.target.swingAway();
      }
    })
    .by({
      x: -45,
      rotation: -30
    }, 100, "swing")
    .call(function(){
      this.target.setImage('tongUpKarin', 230 * 1.3, 188 * 1.3);
      stopScroll = false;
    })
    .wait(30);
  },
  swingAway: function(){
    this.tweener
    .clear()
    .by({
      rotation: 180
    }, 500, "swing")
    .by({
      y: 30
    }, 30, "swing")
    .call(function(){
      this.target.parent.exit({
        score: score,
        hashtags: '歌鈴vsバナナ'
      });
    });
  },
  slip: function(){
    this.tweener
    .clear()
    .by({
      rotation: -180
    }, 500, "swing")
    .by({
      y: 30
    }, 30, "swing")
    .call(function(){
      this.target.parent.exit({
        score: score,
        hashtags: '歌鈴vsバナナ'
      });
    });
  }

});

phina.define('Banana', {
  superClass: 'Sprite',
  init: function(){
    this.superInit('banana', 100, 100);
    this.x = SCREEN_WIDTH;
    this.y = KARIN_START_Y + 98;
  },
  update: function(){
    if(!stopScroll){
      this.move();
    }
  },
  move: function(){
    this.x -= moveSpeed;
  },
  checkOutOfWindow: function(){
    return this.x < -SCREEN_WIDTH;
  }
});

phina.define('ScoreText',{
  superClass: 'Label',

  init: function(){
    this.superInit();
    this.x = SCREEN_WIDTH - (this.width + 70);
    this.y = 50;
    this.fill = "#D23F40";
  },
  update: function(){
    this.text = "SCORE : " + score + " 個";
    this.x = SCREEN_WIDTH - (this.width + 70);
  }
});

phina.define('GameOverImage', {
  superClass: 'Sprite',
  init: function(){
    this.superInit('gameOverImage', 400, 300);
    this.x = SCREEN_WIDTH / 2;
    this.y = SCREEN_WIDTH / 2 + 100;
  }
});

// リザルトシーン上書き
phina.define('ResultScene', {
  superClass: 'DisplayScene',
  /**
   * @constructor
   */
  init: function(params) {
    params = ({}).$safe(params, phina.game.ResultScene.defaults);
    this.superInit(params);

    var message = params.message.format(params);

    this.backgroundColor = params.backgroundColor;
    this.gameOverImage = GameOverImage().addChildTo(this);

    this.fromJSON({
      children: {
        scoreText: {
          className: 'phina.display.Label',
          arguments: {
            text: 'score',
            fill: params.fontColor,
            stroke: null,
            fontSize: 48,
          },
          x: this.gridX.span(8),
          y: this.gridY.span(1),
        },
        scoreLabel: {
          className: 'phina.display.Label',
          arguments: {
            text: params.score+'',
            fill: params.fontColor,
            stroke: null,
            fontSize: 72,
          },
          x: this.gridX.span(8),
          y: this.gridY.span(3),
        },

        shareButton: {
          className: 'phina.ui.Button',
          arguments: [{
            text: '★',
            width: 128,
            height: 128,
            fontColor: params.fontColor,
            fontSize: 50,
            cornerRadius: 64,
            fill: 'rgba(240, 240, 240, 0.5)',
            // stroke: '#aaa',
            // strokeWidth: 2,
          }],
          x: this.gridX.center(-3),
          y: this.gridY.span(14),
        },
        playButton: {
          className: 'phina.ui.Button',
          arguments: [{
            text: '▶',
            width: 128,
            height: 128,
            fontColor: params.fontColor,
            fontSize: 50,
            cornerRadius: 64,
            fill: 'rgba(240, 240, 240, 0.5)',
            // stroke: '#aaa',
            // strokeWidth: 2,
          }],
          x: this.gridX.center(3),
          y: this.gridY.span(14),

          interactive: true,
          onpush: function() {
            this.exit();
          }.bind(this),
        },
      }
    });

    if (params.exitType === 'touch') {
      this.on('pointend', function() {
        this.exit();
      });
    }

    this.shareButton.onclick = function() {
      var text = 'Score: {0}\n{1}'.format(params.score, "バナナには勝てなかったよ...\n");
      var url = phina.social.Twitter.createURL({
        text: text,
        hashtags: params.hashtags,
        url: params.url,
      });
      window.open(url, 'share window', 'width=480, height=320');
    };
  },
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    title: '歌鈴vsバナナ',
    startLabel: 'title',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets: ASSETS,
    fontColor: '#FCF5F7',
    backgroundColor: '#715454',
  });
  // アプリケーション実行
  app.run();
});
