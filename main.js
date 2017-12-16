// phina.js をグローバル領域に展開
phina.globalize();

var ASSETS = {
  image: {
    bgImg: './img/bg_dote.jpg',
    tongUpKarin: './img/tongUpKarin.png',
    tongDownKarin: './img/tongDownKarin.png',
    banana: './img/banana_kawa.png'
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

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = '#444';
    this.bg0 = Bg().addChildTo(this);
    this.bg1 = Bg().addChildTo(this);
    this.bg1.x = -SCREEN_WIDTH*2 - moveSpeed;

    this.karin = Karin().addChildTo(this);

    this.bananas = DisplayElement().addChildTo(this);

  },
  update: function(app){
    var p = app.pointer;
    if(p.getPointingStart()){
      this.karin.catchBanana();
    }
  },
  spawnBanana: function(){
    notSpawnCount += 1;
    var rnd = Random.randint(0, 3)
    if(rnd == 0||notSpawnCount == 3){
      Banana().addChildTo(this.bananas);
      notSpawnCount = 0;
    }
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
      this.x = SCREEN_WIDTH * 2 - moveSpeed;
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
        console.log(nextBanana);
        nextBanana.remove();
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
    .wait(30)
    .call(function(){
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

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    title: '歌鈴vsバナナ',
    startLabel: location.search.substr(1).toObject().scene || 'title',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets: ASSETS,
    backgroundColor: '#444',
  });
  // アプリケーション実行
  app.run();
});
