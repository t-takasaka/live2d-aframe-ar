# Live2D A-Frame AR

Live2DをWebARで表示するサンプルです。

スマホのブラウザさえあればコンテンツにアクセスできるので、ARアプリのボトルネックになりがちなインストールの手間を省けるのが利点です。

<img src="https://raw.githubusercontent.com/t-takasaka/live2d-aframe-ar/master/demo.gif">

## サンプル

ウェブカメラの付いたPCで[こちら](https://t-takasaka.github.io/live2d-aframe-ar/)にアクセスするか、スマートフォンで下記のQRコードにアクセスしてください。

サンプルページの表示後、再度、QRコードにカメラを向けるとモデルが表示されます。

<img src="https://raw.githubusercontent.com/t-takasaka/live2d-aframe-ar/master/assets/qr_marker.png" width="300px">

## 機能

- マーカーに対して並行、垂直にモデルを表示

- モデルの複数体表示

- ランダムモーション再生

- カメラ方向への視線追従

- クリック、タップでのモーション切り替え

- メッセージウィンドウの表示

## TODO

- 録画機能

- 設定値の分離（jsonファイル？）

## 注意事項

- マーカーのジェネレータは[こちら](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html)にあります

- htmlファイルのa-sceneタグにある「patternRatio」はジェネレータの「Pattern Ratio」の値と一致させてください。

- 

