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
  },
  update: function(app){

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
    this.move();
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
    this.superInit('tongUpKarin', 179 * 1.3, 188 * 1.3);
    this.x = KARIN_START_X;
    this.y = KARIN_START_Y;
    this.scaleX *= -1;
  },
  update: function(){
    this.move();
    this.hopping();
  },
  move: function(){
  },
  hopping: function(){
    this.x -= moveSpeed;
    this.tweener
    .to({
      x: KARIN_START_X + 15,
      y: KARIN_START_Y - 20
    },250,"swing")
    .to({
      y: KARIN_START_Y
    },250,"swing")
    .play();
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
