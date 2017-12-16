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
