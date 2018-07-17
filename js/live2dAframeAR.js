//////////////////////////////////////////////////////////////////////
//設定項目ここから
//////////////////////////////////////////////////////////////////////

//マーカーのジェネレータは下記にあります
//https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html

//フォントのサブセット化ツールは下記にあります
//https://opentype.jp/subsetfontmk.htm

//FPSを表示する場合はtrue、表示しない場合はfalse
const show_fps = true;

//マーカーに対してモデルを垂直に立たせるときはtrue、平行に寝かせるときはfalse
const stand_mode = false;

//モデルごとの設定
const koharu = {
	"model":{ "model3":"assets/Koharu/Koharu.model3.json" }, 
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

//一つのマーカー上に表示するモデルのグループ
const model_group1 = { 
	"model1":{ 
		"model":koharu, 
		//モデルの位置
		"position3D":{ "x": 0.0, "y": 0.0, "z": 0.0 }, 
		//モデルの大きさ。1でマーカーの黒枠と同じサイズ
		"scale3D":{ "w": 2, "h": 2 }, 
		//メッセージウィンドウ
		"message":{
			"window_position": "-0.7 -1.5 0.0", 
			"window_radius": 0.1, 
			"window_size": 1.4, 
			"window_color": "#FFF", 
			"window_opacity": 0.9, 
			"texture_size": 512, 
			"texture_aspect": 0.55,  // hight/width
			//メッセージウィンドウのボーダー幅
			"border_size": 0.02, 
			//テキスト
			//※ダブルクォーテーションで囲んだカンマまでの行が一度に表示されます。改行は「\n」です
			"text": ["メッセージウィンドウの\nサンプルプログラムです。\nタップで次に進みます。\nタップで次に進みます。", 
				"ウィンドウやフォント、\nテキストスピードなど\n諸々変更可能です。", 
				"フォントは使用文字だけ\nサブセット化すれば、\n容量を軽くできます。",
				], 
			"text_speed": 100, //ms
			//フォント
			"font_size": 40, 
			"font_color": "#FFF", 
			//※html側のfont-familyで指定が必要
			"font_type": "GenJyuuGothicX", 
			//フォントの枠線
			"stroke_size": "10", 
			"stroke_color": "#000", 
			//フォントの影（一旦保留）
			"shadow_color": "#888", 
			"shadow_offset_x": 0, 
			"shadow_offset_y": 0, 
			"shadow_blur": 0, 
			//テキストのマージン
			"margin_x": 20, 
			"margin_y": 20, 
			//テキストの位置行ごとの高さ
			"line_height": 20, 
		},
	}, 
/*
	//一つのマーカー上に複数体のモデルを表示する場合は下記のように追加していきます
	"model2":{ 
		"model":haruto, 
		"position3D":{ "x": 2.0, "y": 0.0, "z": 0.0 }, 
		"scale3D":{ "w": 2, "h": 2 }, //1でマーカーの黒枠と同じサイズ
	}
*/
};
//一つのアプリ上に表示するマーカーのグループ
const marker_group = { 
	"marker1":{ "model_group":model_group1, "id":"qr" }, 
/*
	//複数のマーカーごとにモデルを表示する場合は下記のように追加していきます
	"marker2":{ "model_group":model_group1, "id":"logo" }, 
*/
};

//////////////////////////////////////////////////////////////////////
//設定項目ここまで
//////////////////////////////////////////////////////////////////////

window.onload = function(){
	//カメラの取得
	//※a-marker-cameraはマーカーがカメラから外れた後も表示が残るので注意
	let camera = document.querySelector("a-entity[camera]");
	if(!camera){ camera = document.querySelector("a-marker-camera"); }
	camera = camera.components.camera.camera;

	//マーカー
	let markers = [];

	//モデルの読み込み→A-Frameの設定、の順番に処理する
	//※前段の処理が終わるまで後段の処理はPromiseで待たせる
	loadModels().then(setupAFrame);

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
		const loadModel = function(model, models){
			let p = new Promise(function(resolve, reject){
				const loader = new PIXI.loaders.Loader();
				//model3.jsonのキーとパスを追加
				const model_key = Object.keys(model["model"]["model"])[0];
				loader.add(model_key, model["model"]["model"][model_key], xhrType);
				//motion3.jsonのキーとパスを追加
				for(let key in model["model"]["motion"]){ loader.add(key, model["model"]["motion"][key], xhrType); }

				//リソースの読み込み
				const loadResources = function(loader, resources){
					//モーションの設定
					const setMotion = function(_model){ 
						if(_model == null){ reject(); }

						setNormalMotion(_model, resources, model["model"]["normal_motion"]);
						setClickMotion(_model, resources, model["model"]["click_motion"]);
						setGazeMotion(_model, resources, model["model"]["normal_motion"]);

						_model.position3D = model["position3D"];
						_model.scale3D = model["scale3D"];
						if(model["message"]){ _model.message = model["message"]; }
						models.push(_model);

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
			let models = [];
			//モデルの数だけ繰り返し
			for(model_key in marker["model_group"]){
				let model = marker["model_group"][model_key];
				//モデルの読み込み
				p.push(loadModel(model, models));
			}
			models.id = marker["id"];
			markers.push(models);
		}
		return Promise.all(p);
	}

	//DOMの設定
	function setupDOM(){
		markers.forEach(function(marker){
			//マーカーの作成
			const id = marker.id;
			let markerEl = document.querySelector("a-marker#" + id);
			if(!markerEl){ markerEl = document.querySelector("a-marker-camera#" + id); }

			marker.forEach(function(model){
				//直立フラグが立っていたらX軸を-90度回転
				const stand = stand_mode ? "0 0 0" : "-90 0 0";

				//モデルの基点の作成
				let modelEl = document.createElement("a-entity");
				modelEl.setAttribute("live2d", "");
				modelEl.setAttribute("width", 0);
				modelEl.setAttribute("height", 0);
				//マーカーを基準にしたモデルの相対位置の指定
				let position3D = model.position3D["x"] + " " + model.position3D["y"] + " " + model.position3D["z"];
				modelEl.setAttribute("position", position3D);
				modelEl.setAttribute("rotation", stand);

				//正面方向の判定用オブジェクトの作成
				modelEl.object3D.front = new THREE.Object3D();
				modelEl.object3D.front.position.set(0, 0, -1);
				modelEl.object3D.add(modelEl.object3D.front);

				//メッシュを追加
				let meshes = model.meshes;
				for(let i = 0; i < meshes.length; i++){
					let meshEl = document.createElement("a-plane");
					modelEl.appendChild(meshEl);
				}

				if(model.message){
					//テキストの縦の開始位置
					let margin_y = model.message["margin_y"] + model.message["font_size"];
					margin_y += (model.message["texture_size"] * (1.0 - model.message["texture_aspect"]));
					//テキストの縦の文字幅
					let line_height = model.message["line_height"] + model.message["font_size"];
					//ウィンドウの描画設定
					let draw = "width: " + model.message["texture_size"] + "; height: " + model.message["texture_size"] + "; ";
					draw += "background: " + model.message["window_color"] + "; opacity: " + model.message["window_opacity"] + "; ";
					draw += "uvAdj: " + model.message["window_size"] + "; ";

					//ウィンドウの作成
					let messageEl = document.createElement("a-rounded");
					let config = "x: " + model.message["margin_x"] + "; y: " + margin_y + "; ";
					config += "lineHeight: " + line_height + "; ";
					config += "color: " + model.message["font_color"] + "; ";
					config += "strokeStyle: " + model.message["stroke_color"] + "; ";
					config += "lineWidth: " + model.message["stroke_size"] + "; ";

					config += "font: " + model.message["font_size"] + "px " + model.message["font_type"] + "; text: ";
					model.message["config"] = config;

					model.message["text_current"] = 0;
					model.message["text_start_time"] = -1;
					model.message["text_play"] = true;

					messageEl.setAttribute("position", model.message["window_position"]);
					messageEl.setAttribute("width", model.message["window_size"]);
					messageEl.setAttribute("height", model.message["window_size"] * model.message["texture_aspect"]);
					messageEl.setAttribute("radius", model.message["window_radius"]);
					messageEl.setAttribute("borderSize", model.message["border_size"]);
					messageEl.setAttribute("draw", draw);
					messageEl.setAttribute("textwrap", model.message["config"] + "");
					//モデルにウィンドウを紐付け
					modelEl.message= messageEl;
					modelEl.appendChild(messageEl);
				}

				//マーカーにモデルを紐付け
				markerEl.appendChild(modelEl);
				//モデルのエレメントにデータを紐付け
				modelEl.model = model;
				//モデルにマーカーを紐付け
				modelEl.marker = markerEl;
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
			let model = this.el.model;

			//マスクメッシュ用のマテリアル
			let mask_material = new THREE.MeshBasicMaterial();
			mask_material.colorWrite = false;
			mask_material.depthWrite = false;
			mask_material.depthTest = false;
			mask_material.stencilWrite = true;
			mask_material.stencilTest = true;
			mask_material.fog = false;
			mask_material.flatShading = true;
			mask_material.transparent = true;
			mask_material.premultipliedAlpha = true;
			//※メッシュの反転コピーがあるのでDoubleSideを指定する
			mask_material.side = THREE.DoubleSide;
			mask_material.alphaTest = 0.5;

			//通常メッシュ用のマテリアル
			let material = new THREE.MeshBasicMaterial();
			material.depthWrite = false;
			material.depthTest = false;
			material.fog = false;
			material.flatShading = true;
			material.transparent = true;
			material.premultipliedAlpha = true;
			//※メッシュの反転コピーがあるのでDoubleSideを指定する
			material.side = THREE.DoubleSide;
			material.alphaTest = 0.5;

			model.mesh_object_cache = {};
			let texture_cache = {};
			let meshesEl = this.el.children;
			//各メッシュの設定
			let meshes = model.meshes;

			for(let i = 0; i < meshes.length; i++){
				let mesh = meshes[i];

				//ジオメトリの初期化
				let geometry = new THREE.BufferGeometry();
				let indices = new Uint16Array(mesh.indices.length);
				let vertices = new Float32Array(mesh.vertices.length * 0.5 * 3); //2D->3D
				let uvs = new Float32Array(mesh.uvs.length);
				geometry.setIndex(new THREE.BufferAttribute(indices, 1));
				geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3));
				geometry.addAttribute("uv", new THREE.BufferAttribute(uvs, 2));

				//インデックスの初期化
				let len = mesh.indices.length;
				let index = geometry.index.array;
				for(let j = 0; j < len; j++){ index[j] = mesh.indices[j]; }

				//頂点の初期化
				//※2D用の頂点情報が入っているため頂点数は（3ではなく）2で割る
				len = mesh.vertices.length * 0.5;
				let position = geometry.attributes.position.array;
				for(let j = 0; j < len; j++){ 
					let s = j * 2, d = j * 3;
					position[d + 0] = mesh.vertices[s + 0]; 
					position[d + 1] = mesh.vertices[s + 1]; 
					position[d + 2] = 0.0; 
				}
				geometry.attributes.position.needsUpdate = true;

				//UVの初期化
				len = mesh.uvs.length;
				let uv = geometry.attributes.uv.array;
				for(let j = 0; j < len; j++){ uv[j] = mesh.uvs[j]; }

				//メッシュの取得
				let mesh_object = meshesEl[i].getObject3D("mesh");
				mesh_object.name = mesh.name;
				//※毎回getObject3D()すると重いのでキャッシュ化
				model.mesh_object_cache[i] = mesh_object;
				//メッシュにジオメトリを設定
				mesh_object.geometry = geometry;
				//メッシュにマテリアルを設定
				mesh_object.material = material.clone();

				let texture_ids = mesh.texture.textureCacheIds;
				if(!texture_cache[texture_ids[0]]){
					//テクスチャのキャッシュ
					let texture = new THREE.TextureLoader().load(texture_ids[1]);
					texture.flipY = false;
					texture_cache[texture_ids[0]] = texture;
				}
				//マテリアルにテクスチャを設定
				mesh_object.material.map = texture_cache[texture_ids[0]];

				//ブレンドモード
				if(LIVE2DCUBISMCORE.Utils.hasBlendAdditiveBit(model._coreModel.drawables.constantFlags[i])){
					mesh_object.material.blendMode = THREE.AdditiveBlending; //加算

				}else if(LIVE2DCUBISMCORE.Utils.hasBlendMultiplicativeBit(model._coreModel.drawables.constantFlags[i])){
					mesh_object.material.blendMode = THREE.MultiplyBlending; //乗算
				}

				//スケール
				mesh_object.scale.x = model.scale3D.w;
				mesh_object.scale.y = model.scale3D.h;
				//描画順
				mesh_object.renderOrder = model._coreModel.drawables.renderOrders[i];

				//マスクとマテリアルのキャッシュ
				let mask_object_cache = [];
				let mask_material_cache = [];
				//マスクされる側のメッシュで回して、マスクする側のメッシュをキャッシュ化
				let masks = model._coreModel.drawables.masks[i];
				for(let j = 0; j < masks.length; ++j){
					const id = masks[j];
					//※model.mesh_object_cacheにはまだidの参照先が入っていケースがある
					mask_object_cache.push(meshesEl[id].getObject3D("mesh"));

					let texture_ids = meshes[id].texture.textureCacheIds;
					if(!texture_cache[texture_ids[0]]){
						//テクスチャのキャッシュ
						let texture = new THREE.TextureLoader().load(texture_ids[1]);
						texture.flipY = false;
						texture_cache[texture_ids[0]] = texture;
					}
					let material = mask_material.clone();
					material.map = texture_cache[texture_ids[0]];
					mask_material_cache.push(material);
				}

				//マスクされる側のメッシュはonBefore/AfterRenderでSTENCIL_TESTを有効/無効にする
				if(mask_object_cache.length){ 
					mesh_object.onBeforeRender = function(renderer, scene, camera){ 
						//モデルの表示が重なる場合を想定してclearDepthしておく
						//→AndroidでclearDepthが重いためdepthWriteをfalseにして代替している
						//※複数体のモデルを重ねて表示する場合はclearDepthで対応する必要がある
						//renderer.clearDepth(); 

						let gl = renderer.context;
						gl.enable(gl.STENCIL_TEST);
						gl.clear(gl.STENCIL_BUFFER_BIT);
						gl.stencilFunc(gl.ALWAYS, 1, 0xffffffff);
						gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
						gl.colorMask(false, false, false, false);

						//マスクする側のメッシュのレンダリング
						for(let j = 0; j < mask_object_cache.length; ++j){
							let mask = mask_object_cache[j];
							renderer.renderBufferDirect(camera, null, mask.geometry, mask_material_cache[j], mask, null);
						}
						gl.stencilFunc(gl.EQUAL, 1, 0xffffffff);
						gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
						gl.colorMask(true, true, true, true);
					}
					mesh_object.onAfterRender = function(renderer, scene, camera){ 
						let gl = renderer.context;
						gl.disable(gl.STENCIL_TEST);
					}
				}

			}
			//描画順でソート
			scene.renderer.sortObjects = true;
		}
		//コンポーネントが更新されると呼ばれる処理
		//※毎フレーム呼ばれる処理ではないので注意
		const update = function(){  }

		const millisecond = 1 / 1000;
		//毎フレーム呼ばれる処理
		const tick = function(time, timeDelta){
			let model = this.el.model;
			let marker = this.el.marker;

			//マーカーが写っていないならモデルの更新処理はしない
			if(!marker.object3D.visible){ return; }

			const time_delta = timeDelta * millisecond;

			//視線追従モーションの更新
			let pos = this.el.object3D.getWorldPosition();
			let gaze = this.el.object3D.front.getWorldPosition();
			gaze.sub(pos);
			model.gaze = gaze;

			//ランダムでモーション再生
			let motion = model.animator.getLayer("motion");
			if(motion && motion.currentTime >= motion.currentAnimation.duration){
				let rand = Math.floor(Math.random() * model.motions.length);
				motion.stop();
				motion.play(model.motions[rand]);
			}

			//モーションの更新
			model._animator.updateAndEvaluate(time_delta);
			//物理演算の更新
			if(model._physicsRig){ model._physicsRig.updateAndEvaluate(time_delta); }
			//エンジン内の補間計算
			model._coreModel.update();

			let sortRenderOrder = false;
			let drawables = model._coreModel.drawables;
			//エンジン内で補間計算した値をメッシュに反映する
			let meshes = model.meshes;
			for(let i = 0; i < meshes.length; i++){
				let mesh = model.mesh_object_cache[i];
				let dynamic_flag = drawables.dynamicFlags[i];

				//表示/非表示
				mesh.visible = LIVE2DCUBISMCORE.Utils.hasIsVisibleBit(dynamic_flag);
				//透明度
				mesh.opacity = drawables.opacities[i];
				//頂点位置
				if(LIVE2DCUBISMCORE.Utils.hasVertexPositionsDidChangeBit(dynamic_flag)){
					let position = mesh.geometry.attributes.position;
					let src = drawables.vertexPositions[i];
					let dst = position.array;
					//※2D用の頂点情報が入っているため頂点数は（3ではなく）2で割る
					let len = src.length * 0.5; 
					for(let j = 0; j < len; j++){ 
						let s = j * 2, d = j * 3;
						dst[d + 0] = src[s + 0]; 
						dst[d + 1] = src[s + 1]; 
						dst[d + 2] = 0.0; 
					}
					position.needsUpdate = true;
				}
				//描画順
				if(LIVE2DCUBISMCORE.Utils.hasRenderOrderDidChangeBit(dynamic_flag)){ sortRenderOrder = true; }
			}
			//描画順の更新
			if(sortRenderOrder){
				model.children.sort(function(a, b){
					let aIndex = model._meshes.indexOf(a);
					let bIndex = model._meshes.indexOf(b);
					let aRenderOrder = drawables.renderOrders[aIndex];
					let bRenderOrder = drawables.renderOrders[bIndex];
					return aRenderOrder - bRenderOrder;
				});
				for(let i = 0; i < meshes.length; i++){
					let mesh = model.mesh_object_cache[i];
					mesh.renderOrder = drawables.renderOrders[i];
				}
			}
			drawables.resetDynamicFlags();

			//テキストの文字送り
			let message = model.message;
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
		}
		//コンポーネントの登録
		AFRAME.registerComponent("live2d", { "init":init, "update":update, "tick":tick });
	}

	//クリックイベント
	const click_event = function(e){
		markers.forEach(function(marker){
			marker.forEach(function(model){

				//モーションの再生
				let motion = model.animator.getLayer("motion");
				if(motion && model.click_motion){
					motion.stop();
					motion.play(model.click_motion);
				}

				//テキストが文末に来ていたら、次のテキストを表示
				let message = model.message;
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
