window.onload = function () {
	//�}�[�J�[�ɑ΂��Ă̒����t���O
	var stand_mode = false;

	var marker = document.querySelector('a-marker');
	if(!marker){ marker = document.querySelector('a-marker-camera'); }

	var camera = document.querySelector("a-entity[camera]");
	if(!camera){ camera = document.querySelector("a-marker-camera"); }
	camera = camera.components.camera.camera;

	var models = [];
	loadAssets().then(addModel).then(addPlane);

	function loadAssets() {
		//���[�V�����̐ݒ�
		function setMotion(model, resources, x, y, resolve, reject){
			if (model == null){ reject(); }

			//��{���[�V����
			var motions = [];
			var animation = LIVE2DCUBISMFRAMEWORK.Animation;
			var override = LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE;
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
			//�����_���Ń��[�V�����Đ�
			var rand = Math.floor(Math.random() * model.motions.length);
			model.animator.getLayer("motion").play(model.motions[rand]);

			//�N���b�N���[�V����
			var data = resources['motion1'].data;
			model.click_motion = animation.fromMotion3Json(data);

			//�����Ǐ]���[�V����
			data.CurveCount = data.TotalPointCount = data.TotalSegmentCount = 0;
			data.Curves = [];
			var gaze_motion = animation.fromMotion3Json(data);
			model.animator.addLayer("gaze", override, 1);
			model.animator.getLayer("gaze").play(gaze_motion);

			//�����Ǐ]���[�V�����̃p�����[�^�l�X�V
			model.gaze = new THREE.Vector3();
			var ids = model.parameters.ids;
			var angle_x = Math.max(ids.indexOf("ParamAngleX"), ids.indexOf("PARAM_ANGLE_X"));
			var angle_y = Math.max(ids.indexOf("ParamAngleY"), ids.indexOf("PARAM_ANGLE_Y"));
			var eye_x = Math.max(ids.indexOf("ParamEyeBallX"), ids.indexOf("PARAM_EYE_BALL_X"));
			var eye_y = Math.max(ids.indexOf("ParamEyeBallY"), ids.indexOf("PARAM_EYE_BALL_Y"));
			gaze_motion.evaluate = (time, weight, blend, target, stackFlags, groups) => {
				if(stand_mode){ model.gaze.y *= 0.1; }
				var values = target.parameters.values;
				var max = target.parameters.maximumValues;
				var min = target.parameters.minimumValues;
				var angle_h = model.gaze.x > 0 ? max[angle_x] : -min[angle_x];
				var angle_v = model.gaze.y > 0 ? max[angle_y] : -min[angle_y];
				var eye_h = model.gaze.x > 0 ? max[eye_x] : -min[eye_x];
				var eye_v = model.gaze.y > 0 ? max[eye_y] : -min[eye_y];
				values[angle_x] = blend(values[angle_x], model.gaze.x * angle_h, 0, weight);
				values[angle_y] = blend(values[angle_y], model.gaze.y * angle_v, 0, weight);
				values[eye_x] = blend(values[eye_x], model.gaze.x * eye_h, 0, weight);
				values[eye_y] = blend(values[eye_y], model.gaze.y * eye_v, 0, weight);
			}

			//�L�����o�X���̃��f���̈ʒu
			model.pos_x = x;
			model.pos_y = y;

			models.push(model);
			resolve();
		}
		//�A�Z�b�g�̓ǂݍ���
		var xhrType = { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON };
		var p1 = new Promise(function (resolve, reject) {
			var loader = new PIXI.loaders.Loader();
			loader.add('model3', "assets/Koharu/Koharu.model3.json", xhrType);
			loader.add('motion1', "assets/Koharu/Koharu_01.motion3.json", xhrType);
			loader.add('motion2', "assets/Koharu/Koharu_02.motion3.json", xhrType);
			loader.add('motion3', "assets/Koharu/Koharu_03.motion3.json", xhrType);
			loader.add('motion4', "assets/Koharu/Koharu_04.motion3.json", xhrType);
			loader.add('motion5', "assets/Koharu/Koharu_05.motion3.json", xhrType);
			loader.add('motion6', "assets/Koharu/Koharu_06.motion3.json", xhrType);
			loader.add('motion7', "assets/Koharu/Koharu_07.motion3.json", xhrType);
			loader.add('motion8', "assets/Koharu/Koharu_08.motion3.json", xhrType);
			loader.add('motion9', "assets/Koharu/Koharu_09.motion3.json", xhrType);
			loader.load(function (loader, resources) {
				var builder = new LIVE2DCUBISMPIXI.ModelBuilder();
				builder.buildFromModel3Json(loader, resources['model3'], complate);
				function complate(model){ setMotion(model, resources, 0.5, 0.5, resolve, reject); }
			});
		});
		var p2 = new Promise(function (resolve, reject) {
			var loader = new PIXI.loaders.Loader();
			loader.add('model3', "assets/Haruto/Haruto.model3.json", xhrType);
			loader.add('motion1', "assets/Haruto/Haruto_01.motion3.json", xhrType);
			loader.add('motion2', "assets/Haruto/Haruto_02.motion3.json", xhrType);
			loader.add('motion3', "assets/Haruto/Haruto_03.motion3.json", xhrType);
			loader.add('motion4', "assets/Haruto/Haruto_04.motion3.json", xhrType);
			loader.add('motion5', "assets/Haruto/Haruto_05.motion3.json", xhrType);
			loader.add('motion6', "assets/Haruto/Haruto_06.motion3.json", xhrType);
			loader.add('motion7', "assets/Haruto/Haruto_07.motion3.json", xhrType);
			loader.add('motion8', "assets/Haruto/Haruto_08.motion3.json", xhrType);
			loader.add('motion9', "assets/Haruto/Haruto_09.motion3.json", xhrType);
			loader.load(function (loader, resources) {
				var builder = new LIVE2DCUBISMPIXI.ModelBuilder();
				builder.buildFromModel3Json(loader, resources['model3'], complate);
				function complate(model){ setMotion(model, resources, 0.5, 0.5, resolve, reject); }
			});
		});
		return Promise.all([p1, p2]);
	}
	function addModel() {
		//���f���̓o�^
		var p = new Promise(function (resolve, reject) {
			models.forEach(function(model){
				model.app = new PIXI.Application(0, 0, { transparent: true });
//				model.app = new PIXI.Application(0, 0, { backgroundColor: 0x1099bb });
				model.app.stage.addChild(model);
				model.app.stage.addChild(model.masks);
				model.app.stage.renderable = false;
				model.app.ticker.add(function (deltaTime) {
					model.update(deltaTime);
					model.masks.update(model.app.renderer);
				});
			});
			resolve();
		});
		return Promise.all([p]);
	}
	function addPlane() {
		models.forEach(function(model, index){
			var stand = stand_mode ? '0 0 0' : '-90 0 0';
			var plane = document.createElement('a-plane');
			plane.setAttribute('plane', '');
			plane.setAttribute('id', index);
			plane.setAttribute('color', '#000');
			plane.setAttribute('height', '3');
			plane.setAttribute('width', '3');
			//�}�[�J�[����ɂ������f���̑��Έʒu
if(index == 1){
			plane.setAttribute('position', '1 0.1 0');
}else{
			plane.setAttribute('position', '-1 0 0');
}
//			plane.setAttribute('position', '0 0 0');
			plane.setAttribute('rotation', stand);
			plane.object3D.front = new THREE.Object3D();
			plane.object3D.front.position.set(0, 0, -1);
			plane.object3D.add(plane.object3D.front);
			//���f�����v���[���ɕR�t��
			plane.model = model;
			//�v���[�����}�[�J�[�ɒǉ�
			marker.appendChild(plane);
		});

		var init = function () {
			var model = this.el.model;
			var texture = new THREE.Texture(model.app.view);
			texture.premultiplyAlpha = true;

			var material = new THREE.MeshStandardMaterial();
			material.map = texture;
			material.metalness = 0;
			material.premultipliedAlpha = true;
			material.transparent = true;

			var mesh = this.el.getObject3D('mesh');
			mesh.material = material;
			model.mesh = mesh;
		}
		var update = function(){
			var width = 512, height = 512;
			var model = this.el.model;
			model.app.view.width = width + "px";
			model.app.view.height = height + "px";
			model.app.renderer.resize(width, height);
			model.position = new PIXI.Point(width * model.pos_x, height * model.pos_y);
			model.scale = new PIXI.Point(width * 0.7, width * 0.7);
			model.masks.resize(model.app.view.width, model.app.view.height);
			model.mesh.material.map.needsUpdate = true;
		}
		var tick = function (time, timeDelta) {
			var model = this.el.model;
			if(marker.object3D.visible){
//if(this.el.id == 1){return;}
				//��ʂ���]��������i�����f���̕\���ʒu������Ă���j�łȂ��Ȃ�`�悷��
				if(!orientationchanged){ model.app.stage.renderable = true; }
				model.mesh.material.map.needsUpdate = true;

				var pos = this.el.object3D.getWorldPosition();
				var gaze = this.el.object3D.front.getWorldPosition();
				gaze.sub(pos);

				//�����Ǐ]���[�V�����̍X�V
				model.gaze = gaze;

				//�����_���Ń��[�V�����Đ�
				var motion = model.animator.getLayer("motion");
				if(motion && motion.currentTime >= motion.currentAnimation.duration){
					var rand = Math.floor(Math.random() * model.motions.length);
					motion.stop();
					motion.play(model.motions[rand]);
				}
			}else{
				//�}�[�J�[���O�ꂽ��`����~�߂�
				model.app.stage.renderable = false;
				//�}�[�J�[���O�ꂽ���ʂ̉�]�t���O��܂�
				//���}�[�J�[�̍Č��o���Ƀ��f���̕\���ʒu���C������邽��
				orientationchanged = false;
			}
		}
		AFRAME.registerComponent('plane', {
			init: init,
			update: update,
			tick: tick
		});
	}

	//��ʂ����������Ƃ��̏���
	var click_event = function (e) {
		//�N���b�N���[�V�����̍Đ�
		models.forEach(function(model){ 
			var motion = model.animator.getLayer("motion");
			if(motion && model.click_motion){
				motion.stop();
				motion.play(model.click_motion);
			}
		});
	}
	//PC�ƃX�}�z�őI���C�x���g��U�蕪��
	if(window.ontouchstart === undefined){
		window.onclick = click_event;
	}else{
		window.ontouchstart = click_event;
	}

	//��ʂ���]�����Ƃ��̏���
	var orientationchanged = false;
	window.onorientationchange = function (e) {
		if (e === void 0) { e = null; }
		//��ʂ���]����ƃ��f���̕\���ʒu������邽�ߕ`����~�߂�
		models.forEach(function(model){ 
			model.app.stage.renderable = false;
		});
		//��ʂ̉�]�t���O�𗧂Ă�
		orientationchanged = true;
	}
};

//FPS�̕\��
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

