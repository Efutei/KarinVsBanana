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
var moveSpeed = 3;
var stopScroll = false;
var karinCatchable = true;
var KARIN_START_X = SCREEN_WIDTH / 2 - 50;
var KARIN_START_Y = SCREEN_HEIGHT / 2 + 80;

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = '#444';
    this.bg0 = Bg().addChildTo(this);
    this.bg1 = Bg().addChildTo(this);
    this.bg1.x = -SCREEN_WIDTH*2 - 3;

    this.karin = Karin().addChildTo(this);
    this.spawnBanana();

    this.bananas = DisplayElement().addChildTo(this);
  },
  update: function(app){
    if(!stopScroll){
      this.bg0.move();
      this.bg1.move();
      this.karin.hopping();
    }
    var p = app.pointer;
    if(p.getPointingStart()){
      this.karin.nextCatch = true;
    }
  },
  spawnBanana: function(){
    this.tweener
    .wait(500)
    .call(function(){
      console.log(this.target);
      var rnd = Random.randint(0, 5)
      if(rnd == 0){
        Banana().addChildTo(this.target.bananas);
      }
    })
    .wait(500)
    .setLoop(true);
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
  },
  move: function(){
    this.x -= moveSpeed;
    if(this.checkOutOfWindow()){
      this.x = SCREEN_WIDTH * 2 - 3;
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
    if(this.nextCatch && karinCatchable){
      this.nextCatch = false;
      this.catchBanana();
    }
  },
  hopping: function(){
    this.x -= moveSpeed;
    this.tweener
    .call(function(){
      karinCatchable = false
    })
    .to({
      x: KARIN_START_X + 10,
      y: KARIN_START_Y - 20
    },250,"swing")
    .to({
      x: KARIN_START_X + 10,
      y: KARIN_START_Y
    },180,"swing")
    .call(function(){
      karinCatchable = true
    })
    .wait(150)
    .play();
  },
  catchBanana: function(){
    console.log("hoge");
    stopScroll = true;
    karinCatchable = false;
    this.tweener
    .clear()
    .set({
      y: KARIN_START_Y
    })
    .rotateBy(10, 100, "swing")
    .rotateBy(-10, 100, "swing")
    .wait(300)
    .call(function(){
      stopScroll = false;
      karinCatchable = true;
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
    this.move();
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
