PIXI.loader.add('moc', "assets/Miku/Miku.moc3", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
PIXI.loader.add('texture0', "assets/Miku/Miku_00.png");
PIXI.loader.add('motion', "assets/Miku/Miku_08.motion3.json", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
PIXI.loader.add('physics', "assets/Miku/Miku.physics3.json");
PIXI.loader.once('complete', onComplate);
PIXI.loader.load();
/*
PIXI.loader.add('moc', "assets/Hiyori/Hiyori.moc3", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
PIXI.loader.add('texture0', "assets/Hiyori/Hiyori_00.png");
//���e�N�X�`�����������̏ꍇ�͈ȉ��̍s��ǉ����Ă���
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
	//���f���̍\�z
	var moc = LIVE2DCUBISMCORE.Moc.fromArrayBuffer(resources['moc'].data);
	var builder = new LIVE2DCUBISMPIXI.ModelBuilder().setMoc(moc).setTimeScale(1);
	builder.addTexture(0, resources['texture0'].texture);
	//���e�N�X�`�����������̏ꍇ�͈ȉ��̍s��ǉ����Ă���
//	builder.addTexture(1, resources['texture1'].texture);
	builder.addAnimatorLayer("base", LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE, 1)
	var model = builder.build();
	//�A�j���[�V�����̓o�^
	var animation = LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(resources['motion'].data);
	model.animator.getLayer("base").play(animation);

	//���f���𒣂�t���镽�ʂ̐ݒ�
	var plane = document.createElement('a-plane');
	plane.setAttribute('model1', '');
	//�}�[�J�[����ɂ������f���̑��Έʒu
	plane.setAttribute('position', '0 0 0');
	//���f���̊m�x�B�}�[�J�[�Ɛ����Ȃ�'0 0 0'�A�����Ȃ�'-90 0 0'
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

			//THREE�̃R���e�L�X�g��n����PIXI������������
			//TODO:PIXI.Application��PIXI.autoDetectRenderer���s�v
			app = new PIXI.Application(0, 0, { antialias: false,context: scene.renderer.context, transparent: true, powerPreference: "high-performance" });

			//PIXI�̃R���e�i�Ƀ��f����o�^
			app.stage.addChild(model);
			app.stage.addChild(model.masks);
			app.stage.renderable = false;

			//�}�e���A���̍쐬
			var scale = "3.0"; //TODO:uniform�ő���
			var vertex_shader = "uniform vec2 u_scale; varying vec2 v_uv; void main(){ v_uv = uv; vec4; gl_Position = projectionMatrix * modelViewMatrix * vec4(position * " + scale + ", 1.0); }";
			var fragment_shader = "uniform sampler2D texture; varying vec2 v_uv; void main(){ vec4 tex = texture2D(texture, v_uv); gl_FragColor = tex; }";
			//TODO:�e�N�X�`���̎w�肪�璷�BPIXI�������������
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

			//TODO:tick()�Ɠ�������
			app.ticker.add(function (deltaTime) {
				model.update(deltaTime);
				model.masks.update(app.renderer);
			});
		},
		update: function(){
		},
		tick: function (time, timeDelta) {
			if(marker.object3D.visible){
				//��ʂ���]��������i�����f���̕\���ʒu������Ă���j�łȂ��Ȃ�`�悷��
				if(!orientationchanged){ app.stage.renderable = true; }
			}else{
				//�}�[�J�[���O�ꂽ��`����~�߂�
				app.stage.renderable = false;
				//�}�[�J�[���O�ꂽ���ʂ̉�]�t���O��܂�
				//���}�[�J�[�̍Č��o���Ƀ��f���̕\���ʒu���C������邽��
				orientationchanged = false;
			}
		}
	});

	window.onorientationchange = function (event) {
		if (event === void 0) { event = null; }
		//��ʂ���]����ƃ��f���̕\���ʒu������邽�ߕ`����~�߂�
		app.stage.renderable = false;
		//��ʂ̉�]�t���O�𗧂Ă�
		orientationchanged = true;
	};
}

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

