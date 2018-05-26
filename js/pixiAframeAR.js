const koharu = {
	"model":{ "model3":"assets/Koharu/Koharu.model3.json" }, 
	"position":{ "x":0.3, "y":0.5}, 
	"motion":{
		"motion1":"assets/Koharu/Koharu_01.motion3.json", 
		"motion2":"assets/Koharu/Koharu_02.motion3.json", 
		"motion3":"assets/Koharu/Koharu_03.motion3.json", 
		"motion4":"assets/Koharu/Koharu_04.motion3.json", 
		"motion5":"assets/Koharu/Koharu_05.motion3.json", 
		"motion6":"assets/Koharu/Koharu_06.motion3.json", 
		"motion7":"assets/Koharu/Koharu_07.motion3.json", 
		"motion8":"assets/Koharu/Koharu_08.motion3.json", 
		"motion9":"assets/Koharu/Koharu_09.motion3.json", 
	}, 
	"motion_normal":["motion2", "motion3", "motion4", "motion5", "motion6", "motion7", "motion8", "motion9", ], 
	"motion_click":["motion1", ], 
};
const haruto = {
	"model":{ "model3":"assets/Haruto/Haruto.model3.json" }, 
	"position":{ "x":0.7, "y":0.5}, 
	"motion":{
		"motion1":"assets/Haruto/Haruto_01.motion3.json", 
		"motion2":"assets/Haruto/Haruto_02.motion3.json", 
		"motion3":"assets/Haruto/Haruto_03.motion3.json", 
		"motion4":"assets/Haruto/Haruto_04.motion3.json", 
		"motion5":"assets/Haruto/Haruto_05.motion3.json", 
		"motion6":"assets/Haruto/Haruto_06.motion3.json", 
		"motion7":"assets/Haruto/Haruto_07.motion3.json", 
		"motion8":"assets/Haruto/Haruto_08.motion3.json", 
		"motion9":"assets/Haruto/Haruto_09.motion3.json", 
	}, 
	"motion_normal":["motion2", "motion3", "motion4", "motion5", "motion6", "motion7", "motion8", "motion9", ], 
	"motion_click":["motion1", ], 
};
const models1 = { "Koharu":koharu, "Haruto":haruto };
const planes1 = { "Plane1":models1 };
const markers = { "Marker1":planes1 };

window.onload = function(){
	let marker = document.querySelector("a-marker");
	//※a-marker-cameraはマーカーがカメラから外れた後も表示が残るので注意
	if(!marker){ marker = document.querySelector("a-marker-camera"); }
	let camera = document.querySelector("a-entity[camera]");
	if(!camera){ camera = document.querySelector("a-marker-camera"); }
	camera = camera.components.camera.camera;

	//画面の回転フラグ
	let orientationchanged = false;
	//マーカーに対しての直立フラグ
	let stand_mode = false;

	let models = [];
	let app = new PIXI.Application(0, 0, { transparent: true });
	loadAssets().then(addModel).then(addPlane);

	function loadAssets(){
		//モーションの設定
		const setMotion = function(model, resources, x, y, resolve, reject){
			if(model == null){ reject(); }

			//モーションの読み込み
			let motions = [];
			const animation = LIVE2DCUBISMFRAMEWORK.Animation;
			const override = LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE;
			motions.push(animation.fromMotion3Json(resources['motion2'].data));
			motions.push(animation.fromMotion3Json(resources['motion3'].data));
			motions.push(animation.fromMotion3Json(resources['motion4'].data));
			motions.push(animation.fromMotion3Json(resources['motion5'].data));
			motions.push(animation.fromMotion3Json(resources['motion6'].data));
			motions.push(animation.fromMotion3Json(resources['motion7'].data));
			motions.push(animation.fromMotion3Json(resources['motion8'].data));
			motions.push(animation.fromMotion3Json(resources['motion9'].data));
			model.motions = motions;
			model.animator.addLayer("motion", override, 1);

			//通常時に再生するモーションの指定
			let rand = Math.floor(Math.random() * model.motions.length);
			model.animator.getLayer("motion").play(model.motions[rand]);

			//クリックされたときに再生するモーションの指定
			let data = resources['motion1'].data;
			model.click_motion = animation.fromMotion3Json(data);

			//視線追従用のモーションの指定
			data.CurveCount = data.TotalPointCount = data.TotalSegmentCount = 0;
			data.Curves = [];
			let gaze_motion = animation.fromMotion3Json(data);
			model.animator.addLayer("gaze", override, 1);
			model.animator.getLayer("gaze").play(gaze_motion);

			//視線追従モーションのパラメータ値更新
			model.gaze = new THREE.Vector3();
			let ids = model.parameters.ids;
			//※2系と3系に対応するためmaxを取る。該当しないバージョンのindexOfは-1を返す
			let angle_x = Math.max(ids.indexOf("ParamAngleX"), ids.indexOf("PARAM_ANGLE_X"));
			let angle_y = Math.max(ids.indexOf("ParamAngleY"), ids.indexOf("PARAM_ANGLE_Y"));
			let eye_x = Math.max(ids.indexOf("ParamEyeBallX"), ids.indexOf("PARAM_EYE_BALL_X"));
			let eye_y = Math.max(ids.indexOf("ParamEyeBallY"), ids.indexOf("PARAM_EYE_BALL_Y"));
			gaze_motion.evaluate = (time, weight, blend, target, stackFlags, groups) => {
				if(stand_mode){ model.gaze.y *= 0.1; }
				let values = target.parameters.values;
				let max = target.parameters.maximumValues;
				let min = target.parameters.minimumValues;
				let angle_h = model.gaze.x > 0 ? max[angle_x] : -min[angle_x];
				let angle_v = model.gaze.y > 0 ? max[angle_y] : -min[angle_y];
				let eye_h = model.gaze.x > 0 ? max[eye_x] : -min[eye_x];
				let eye_v = model.gaze.y > 0 ? max[eye_y] : -min[eye_y];
				values[angle_x] = blend(values[angle_x], model.gaze.x * angle_h, 0, weight);
				values[angle_y] = blend(values[angle_y], model.gaze.y * angle_v, 0, weight);
				values[eye_x] = blend(values[eye_x], model.gaze.x * eye_h, 0, weight);
				values[eye_y] = blend(values[eye_y], model.gaze.y * eye_v, 0, weight);
			}

			//キャンバス内のモデルの位置
			model.pos_x = x;
			model.pos_y = y;

			models.push(model);
			resolve();
		}
		//アセットの読み込み
		const loadAsset = function(asset){
			return new Promise(function (resolve, reject){
				const xhrType = { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON };

				const loader = new PIXI.loaders.Loader();
				//model3.jsonのキーとパスを追加
				const model_key = Object.keys(asset["model"])[0];
				loader.add(model_key, asset["model"][model_key], xhrType);
				//motion3.jsonのキーとパスを追加
				for(var key in asset["motion"]){ loader.add(key, asset["motion"][key], xhrType); }

				//モーションの設定
				loader.load(function(loader, resources){
					const x = asset["position"]["x"];
					const y = asset["position"]["y"];
					const complate = function(model){ 

setMotion(model, resources, x, y, resolve, reject); 

					}
					const builder = new LIVE2DCUBISMPIXI.ModelBuilder();
					builder.buildFromModel3Json(loader, resources[model_key], complate);
				});
			});
		}
		//モデルの数だけ読み込み処理を行う
		let p = [];
		for(var key in models1){ p.push(loadAsset(models1[key])); }
		return Promise.all(p);
	}
	function addModel() {
		//モデルの登録
		let p = new Promise(function (resolve, reject) {
			models.forEach(function(model){
				app.stage.addChild(model);
				app.stage.addChild(model.masks);
			});
			app.stage.renderable = false;
			app.ticker.add(function (deltaTime) {
				models.forEach(function(model){
					model.update(deltaTime);
					model.masks.update(app.renderer);
				});
			});
			resolve();
		});
		return Promise.all([p]);
	}
	function addPlane(){
		let plane = document.createElement('a-plane');
		plane.setAttribute('plane', '');
		plane.setAttribute('color', '#000');
		plane.setAttribute('height', '5');
		plane.setAttribute('width', '5');
		//マーカーを基準にしたモデルの相対位置
		plane.setAttribute('position', '0 0 0');
		let stand = stand_mode ? '0 0 0' : '-90 0 0';
		plane.setAttribute('rotation', stand);
		marker.appendChild(plane);

		plane.object3D.front = new THREE.Object3D();
		plane.object3D.front.position.set(0, 0, -1);
		plane.object3D.add(plane.object3D.front);

		let texture = new THREE.Texture(app.view);
		texture.premultiplyAlpha = true;
		let material = new THREE.MeshStandardMaterial({});
		material.map = texture;
		material.metalness = 0;
		material.premultipliedAlpha = true;
		material.transparent = true;
		let mesh = null;

		AFRAME.registerComponent('plane', {
			init: function(){
				mesh = this.el.getObject3D('mesh');
				mesh.material = material;
			},
			update: function(){
				let width = 512;
				let height = 512;
				app.view.width = width + "px";
				app.view.height = height + "px";
				app.renderer.resize(width, height);

				models.forEach(function(model){
					model.position = new PIXI.Point(width * model.pos_x, height * model.pos_y);
					model.scale = new PIXI.Point(width * 0.5, width * 0.5);
					model.masks.resize(app.view.width, app.view.height);
				});

				mesh.material.map.needsUpdate = true;
			},
			tick: function(time, timeDelta){
				if(marker.object3D.visible){
					//画面が回転した直後（＝モデルの表示位置がずれている）でないなら描画する
					if(!orientationchanged){ app.stage.renderable = true; }
					mesh.material.map.needsUpdate = true;

					let pos = plane.object3D.getWorldPosition();
					let gaze = plane.object3D.front.getWorldPosition();
					gaze.sub(pos);
					models.forEach(function(model){
						//視線追従モーションの更新
						model.gaze = gaze;

						//ランダムでモーション再生
						let motion = model.animator.getLayer("motion");
						if(motion && motion.currentTime >= motion.currentAnimation.duration){
							let rand = Math.floor(Math.random() * model.motions.length);
							motion.stop();
							motion.play(model.motions[rand]);
						}
					});
				}else{
					//マーカーが外れたら描画を止める
					app.stage.renderable = false;
					//マーカーが外れたら画面の回転フラグを折る
					//→マーカーの再検出時にモデルの表示位置が修正されるため
					orientationchanged = false;
				}
			}
		});
	}

	let click_event = function (e){
		//クリックモーションの再生
		models.forEach(function(model){ 
			let motion = model.animator.getLayer("motion");
			if(motion && model.click_motion){
				motion.stop();
				motion.play(model.click_motion);
			}
		});
	}
	//PCとスマホの選択イベントの振り分け
	if(window.ontouchstart === undefined){
		window.onclick = click_event;
	}else{
		window.ontouchstart = click_event;
	}
	window.onorientationchange = function (e) {
		if (e === void 0) { e = null; }
		//画面が回転するとモデルの表示位置がずれるため描画を止める
		app.stage.renderable = false;
		//画面の回転フラグを立てる
		orientationchanged = true;
	}
};

//FPSの表示
let script = document.createElement('script');
script.onload=function(){
	let stats = new Stats();
	document.body.appendChild(stats.dom);
	requestAnimationFrame(function loop(){
		stats.update();
		requestAnimationFrame(loop)
	});
};
script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
document.head.appendChild(script);
