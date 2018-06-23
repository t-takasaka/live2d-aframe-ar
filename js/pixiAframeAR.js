//////////////////////////////////////////////////////////////////////
//↓設定項目
//////////////////////////////////////////////////////////////////////

//FPSを表示する場合はtrue、表示しない場合はfalse
const show_fps = true;

//マーカーに対してモデルを垂直に立たせるときはtrue、平行に寝かせるときはfalse
const stand_mode = false;

//プレーンの背景色を塗り潰すときはtrue、透過するときはfalse。デバッグ用
const fill_mode = false;

//テクスチャサイズ
//※立ち絵なら横256×縦512を基本として、モデルごとのscaleの設定で細かい調整をするのがおすすめ
//※大きいと速度が落ちる。また古い端末で読み込めないケースが発生する可能性があるので注意
const texture_width = 256;
const texture_height = 512;
const texture_rate = texture_width / texture_height;
const texture_rate_inv = 1 / texture_rate;

//モデルごとの設定
const koharu = {
	"model":{ "model3":"assets/Koharu/Koharu.model3.json" }, 
	"position":{ "x":0.5, "y":0.5 }, //プレーン内の位置。幅・高さともに中央が0.5
	"scale":{ "w":0.5 * texture_rate_inv, "h":0.5 }, //1.0を超えるとモーション次第ではみ出すので注意
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
	"position":{ "x":0.5, "y":0.5 }, //プレーン内の位置。幅・高さともに中央が0.5
	"scale":{ "w":0.5 * texture_rate_inv, "h":0.5 }, //1.0を超えるとモーション次第ではみ出すので注意
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

//一つのプレーン上に表示するモデルのグループ
//const model_group = { "koharu":koharu, "haruto":haruto };
//一つのマーカー上に表示するプレーンのグループ
//const plane_group = { 
//	"plane":{ 
//		"moedl_group":model_group1, 
//		"position":{ "x":0.0, "y":0.0, "z":0.0 }, 
//		"size":{ "w": 3 * texture_rate, "h": 3 }, 
//	}
//};
//一つのアプリ上に表示するマーカーのグループ
//const marker_group = { 
//	"marker":{ "plane_group":plane_group, "id":"logo" } 
//};


//一つのプレーン上に表示するモデルのグループ
const model_group1 = { "koharu":koharu };
const model_group2 = { "haruto":haruto };
//一つのマーカー上に表示するプレーンのグループ
const plane_group1 = { 
	"plane1":{ 
		"moedl_group":model_group1, 
		"position":{ "x":0.0, "y":-0.1, "z":-0.1 }, 
		"scale":{ "w": 3 * texture_rate, "h": 3 }, //1でマーカーの黒枠と同じサイズ
	}
};
const plane_group2 = { 
	"plane1":{ 
		"moedl_group":model_group2, 
		"position":{ "x":0.0, "y":0.1, "z":0.1 }, 
		"scale":{ "w": 3 * texture_rate, "h": 3 }, //1でマーカーの黒枠と同じサイズ
	}
};
//一つのアプリ上に表示するマーカーのグループ
const marker_group = { 
	"marker1":{ "plane_group":plane_group1, "id":"qr" }, 
	"marker2":{ "plane_group":plane_group2, "id":"logo" }, 
};


//フォント
//http://gero3.github.io/facetype.js/

//////////////////////////////////////////////////////////////////////
//↑設定項目
//////////////////////////////////////////////////////////////////////

window.onload = function(){
	//カメラの取得
	//※a-marker-cameraはマーカーがカメラから外れた後も表示が残るので注意
	//let camera = document.querySelector("a-entity[camera]");
	//if(!camera){ camera = document.querySelector("a-marker-camera"); }
	//camera = camera.components.camera.camera;

	//マーカー
	let markers = [];

	//モデルの読み込み→Pixiの設定→A-Frameの設定、の順番に処理する
	//※前段の処理が終わるまで後段の処理はPromiseで待たせる
	loadModels().then(setupPixi).then(setupAFrame);

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
				//※垂直モードのときは縦方向で大きい値が取れるので調整する
				if(stand_mode){ model.gaze.y *= 0.1; }
				//パラメータの現在値、最大値、最小値
				const values = target.parameters.values;
				const max = target.parameters.maximumValues;
				const min = target.parameters.minimumValues;
				//視線の縦方向、横方向それぞれ正なら最大値側、負なら最小値側から値を取得する
				const angle_h = model.gaze.x > 0 ? max[angle_x] : -min[angle_x];
				const angle_v = model.gaze.y > 0 ? max[angle_y] : -min[angle_y];
				const eye_h = model.gaze.x > 0 ? max[eye_x] : -min[eye_x];
				const eye_v = model.gaze.y > 0 ? max[eye_y] : -min[eye_y];
				//最終的なパラメータ値を計算する
				values[angle_x] = blend(values[angle_x], model.gaze.x * angle_h, 0, weight);
				values[angle_y] = blend(values[angle_y], model.gaze.y * angle_v, 0, weight);
				values[eye_x] = blend(values[eye_x], model.gaze.x * eye_h, 0, weight);
				values[eye_y] = blend(values[eye_y], model.gaze.y * eye_v, 0, weight);
			}
		}

		//モデルの読み込み
		const loadModel = function(config, models){
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
						model.scale_x = config["scale"]["w"];
						model.scale_y = config["scale"]["h"];
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

		let p = [];
		//マーカーの数だけ繰り返し
		for(marker_key in marker_group){
			let marker = marker_group[marker_key];
			let planes = [];
			//プレーンの数だけ繰り返し
			for(plane_key in marker["plane_group"]){
				let plane = marker["plane_group"][plane_key];
				let models = [];
				//モデルの数だけ繰り返し
				for(model_key in plane["moedl_group"]){
					let model = plane["moedl_group"][model_key];
					//モデルの読み込み
					p.push(loadModel(model, models));
				}
				models.position_x = plane["position"]["x"];
				models.position_y = plane["position"]["y"];
				models.position_z = plane["position"]["z"];
				models.scale_w = plane["scale"]["w"];
				models.scale_h = plane["scale"]["h"];
				planes.push(models);
			}
			planes.id = marker["id"];
			markers.push(planes);
		}
		return Promise.all(p);
	}
	//Pixiの設定
	function setupPixi(){
		let p = new Promise(function(resolve, reject){
			markers.forEach(function(marker){
				marker.forEach(function(plane){
					let option = (fill_mode) ? { "backgroundColor": 0x1099bb } : { "transparent": true };
					option["powerPreference"] = "high-performance";
					plane.app = new PIXI.Application(0, 0, option);
					plane.app.stage.renderable = false;

					//appにモデルを紐付け
					plane.forEach(function(model){
						plane.app.stage.addChild(model);
						plane.app.stage.addChild(model.masks);
					});

					//更新処理
					const ticker = function(delta_time){
						plane.forEach(function(model){
							model.update(delta_time);
							model.masks.update(plane.app.renderer);
						});
					}
					//appに更新処理を紐付け
					plane.app.ticker.add(ticker);
				});
			});
			resolve();
		});
		return Promise.all([p]);
	}
	//DOMの設定
	function setupDOM(){
		markers.forEach(function(marker){
			//マーカーの作成
			const id = marker.id;
			let markerEl = document.querySelector("a-marker#" + id);
			if(!markerEl){ markerEl = document.querySelector("a-marker-camera#" + id); }

			marker.forEach(function(plane){
				//直立フラグが立っていたらX軸を-90度回転
				const stand = stand_mode ? "0 0 0" : "-90 0 0";

				//プレーンの作成
				let planeEl = document.createElement("a-plane");
				planeEl.setAttribute("plane", "");
				planeEl.setAttribute("color", "#000");
				planeEl.setAttribute("width", plane.scale_w);
				planeEl.setAttribute("height", plane.scale_h);
				//マーカーを基準にしたモデルの相対位置の指定
				let position = plane.position_x + " " + plane.position_y + " " +plane.position_z;
				planeEl.setAttribute("position", position);
				planeEl.setAttribute("rotation", stand);

				//正面方向の判定用オブジェクトの作成
				planeEl.object3D.front = new THREE.Object3D();
				planeEl.object3D.front.position.set(0, 0, -1);
				planeEl.object3D.add(planeEl.object3D.front);

				//メッセージウィンドウの作成
				let message_position = "0 -0.5 0.1";
				let message_size = 1.0;
				let message_width = 512;
				let message_height = 256;
				let message_font_size = 50;
				let message_margin_x = 10;
				let message_margin_y = 10  + message_font_size;
				let message_draw = "width: " + message_width + "; height: " + message_height + "; background: #FFF";
				let messageEl = document.createElement("a-plane");
				messageEl.setAttribute("position", message_position);
				messageEl.setAttribute("width", message_size);
				messageEl.setAttribute("height", message_size * (message_height / message_width));
				messageEl.setAttribute("draw", message_draw);
				messageEl.config = "x: " + message_margin_x + "; y: " + message_margin_y + "; ";
				messageEl.config += "width: 200; lineHeight: " + message_margin_y + "; ";
				messageEl.config += "color: #FFF; strokeStyle: #000; lineWidth: 6; font: " + message_font_size + "px GenJyuuGothicX; text: ";
				messageEl.text = "コンピュータの世界が広がります。";
				//プレーンにメッセージウィンドウを紐付け
				planeEl.message = messageEl;
				planeEl.appendChild(messageEl);

				//マーカーにプレーンを紐付け
				markerEl.appendChild(planeEl);
				//プレーン同士を紐付け
				planeEl.plane = plane;
				//プレーンにマーカーを紐付け
				planeEl.marker = markerEl;
			});
		});
	}
	//A-Frameの設定
	function setupAFrame(){
		//DOMの設定
		setupDOM();

		//コンポーネントが初期化されると呼ばれる処理
		const init = function(){
			let scene = this.el.sceneEl;
			let plane = this.el.plane;
			//テクスチャの作成
			let texture = new THREE.Texture(plane.app.view);
			texture.premultiplyAlpha = true;
			//マテリアルの作成
			let material = new THREE.MeshBasicMaterial({});
			material.map = texture;
			material.fog = false;
			material.flatShading = true;
			material.lights = false;
			material.premultipliedAlpha = true;
			material.transparent = true;

			//メッシュの紐付け
			mesh = this.el.getObject3D("mesh");
			mesh.material = material;

			//モデルの表示が重なる場合を想定してデプスをクリアしておく
			mesh.renderOrder = 999;
			//mesh.onBeforeRender = function(renderer){ renderer.clearDepth(); }
			mesh.onAfterRender = function(renderer){ renderer.clearDepth(); }
			plane.mesh = mesh;
		}
		//コンポーネントが更新されると呼ばれる処理
		//※毎フレーム呼ばれる処理ではないので注意
		const update = function(){
			let plane = this.el.plane;
			plane.app.view.width = texture_width + "px";
			plane.app.view.height = texture_height + "px";
			plane.app.renderer.resize(texture_width, texture_height);

			const w = texture_width, h = texture_height;
			plane.forEach(function(model){
				model.position = new PIXI.Point(w * model.position_x, h * model.position_y);
				model.scale = new PIXI.Point(w * model.scale_x, h * model.scale_y);
				model.masks.resize(plane.app.view.width, plane.app.view.height);
			});
			plane.mesh.material.map.needsUpdate = true;
		}
		//毎フレーム呼ばれる処理
		const tick = function(time, timeDelta){
			let plane = this.el.plane;
			let marker = this.el.marker;
			if(marker.object3D.visible){
				//画面が回転した直後（＝モデルの表示位置がずれている）でないなら描画する
				if(!orientationchanged){ plane.app.stage.renderable = true; }
				plane.mesh.material.map.needsUpdate = true;

				let pos = this.el.object3D.getWorldPosition();
				let gaze = this.el.object3D.front.getWorldPosition();
				gaze.sub(pos);
				plane.forEach(function(model){
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

				let message = this.el.message;
				let text = message.text;
				message.setAttribute("textwrap", message.config + text);

			}else{
				//マーカーが外れたら描画を止める
				plane.app.stage.renderable = false;
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
		markers.forEach(function(marker){
			marker.forEach(function(plane){
				plane.forEach(function(model){
					let motion = model.animator.getLayer("motion");
					if(motion && model.click_motion){
						motion.stop();
						motion.play(model.click_motion);
					}
				});
			});
		});
	}
	//PCとスマホの選択イベントの振り分け
	if(window.ontouchstart === undefined){
		window.onclick = click_event;
	}else{
		window.ontouchstart = click_event;
	}
	//画面の回転フラグ
	//TODO:フラグはプレーンごとに持たせる必要が無いか？
	let orientationchanged = false;
	window.onorientationchange = function(e){
		if(e === void 0){ e = null; }
		//画面が回転するとモデルの表示位置がずれるため描画を止める
		markers.forEach(function(marker){
			marker.forEach(function(plane){
				plane.app.stage.renderable = false;
			});
		});
		//画面の回転フラグを立てる
		orientationchanged = true;
	}
}

//FPSの表示
if(show_fps){
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
}
