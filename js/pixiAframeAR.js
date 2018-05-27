//マーカーに対しての直立フラグ
const stand_mode = false;

//テクスチャサイズ
const texture_width = 512;
const texture_height = 512;

//モデルごとの設定
const koharu = {
	"model":{ "model3":"assets/Koharu/Koharu.model3.json" }, 
	"position":{ "x":0.3, "y":0.5}, 
	"scale":{ "x":0.5, "y":0.5}, 
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
	"normal_motion":["motion2", "motion3", "motion4", "motion5", "motion6", "motion7", "motion8", "motion9", ], 
	"click_motion":["motion1", ], 
};
const haruto = {
	"model":{ "model3":"assets/Haruto/Haruto.model3.json" }, 
	"position":{ "x":0.7, "y":0.5}, 
	"scale":{ "x":0.5, "y":0.5}, 
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
	"normal_motion":["motion2", "motion3", "motion4", "motion5", "motion6", "motion7", "motion8", "motion9", ], 
	"click_motion":["motion1", ], 
};
const model_group1 = { "Koharu":koharu, "Haruto":haruto };
const plane_group1 = { "PlaneGroup1":model_group1 };
const marker_group = { "Marker1":plane_group1 };

window.onload = function(){
	//カメラの取得
	//※a-marker-cameraはマーカーがカメラから外れた後も表示が残るので注意
	//let camera = document.querySelector("a-entity[camera]");
	//if(!camera){ camera = document.querySelector("a-marker-camera"); }
	//camera = camera.components.camera.camera;

	//画面の回転フラグ
	let orientationchanged = false;

	let models = [];
	let app = new PIXI.Application(0, 0, { transparent: true });
	loadModels().then(addModel).then(addPlane);

	function loadModels(){
		const xhrType = { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON };
		const animation = LIVE2DCUBISMFRAMEWORK.Animation;
		const override = LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE;

		//通常時に再生するモーションの設定
		const setNormalMotion = function(model, resources, normal_motion){
			let motions = [];
			for(let i in normal_motion){ 
				const data = resources[normal_motion[i]].data;
				motions.push(animation.fromMotion3Json(data)); 
			}
			model.motions = motions;
			model.animator.addLayer("motion", override, 1);

			const rand = Math.floor(Math.random() * model.motions.length);
			model.animator.getLayer("motion").play(model.motions[rand]);
		}
		//クリック時に再生するモーションの設定
		const setClickMotion = function(model, resources, click_motion){
			//※仮実装。最初のモーションで決め打ち
			const data = resources[click_motion[0]].data;
			model.click_motion = animation.fromMotion3Json(data);
		}
		//視線追従用のモーションの設定
		const setGazeMotion = function(model, resources, normal_motion){
			//※適当なモーションデータの不要な変数を空にして、視線追従用のモーションデータを作る
			let data = resources[normal_motion[0]].data;
			data.CurveCount = data.TotalPointCount = data.TotalSegmentCount = 0;
			data.Curves = [];
			const gaze_motion = animation.fromMotion3Json(data);
			model.animator.addLayer("gaze", override, 1);
			model.animator.getLayer("gaze").play(gaze_motion);

			//視線追従モーションのパラメータ値更新
			model.gaze = new THREE.Vector3();
			const ids = model.parameters.ids;
			//※2系と3系に対応するためmaxを取る。該当しないバージョンのindexOfは-1を返す
			//※パラメータ自体が無い場合はエラーになるので注意
			const angle_x = Math.max(ids.indexOf("ParamAngleX"), ids.indexOf("PARAM_ANGLE_X"));
			const angle_y = Math.max(ids.indexOf("ParamAngleY"), ids.indexOf("PARAM_ANGLE_Y"));
			const eye_x = Math.max(ids.indexOf("ParamEyeBallX"), ids.indexOf("PARAM_EYE_BALL_X"));
			const eye_y = Math.max(ids.indexOf("ParamEyeBallY"), ids.indexOf("PARAM_EYE_BALL_Y"));
			gaze_motion.evaluate = (time, weight, blend, target, stackFlags, groups) => {
				if(stand_mode){ model.gaze.y *= 0.1; }
				const values = target.parameters.values;
				const max = target.parameters.maximumValues;
				const min = target.parameters.minimumValues;
				const angle_h = model.gaze.x > 0 ? max[angle_x] : -min[angle_x];
				const angle_v = model.gaze.y > 0 ? max[angle_y] : -min[angle_y];
				const eye_h = model.gaze.x > 0 ? max[eye_x] : -min[eye_x];
				const eye_v = model.gaze.y > 0 ? max[eye_y] : -min[eye_y];
				values[angle_x] = blend(values[angle_x], model.gaze.x * angle_h, 0, weight);
				values[angle_y] = blend(values[angle_y], model.gaze.y * angle_v, 0, weight);
				values[eye_x] = blend(values[eye_x], model.gaze.x * eye_h, 0, weight);
				values[eye_y] = blend(values[eye_y], model.gaze.y * eye_v, 0, weight);
			}
		}

		//アセットの読み込み
		const loadModel = function(config){
			let p = new Promise(function(resolve, reject){
				const loader = new PIXI.loaders.Loader();
				//model3.jsonのキーとパスを追加
				const model_key = Object.keys(config["model"])[0];
				loader.add(model_key, config["model"][model_key], xhrType);
				//motion3.jsonのキーとパスを追加
				for(let key in config["motion"]){ loader.add(key, config["motion"][key], xhrType); }

				//リソースの読み込み
				const loadResources = function(loader, resources){
					//モーションの設定
					const setMotion = function(model){ 
						if(model == null){ reject(); }

						setNormalMotion(model, resources, config["normal_motion"]);
						setClickMotion(model, resources, config["click_motion"]);
						setGazeMotion(model, resources, config["normal_motion"]);

						//モデルの位置、サイズ
						model.position_x = config["position"]["x"];
						model.position_y = config["position"]["y"];
						model.scale_x = config["scale"]["x"];
						model.scale_y = config["scale"]["y"];
						models.push(model);

						resolve();
					}
					//モデルの構築
					const builder = new LIVE2DCUBISMPIXI.ModelBuilder();
					builder.buildFromModel3Json(loader, resources[model_key], setMotion);
				}
				loader.load(loadResources);
			});
			return p;
		}

		//モデルの数だけ読み込み処理を行う
		let p = [];
		for(let key in model_group1){ p.push(loadModel(model_group1[key])); }
		return Promise.all(p);
	}
	function addModel(){
		//モデルの登録
		let p = new Promise(function(resolve, reject){
			//初期状態では表示しない
			app.stage.renderable = false;
			//appにモデルを紐付け
			for(let i in models){
				app.stage.addChild(models[i]);
				app.stage.addChild(models[i].masks);
			}

			//更新処理
			const ticker = function(delta_time){
				for(let i in models){
					models[i].update(delta_time);
					models[i].masks.update(app.renderer);
				}
			}
			//appに更新処理を紐付け
			app.ticker.add(ticker);

			resolve();
		});
		return Promise.all([p]);
	}
	function addPlane(){
		//モデルを描画する透明な板の作成
		let plane = document.createElement("a-plane");
		plane.setAttribute("plane", "");
		plane.setAttribute("color", "#000");
		plane.setAttribute("height", "5");
		plane.setAttribute("width", "5");
		//マーカーを基準にしたモデルの相対位置の指定
		plane.setAttribute("position", "0 0 0");
		//直立フラグが立っていたらX軸を-90度回転
		const stand = stand_mode ? "0 0 0" : "-90 0 0";
		plane.setAttribute("rotation", stand);

		//正面方向の判定用オブジェクトの作成
		plane.object3D.front = new THREE.Object3D();
		plane.object3D.front.position.set(0, 0, -1);
		plane.object3D.add(plane.object3D.front);

		//マーカーの作成
		let marker = document.querySelector("a-marker");
		if(!marker){ marker = document.querySelector("a-marker-camera"); }
		//マーカーに板を紐付け
		marker.appendChild(plane);

		//メッシュ
		let mesh = null;

		//コンポーネントが初期化されると呼ばれる処理
		const init = function(){
			//テクスチャの作成
			let texture = new THREE.Texture(app.view);
			texture.premultiplyAlpha = true;
			//マテリアルの作成
			let material = new THREE.MeshStandardMaterial({});
			material.map = texture;
			material.metalness = 0;
			material.premultipliedAlpha = true;
			material.transparent = true;
			//メッシュの取得
			mesh = this.el.getObject3D("mesh");
			mesh.material = material;
		}
		//コンポーネントが更新されると呼ばれる処理
		//※毎フレーム呼ばれる処理ではないので注意
		const update = function(){
			app.view.width = texture_width + "px";
			app.view.height = texture_height + "px";
			app.renderer.resize(texture_width, texture_height);

			const w = texture_width, h = texture_height;
			models.forEach(function(model){
				model.position = new PIXI.Point(w * model.position_x, h * model.position_y);
				model.scale = new PIXI.Point(w * model.scale_x, w * model.scale_y);
				model.masks.resize(app.view.width, app.view.height);
			});

			mesh.material.map.needsUpdate = true;
		}
		//毎フレーム呼ばれる処理
		const tick = function(time, timeDelta){
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
		//コンポーネントの登録
		AFRAME.registerComponent("plane", { "init":init, "update":update, "tick":tick });
	}

	const click_event = function(e){
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
	window.onorientationchange = function(e){
		if(e === void 0){ e = null; }
		//画面が回転するとモデルの表示位置がずれるため描画を止める
		app.stage.renderable = false;
		//画面の回転フラグを立てる
		orientationchanged = true;
	}
}

//FPSの表示
let script = document.createElement("script");
script.onload = function(){
	let stats = new Stats();
	document.body.appendChild(stats.dom);
	const loop = function(){
		stats.update();
		requestAnimationFrame(loop)
	}
	requestAnimationFrame(loop);
}
script.src = "//rawgit.com/mrdoob/stats.js/master/build/stats.min.js";
document.head.appendChild(script);
