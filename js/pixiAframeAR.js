PIXI.loader.add('moc', "assets/Miku/Miku.moc3", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
PIXI.loader.add('texture0', "assets/Miku/Miku_00.png");
PIXI.loader.add('motion', "assets/Miku/Miku_08.motion3.json", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
PIXI.loader.add('physics', "assets/Miku/Miku.physics3.json");
PIXI.loader.once('complete', onComplate);
PIXI.loader.load();
/*
PIXI.loader.add('moc', "assets/Hiyori/Hiyori.moc3", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
PIXI.loader.add('texture0', "assets/Hiyori/Hiyori_00.png");
//※テクスチャが複数枚の場合は以下の行を追加していく
//PIXI.loader.add('texture1', "assets/Hiyori/Hiyori_01.png");
PIXI.loader.add('motion', "assets/Hiyori/Hiyori_m03.motion3.json", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
//PIXI.loader.add('physics', "assets/Hiyori/Hiyori.physics3.json");
//PIXI.loader.once('complete', onComplate);
//PIXI.loader.load();
*/
/*
PIXI.loader.add('moc', "assets/Koharu/Koharu.moc3", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
PIXI.loader.add('texture0', "assets/Koharu/Koharu_color.png");
PIXI.loader.add('motion', "assets/Koharu/Koharu.motion3.json", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
PIXI.loader.once('complete', onComplate);
PIXI.loader.load();
*/

function onComplate(loader, resources) {
	//モデルの構築
	var moc = LIVE2DCUBISMCORE.Moc.fromArrayBuffer(resources['moc'].data);
	var builder = new LIVE2DCUBISMPIXI.ModelBuilder().setMoc(moc).setTimeScale(1);
	builder.addTexture(0, resources['texture0'].texture);
	//※テクスチャが複数枚の場合は以下の行を追加していく
//	builder.addTexture(1, resources['texture1'].texture);
	builder.addAnimatorLayer("base", LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE, 1)
	var model = builder.build();
	//アニメーションの登録
	var animation = LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(resources['motion'].data);
	model.animator.getLayer("base").play(animation);

	//モデルを張り付ける平面の設定
	var plane = document.createElement('a-plane');
	plane.setAttribute('model1', '');
	//マーカーを基準にしたモデルの相対位置
	plane.setAttribute('position', '0 0 0');
	//モデルの確度。マーカーと垂直なら'0 0 0'、水平なら'-90 0 0'
	plane.setAttribute('rotation', '-90 0 0');

	var marker = document.querySelector('a-marker');
	if(!marker){ marker = document.querySelector('a-marker-camera'); }
	marker.appendChild(plane);
	
	var orientationchanged = false;
	var app;
	AFRAME.registerComponent('model1', {
		init: function () {
			var el = this.el;
			var scene = el.sceneEl;
			var mesh = el.getObject3D('mesh');

			//THREEのコンテキストを渡してPIXIを初期化する
			//TODO:PIXI.ApplicationもPIXI.autoDetectRendererも不要
			app = new PIXI.Application(0, 0, { antialias: false,context: scene.renderer.context, transparent: true, powerPreference: "high-performance" });

			//PIXIのコンテナにモデルを登録
			app.stage.addChild(model);
			app.stage.addChild(model.masks);
			app.stage.renderable = false;

			//マテリアルの作成
			var scale = "3.0"; //TODO:uniformで送る
			var vertex_shader = "uniform vec2 u_scale; varying vec2 v_uv; void main(){ v_uv = uv; vec4; gl_Position = projectionMatrix * modelViewMatrix * vec4(position * " + scale + ", 1.0); }";
			var fragment_shader = "uniform sampler2D texture; varying vec2 v_uv; void main(){ vec4 tex = texture2D(texture, v_uv); gl_FragColor = tex; }";
			//TODO:テクスチャの指定が冗長。PIXI側から引っ張る
			var loader = new THREE.TextureLoader();
//			texture = loader.load("assets/Koharu/Koharu.png", function(){
			var texture = loader.load("assets/Miku/Miku_00.png", function(){
				texture.premultiplyAlpha = true;
				texture.flipY = false;
				mesh.material = new THREE.ShaderMaterial({
					vertexShader: vertex_shader,
					fragmentShader: fragment_shader,
					uniforms: {texture: {type: "t", value: texture}},
					premultipliedAlpha: true,
					transparent: true,
				});
			});

			//TODO:tick()と統合する
			app.ticker.add(function (deltaTime) {
				model.update(deltaTime);
				model.masks.update(app.renderer);
			});
		},
		update: function(){
		},
		tick: function (time, timeDelta) {
			if(marker.object3D.visible){
				//画面が回転した直後（＝モデルの表示位置がずれている）でないなら描画する
				if(!orientationchanged){ app.stage.renderable = true; }
			}else{
				//マーカーが外れたら描画を止める
				app.stage.renderable = false;
				//マーカーが外れたら画面の回転フラグを折る
				//→マーカーの再検出時にモデルの表示位置が修正されるため
				orientationchanged = false;
			}
		}
	});

	window.onorientationchange = function (event) {
		if (event === void 0) { event = null; }
		//画面が回転するとモデルの表示位置がずれるため描画を止める
		app.stage.renderable = false;
		//画面の回転フラグを立てる
		orientationchanged = true;
	};
}

//FPSの表示
var script = document.createElement('script');
script.onload=function(){
	var stats = new Stats();
	document.body.appendChild(stats.dom);
	requestAnimationFrame(function loop(){
		stats.update();
		requestAnimationFrame(loop)
	});
};
script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
document.head.appendChild(script);

