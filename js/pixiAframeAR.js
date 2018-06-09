//////////////////////////////////////////////////////////////////////
//���ݒ荀�ڂ������火
//////////////////////////////////////////////////////////////////////

//FPS��\������ꍇ��true�A�\�����Ȃ��ꍇ��false
const show_fps = true;

//�}�[�J�[�ɑ΂��ă��f���𐂒��ɗ�������Ƃ���true�A���s�ɐQ������Ƃ���false
const stand_mode = false;

//���f�����Ƃ̐ݒ�
const koharu = {
	"model":{ "model3":"assets/Koharu/Koharu.model3.json" }, 
	"position":{ "x":0.5, "y":0.5}, //�v���[�����̈ʒu�B���E�����Ƃ��ɒ�����0.5
	"scale":{ "w":0.8, "h":0.8}, //1.0���ƃ��[�V��������ł͂ݏo���̂Œ���
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
	"position":{ "x":0.5, "y":0.5}, //�v���[�����̈ʒu�B���E�����Ƃ��ɒ�����0.5
	"scale":{ "w":0.8, "h":0.8}, //1.0���ƃ��[�V��������ł͂ݏo���̂Œ���
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

/*
//��̃v���[����ɕ\�����郂�f���̃O���[�v
const model_group = { "koharu":koharu, "haruto":haruto };
//��̃}�[�J�[��ɕ\������v���[���̃O���[�v
const plane_group = { 
	"plane":{ 
		"moedl_group":model_group1, 
		"position":{ "x":0.0, "y":0.0, "z":0.0 }, 
		"size":{ "w":0.5, "h":0.5 }, 
	}
};
//��̃A�v����ɕ\������}�[�J�[�̃O���[�v
const marker_group = { 
	"marker":{ "plane_group":plane_group, "id":"logo" } 
};
*/

const model_group1 = { "koharu":koharu };
const model_group2 = { "haruto":haruto };
const plane_group1 = { 
	"plane1":{ 
		"moedl_group":model_group1, 
		"position":{ "x":0.0, "y":0.0, "z":0.0 }, 
		"scale":{ "w":3, "h":3 }, //1�Ń}�[�J�[�̍��g�Ɠ����T�C�Y
	}
};
const plane_group2 = { 
	"plane1":{ 
		"moedl_group":model_group2, 
		"position":{ "x":0.0, "y":0.0, "z":0.0 }, 
		"scale":{ "w":3, "h":3 }, //1�Ń}�[�J�[�̍��g�Ɠ����T�C�Y
	}
};
const marker_group = { 
//	"marker1":{ "plane_group":plane_group1, "id":"qr" }, 
	"marker2":{ "plane_group":plane_group2, "id":"logo" }, 
};

//////////////////////////////////////////////////////////////////////
//���ݒ荀�ڂ����܂Ł�
//////////////////////////////////////////////////////////////////////

window.onload = function(){
	//�J�����̎擾
	//��a-marker-camera�̓}�[�J�[���J��������O�ꂽ����\�����c��̂Œ���
	let camera = document.querySelector("a-entity[camera]");
	if(!camera){ camera = document.querySelector("a-marker-camera"); }
	camera = camera.components.camera.camera;

	//�}�[�J�[
	let markers = [];

	//���f���̓ǂݍ��݁�Pixi�̐ݒ聨A-Frame�̐ݒ�A�̏��Ԃɏ�������
	//���O�i�̏������I���܂Ō�i�̏�����Promise�ő҂�����
	loadModels().then(setupAFrame);

	function loadModels(){
		const xhrType = { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON };
		const animation = LIVE2DCUBISMFRAMEWORK.Animation;
		const override = LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE;

		//�ʏ펞�ɍĐ����郂�[�V�����̐ݒ�
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
		//�N���b�N���ɍĐ����郂�[�V�����̐ݒ�
		const setClickMotion = function(model, resources, click_motion){
			//���������B�ŏ��̃��[�V�����Ō��ߑł�
			const data = resources[click_motion[0]].data;
			model.click_motion = animation.fromMotion3Json(data);
		}
		//�����Ǐ]�p�̃��[�V�����̐ݒ�
		const setGazeMotion = function(model, resources, normal_motion){
			//���K���ȃ��[�V�����f�[�^�̕s�v�ȕϐ�����ɂ��āA�����Ǐ]�p�̃��[�V�����f�[�^�����
			let data = resources[normal_motion[0]].data;
			data.CurveCount = data.TotalPointCount = data.TotalSegmentCount = 0;
			data.Curves = [];
			const gaze_motion = animation.fromMotion3Json(data);
			model.animator.addLayer("gaze", override, 1);
			model.animator.getLayer("gaze").play(gaze_motion);

			//�����Ǐ]���[�V�����̃p�����[�^�l�X�V
			model.gaze = new THREE.Vector3();
			const ids = model.parameters.ids;
			//��2�n��3�n�ɑΉ����邽��max�����B�Y�����Ȃ��o�[�W������indexOf��-1��Ԃ�
			//���p�����[�^���̂������ꍇ�̓G���[�ɂȂ�̂Œ���
			const angle_x = Math.max(ids.indexOf("ParamAngleX"), ids.indexOf("PARAM_ANGLE_X"));
			const angle_y = Math.max(ids.indexOf("ParamAngleY"), ids.indexOf("PARAM_ANGLE_Y"));
			const eye_x = Math.max(ids.indexOf("ParamEyeBallX"), ids.indexOf("PARAM_EYE_BALL_X"));
			const eye_y = Math.max(ids.indexOf("ParamEyeBallY"), ids.indexOf("PARAM_EYE_BALL_Y"));
			gaze_motion.evaluate = (time, weight, blend, target, stackFlags, groups) => {
				//���������[�h�̂Ƃ��͏c�����ő傫���l������̂Œ�������
				if(stand_mode){ model.gaze.y *= 0.1; }
				//�p�����[�^�̌��ݒl�A�ő�l�A�ŏ��l
				const values = target.parameters.values;
				const max = target.parameters.maximumValues;
				const min = target.parameters.minimumValues;
				//�����̏c�����A���������ꂼ�ꐳ�Ȃ�ő�l���A���Ȃ�ŏ��l������l���擾����
				const angle_h = model.gaze.x > 0 ? max[angle_x] : -min[angle_x];
				const angle_v = model.gaze.y > 0 ? max[angle_y] : -min[angle_y];
				const eye_h = model.gaze.x > 0 ? max[eye_x] : -min[eye_x];
				const eye_v = model.gaze.y > 0 ? max[eye_y] : -min[eye_y];
				//�ŏI�I�ȃp�����[�^�l���v�Z����
				values[angle_x] = blend(values[angle_x], model.gaze.x * angle_h, 0, weight);
				values[angle_y] = blend(values[angle_y], model.gaze.y * angle_v, 0, weight);
				values[eye_x] = blend(values[eye_x], model.gaze.x * eye_h, 0, weight);
				values[eye_y] = blend(values[eye_y], model.gaze.y * eye_v, 0, weight);
			}
		}

		//���f���̓ǂݍ���
		const loadModel = function(config, models){
			let p = new Promise(function(resolve, reject){
				const loader = new PIXI.loaders.Loader();
				//model3.json�̃L�[�ƃp�X��ǉ�
				const model_key = Object.keys(config["model"])[0];
				loader.add(model_key, config["model"][model_key], xhrType);
				//motion3.json�̃L�[�ƃp�X��ǉ�
				for(let key in config["motion"]){ loader.add(key, config["motion"][key], xhrType); }

				//���\�[�X�̓ǂݍ���
				const loadResources = function(loader, resources){
					//���[�V�����̐ݒ�
					const setMotion = function(model){ 
						if(model == null){ reject(); }

						setNormalMotion(model, resources, config["normal_motion"]);
						setClickMotion(model, resources, config["click_motion"]);
						setGazeMotion(model, resources, config["normal_motion"]);

						//���f���̈ʒu�A�T�C�Y
						model.position_x = config["position"]["x"];
						model.position_y = config["position"]["y"];
						model.scale_x = config["scale"]["w"];
						model.scale_y = config["scale"]["h"];
						models.push(model);

						resolve();
					}
					//���f���̍\�z
					const builder = new LIVE2DCUBISMPIXI.ModelBuilder();
					builder.buildFromModel3Json(loader, resources[model_key], setMotion);
				}
				loader.load(loadResources);
			});
			return p;
		}

		let p = [];
		//�}�[�J�[�̐������J��Ԃ�
		for(marker_key in marker_group){
			let marker = marker_group[marker_key];
			let planes = [];
			//�v���[���̐������J��Ԃ�
			for(plane_key in marker["plane_group"]){
				let plane = marker["plane_group"][plane_key];
				let models = [];
				//���f���̐������J��Ԃ�
				for(model_key in plane["moedl_group"]){
					let model = plane["moedl_group"][model_key];
					//���f���̓ǂݍ���
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
	//DOM�̐ݒ�
	function setupDOM(){
		markers.forEach(function(marker){
			//�}�[�J�[�̍쐬
			const id = marker.id;
			let markerEl = document.querySelector("a-marker#" + id);
			if(!markerEl){ markerEl = document.querySelector("a-marker-camera#" + id); }

			marker.forEach(function(plane){
				//�v���[���̍쐬
				let planeEl = document.createElement("a-plane");
				planeEl.setAttribute("plane", "");
				planeEl.setAttribute("color", "#000");
				planeEl.setAttribute("width", plane.scale_w);
				planeEl.setAttribute("height", plane.scale_h);
				//�}�[�J�[����ɂ������f���̑��Έʒu�̎w��
				let position = plane.position_x + " " + plane.position_y + " " +plane.position_z;
				planeEl.setAttribute("position", position);
				//�����t���O�������Ă�����X����-90�x��]
				const stand = stand_mode ? "0 0 0" : "-90 0 0";
				planeEl.setAttribute("rotation", stand);

				//���ʕ����̔���p�I�u�W�F�N�g�̍쐬
				planeEl.object3D.front = new THREE.Object3D();
				planeEl.object3D.front.position.set(0, 0, -1);
				planeEl.object3D.add(planeEl.object3D.front);

				//�}�[�J�[�Ƀv���[����R�t��
				markerEl.appendChild(planeEl);
				//�v���[�����m��R�t��
				planeEl.plane = plane;
				//�v���[���Ƀ}�[�J�[��R�t��
				planeEl.marker = markerEl;
			});
		});
	}
	//A-Frame�̐ݒ�
	function setupAFrame(){
		//DOM�̐ݒ�
		setupDOM();

		//�R���|�[�l���g�������������ƌĂ΂�鏈��
		const init = function(){
			let scene = this.el.sceneEl;
			let plane = this.el.plane;

			let context = scene.renderer.context;
			let canvas = this.el.sceneEl.canvas;
			let power = "high-performance";
//			let options = { backgroundColor: 0x1099bb };
//			let options = { transparent: true, powerPreference: power };
			let options = { context: context, canvas: canvas, transparent: true, powerPreference: power };

			//Pixi�̐ݒ�
			plane.app = new PIXI.Application(0, 0, options);
			plane.app.stage.renderable = false;
			//Pixi�̕ό`�p�R���e�i��ǉ�
			let container2d = new PIXI.projection.Container2d();
			plane.app.stage.addChild(container2d);
			plane.app.stage.container2d = container2d;

			//���f���̕R�t��
			plane.forEach(function(model){
				container2d.addChild(model)
				container2d.addChild(model.masks)
			});

			//�X�V����
			const ticker = function(delta_time){
				plane.forEach(function(model){
					model.update(delta_time);
					model.masks.update(plane.app.renderer);
				});

			}
			//�X�V�����̕R�t��
			plane.app.ticker.add(ticker);

			//�e�N�X�`���̍쐬
			let texture = new THREE.Texture(plane.app.view);
			texture.premultiplyAlpha = true;
			//�}�e���A���̍쐬
			let material = new THREE.MeshStandardMaterial({});
			material.map = texture;
			material.metalness = 0;
			material.premultipliedAlpha = true;
			material.transparent = true;
			//���b�V���̕R�t��
			mesh = this.el.getObject3D("mesh");
			mesh.material = material;

			mesh.renderOrder = 999;
			//�`��̑O����
			mesh.onBeforeRender = function(renderer){
				//TODO:renderer.state.reset()����ƕ������f���̕\�����ł��Ȃ��Ȃ�
				plane.app.renderer.reset();
				renderer.state.reset();
				//���f���̕\�����d�Ȃ�ꍇ��z�肵�ăf�v�X���N���A���Ă���
				renderer.clearDepth();
			}
			//�`��̌㏈��
			mesh.onAfterRender = function(renderer){
				renderer.state.reset();
				plane.app.renderer.reset();
			}

			//���b�V���̕R�t��
			plane.mesh = mesh;
		}
		//�R���|�[�l���g���X�V�����ƌĂ΂�鏈��
		//�����t���[���Ă΂�鏈���ł͂Ȃ��̂Œ���
		const update = function(){
			let plane = this.el.plane;
			let scene = this.el.sceneEl;
			plane.app.view.width = scene.clientWidth;
			plane.app.view.height = scene.clientHeight;
			plane.app.renderer.resize(scene.clientWidth, scene.clientHeight);

			//TODO�F���o�C���ŉ�ʑS�̂ƈ�v���Ȃ�
			const w = scene.clientWidth, h = scene.clientHeight;
			plane.forEach(function(model){
				model.position = new PIXI.Point(w * model.position_x, h * model.position_y);
				model.scale = new PIXI.Point(w * model.scale_x, w * model.scale_y);
				model.masks.resize(plane.app.view.width, plane.app.view.height);
			});
		}
		//���t���[���Ă΂�鏈��
		const tick = function(time, timeDelta){
			let plane = this.el.plane;
			let scene = this.el.sceneEl;

			if((plane.app.view.width != scene.clientWidth) || 
				(plane.app.view.height != scene.clientHeight)){
				this.update();
			}

			const world = plane.mesh.matrixWorld;
			const vertices = plane.mesh.geometry.attributes.position.array;
			let lt = new THREE.Vector3(vertices[0],  vertices[1],  vertices[2]);
			let lb = new THREE.Vector3(vertices[3],  vertices[4],  vertices[5]);
			let rt = new THREE.Vector3(vertices[6],  vertices[7],  vertices[8]);
			let rb = new THREE.Vector3(vertices[12], vertices[13], vertices[14]);
			lt = lt.applyMatrix4(world).project(camera);
			lb = lb.applyMatrix4(world).project(camera);
			rt = rt.applyMatrix4(world).project(camera);
			rb = rb.applyMatrix4(world).project(camera);
			const half_w = scene.clientWidth * 0.5;
			const half_h = scene.clientHeight * 0.5;

			//TODO�F�΂߂��猩��ƃA�X�䂪�Y����B���̂����肪���₵���H
			const rect = [
				{ x:rt.x * half_w + half_w, y:rt.y * -half_h + half_h }, 
				{ x:lt.x * half_w + half_w, y:lt.y * -half_h + half_h }, 
				{ x:lb.x * half_w + half_w, y:lb.y * -half_h + half_h }, 
				{ x:rb.x * half_w + half_w, y:rb.y * -half_h + half_h }, 
			];
			plane.app.stage.container2d.proj.mapQuad(plane.app.screen, rect);

			let marker = this.el.marker;
			if(marker.object3D.visible){
				//��ʂ���]��������i�����f���̕\���ʒu������Ă���j�łȂ��Ȃ�`�悷��
				if(!orientationchanged){ plane.app.stage.renderable = true; }

				let pos = this.el.object3D.getWorldPosition();
				let gaze = this.el.object3D.front.getWorldPosition();
				gaze.sub(pos);
				plane.forEach(function(model){
					//�����Ǐ]���[�V�����̍X�V
					model.gaze = gaze;

					//�����_���Ń��[�V�����Đ�
					let motion = model.animator.getLayer("motion");
					if(motion && motion.currentTime >= motion.currentAnimation.duration){
						let rand = Math.floor(Math.random() * model.motions.length);
						motion.stop();
						motion.play(model.motions[rand]);
					}
				});
			}else{
				//�}�[�J�[���O�ꂽ��`����~�߂�
				plane.app.stage.renderable = false;
				//�}�[�J�[���O�ꂽ���ʂ̉�]�t���O��܂�
				//���}�[�J�[�̍Č��o���Ƀ��f���̕\���ʒu���C������邽��
				orientationchanged = false;
			}
		}
		//�R���|�[�l���g�̓o�^
		AFRAME.registerComponent("plane", { "init":init, "update":update, "tick":tick });

	}

	const click_event = function(e){
		//�N���b�N���[�V�����̍Đ�
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

	//��ʂ̉�]�t���O
	//TODO:�t���O�̓v���[�����ƂɎ�������K�v���������H
	let orientationchanged = false;
	const rotate_event = function(e){
		if(e === void 0){ e = null; }
		//��ʂ���]����ƃ��f���̕\���ʒu������邽�ߕ`����~�߂�
		markers.forEach(function(marker){
			marker.forEach(function(plane){
				plane.app.stage.renderable = false;
			});
		});
		//��ʂ̉�]�t���O�𗧂Ă�
		orientationchanged = true;
	}

	//PC�ƃX�}�z�̑I���C�x���g�̐U�蕪��
	if(window.ontouchstart === undefined){
		window.onclick = click_event;
	}else{
		window.ontouchstart = click_event;
		window.onorientationchange = rotate_event;
	}
}

//FPS�̕\��
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
