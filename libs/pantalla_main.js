var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation, spinner, texto_cargando;
var pantalla, callback;
var menu, hub;

function init(_pantalla, _callback) {
	pantalla = _pantalla;
	callback = _callback;
	canvas = document.getElementById("canvas");
	anim_container = document.getElementById("animation_container");
	dom_overlay_container = document.getElementById("dom_overlay_container");
	spinner = document.getElementById("spinner");
	texto_cargando = document.getElementById('texto_cargando');

	images = images||{};
	ss = ss||{};
	var loader = new createjs.LoadQueue(false);
	loader.installPlugin(createjs.Sound);
	loader.addEventListener("fileload", handleFileLoad);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(lib.properties.manifest);

}
function handleFileLoad(evt) {
	if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
}
function handleComplete(evt) {
	document.getElementById('loader').style.display = 'none';

	//This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
	var queue = evt.target;
	var ssMetadata = lib.ssMetadata;
	for(i=0; i<ssMetadata.length; i++) {
		ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
	}

	exportRoot = new lib["pantalla" + pantalla ]();

	if(!stage) {
		hub = exportRoot;
		stage = new createjs.Stage(canvas);

		//Registers the "tick" event listener.
		fnStartAnimation = function () {
			createjs.Ticker.setFPS(lib.properties.fps);
			createjs.Ticker.addEventListener("tick", stage);
		}

		handleResize();

		fnStartAnimation();
	}

	stage.addChildAt(exportRoot,0);
	stage.enableMouseOver();

	if(callback)
	{
		callback();
	}
}
function playSound(id, loop) {

	$(' <audio autoplay preload="auto" id="audio"><source src="sounds/'+id+'.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio> ').insertAfter($('#canvas'));

}
