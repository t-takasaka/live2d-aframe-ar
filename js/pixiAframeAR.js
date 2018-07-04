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
	"position2D":{ "x":0.5, "y":0.5 }, //プレーン内の位置。幅・高さともに中央が0.5
	"scale2D":{ "w":0.5 * texture_rate_inv, "h":0.5 }, //1.0を超えるとモーション次第ではみ出すので注意
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
	"position2D":{ "x":0.5, "y":0.5 }, //プレーン内の位置。幅・高さともに中央が0.5
	"scale2D":{ "w":0.5 * texture_rate_inv, "h":0.5 }, //1.0を超えるとモーション次第ではみ出すので注意
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
//		"position3D":{ "x":0.0, "y":0.0, "z":0.0 }, 
//		"scale3D":{ "w": 3 * texture_rate, "h": 3 }, 
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
		"position3D":{ "x": 0.0, "y": -0.1, "z": -0.1 }, 
		"scale3D":{ "w": 3 * texture_rate, "h": 3 }, //1でマーカーの黒枠と同じサイズ
		"message":{
			"window_position": "-0.6 -1.0 0.1", 
			"window_radius": 0.1, 
			"window_size": 1.2, 
			"window_color": "#FFF", 
			"window_opacity": 0.9, 
			"texture_size": 512, 
			"texture_aspect": 0.5,  // hight/width
			"border_size": 0.02, 
			"text": ["メッセージウィンドウの\nサンプルプログラムです。\nタップで次に進みます。", 
				"ウィンドウやフォント、\nテキストスピードなど\n諸々変更可能です。", 
				"フォントは使用文字だけ\nサブセット化すれば、\n容量を軽くできます。",
				], 
			"text_speed": 150, //ms
			"font_size": 40, 
			"font_color": "#FFF", 
			"font_type": "GenJyuuGothicX", 
			"stroke_size": "10", 
			"stroke_color": "#000", 
			"margin_x": 20, 
			"margin_y": 20, 
			"line_height": 20, 
		},
	}
};
const plane_group2 = { 
	"plane1":{ 
		"moedl_group":model_group2, 
		"position3D":{ "x":0.0, "y":0.1, "z":0.1 }, 
		"scale3D":{ "w": 3 * texture_rate, "h": 3 }, //1でマーカーの黒枠と同じサイズ
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

let detector;
let context;

window.onload = function(){
	//カメラの取得
	//※a-marker-cameraはマーカーがカメラから外れた後も表示が残るので注意
	let camera = document.querySelector("a-entity[camera]");
	if(!camera){ camera = document.querySelector("a-marker-camera"); }
	camera = camera.components.camera.camera;

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
						model.position2D = config["position2D"];
						model.scale2D = config["scale2D"];
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
				models.position3D = plane["position3D"];
				models.scale3D = plane["scale3D"];
				if(plane["message"]){ models.message = plane["message"]; }
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
				planeEl.setAttribute("width", plane.scale3D["w"]);
				planeEl.setAttribute("height", plane.scale3D["h"]);
				//マーカーを基準にしたモデルの相対位置の指定
				let position3D = plane.position3D["x"] + " " + plane.position3D["y"] + " " + plane.position3D["z"];
				planeEl.setAttribute("position", position3D);
				planeEl.setAttribute("rotation", stand);

				//正面方向の判定用オブジェクトの作成
				planeEl.object3D.front = new THREE.Object3D();
				planeEl.object3D.front.position.set(0, 0, -1);
				planeEl.object3D.add(planeEl.object3D.front);

				if(plane.message){
					//テキストの縦の開始位置
					let margin_y = plane.message["margin_y"] + plane.message["font_size"];
					margin_y += (plane.message["texture_size"] * (1.0 - plane.message["texture_aspect"]));
					//テキストの縦の文字幅
					let line_height = plane.message["line_height"] + plane.message["font_size"];
					//ウィンドウの描画設定
					let draw = "width: " + plane.message["texture_size"] + "; height: " + plane.message["texture_size"] + "; ";
					draw += "background: " + plane.message["window_color"] + "; opacity: " + plane.message["window_opacity"] + "; ";
					draw += "uvAdj: " + plane.message["window_size"] + "; ";

					//ウィンドウの作成
					let messageEl = document.createElement("a-rounded");
					let config = "x: " + plane.message["margin_x"] + "; y: " + margin_y + "; ";
					config += "lineHeight: " + line_height + "; ";
					config += "color: " + plane.message["font_color"] + "; ";
					config += "strokeStyle: " + plane.message["stroke_color"] + "; ";
					config += "lineWidth: " + plane.message["stroke_size"] + "; ";
					config += "font: " + plane.message["font_size"] + "px " + plane.message["font_type"] + "; text: ";
					plane.message["config"] = config;

					plane.message["text_current"] = 0;
					plane.message["text_start_time"] = -1;
					plane.message["text_play"] = true;

					messageEl.setAttribute("position", plane.message["window_position"]);
					messageEl.setAttribute("width", plane.message["window_size"]);
					messageEl.setAttribute("height", plane.message["window_size"] * plane.message["texture_aspect"]);
					messageEl.setAttribute("radius", plane.message["window_radius"]);
					messageEl.setAttribute("borderSize", plane.message["border_size"]);
					messageEl.setAttribute("draw", draw);
					messageEl.setAttribute("textwrap", plane.message["config"] + "");
					//プレーンにウィンドウを紐付け
					planeEl.message= messageEl;
					planeEl.appendChild(messageEl);
				}

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
			mesh.renderOrder = 900;
			mesh.onBeforeRender = function(renderer){ renderer.clearDepth(); }
			plane.mesh = mesh;

			scene.renderer.sortObjects = true;
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
				model.position = new PIXI.Point(w * model.position2D["x"], h * model.position2D["y"]);
				model.scale = new PIXI.Point(w * model.scale2D["w"], h * model.scale2D["h"]);
				model.masks.resize(plane.app.view.width, plane.app.view.height);
			});
			plane.mesh.material.map.needsUpdate = true;
		}
		const millisecond_to_frame = 60 / 1000;
		//毎フレーム呼ばれる処理
		const tick = function(time, timeDelta){
			let plane = this.el.plane;
			let marker = this.el.marker;
			if(marker.object3D.visible){
				//画面が回転した直後（＝モデルの表示位置がずれている）でないなら描画する
				if(!orientationchanged){ plane.app.stage.renderable = true; }
				plane.mesh.material.map.needsUpdate = true;

				const time_delta = timeDelta * millisecond_to_frame;
				let pos = this.el.object3D.getWorldPosition();
				let gaze = this.el.object3D.front.getWorldPosition();
				gaze.sub(pos);

				const len = plane.length;
				for(let i = 0; i < len; i++){
					let model = plane[i];

					//視線追従モーションの更新
					model.gaze = gaze;

					//ランダムでモーション再生
					let motion = model.animator.getLayer("motion");
					if(motion && motion.currentTime >= motion.currentAnimation.duration){
						let rand = Math.floor(Math.random() * model.motions.length);
						motion.stop();
						motion.play(model.motions[rand]);
					}

					//更新処理
					model.update(time_delta);
					model.masks.update(plane.app.renderer);
				}

				//テキストの文字送り
				let message = plane.message;
				if(message && message["text_play"] && (message["text"].length > 0)){
					//開始時間を初期化
					if(message["text_start_time"] == -1){ message["text_start_time"] = time; }

					let current = message["text_current"];
					//文字列数が上限を超えていたら0に戻す
					if(current >= message["text"].length){ message["text_current"] = current = 0; }

					let text = message["text"][current];
					let text_len = text.length;
					if(text_len > 0){
						let delta = time - message["text_start_time"];
						let len = Math.floor(delta / message["text_speed"]) + 1;
						let tmp = text.substr(0, len);

						//改行コードは文字にカウントしない
						let lf = tmp.match(/\n/g);
						if(lf){ len += lf.length; }
						if(len > text_len){ 
							len = text_len;
							//次のテキストを表示
							message["text_current"]++;
							message["text_start_time"] = -1;
							message["text_play"] = false;
						}
						tmp = text.substr(0, len);
						this.el.message.setAttribute("textwrap", message["config"] + tmp);
					}
				}

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

	//クリックイベント
	const click_event = function(e){
		markers.forEach(function(marker){
			marker.forEach(function(plane){
				//モーションの再生
				plane.forEach(function(model){
					let motion = model.animator.getLayer("motion");
					if(motion && model.click_motion){
						motion.stop();
						motion.play(model.click_motion);
					}
				});
				//テキストが文末に来ていたら、次のテキストを表示
				let message = plane.message;
				if(message && !message["text_play"]){ 
					message["text_play"] = true; 
				}
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
