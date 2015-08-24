var context = new AudioContext(),
irHall = new reverbObject('irHall.ogg');

$(function() {
	$('#sp div').each(function() {
		addAudioProperties(this);
	});

	$('#sp div').click(function() {
		this.play();
	});

	$('#cp input').change(function() {
		var v = $(this).parent().data('pad'),
			pad = $('#' + v)[0];
		switch ($(this).data('control')) {
			case 'gain':
				pad.volume.gain.value = $(this).val();
				break;
			default:
				break;
		}
	});

	$('#cp button').click(function() {
		var v = $(this).parent().data('pad'),
		toggle = $(this).text(),
		pad = $('#' + v)[0];
		$(this).text($(this).data('toggleText')).data('toggleText', toggle);
		($(this).val() === 'false') ? $(this).val('true') : $(this).val('false');

			switch ($(this)[0].className) {
				case 'loop-button':
				pad.stop();
				pad.loop = ($(this).val() === 'false') ? false : true;
					break;
				case 'reverb-button':
					pad.stop();
					pad.reverb = ($(this).val() === 'false') ? false : true;
					break;
				default:
					break;
			}
	})

});

function loadAudio(object, url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			object.buffer = buffer;
		});
	}
	request.send();
}

function addAudioProperties(object) {
	object.name = object.id;
	object.source = $(object).data('sound');
	loadAudio(object, object.source);
	object.volume = context.createGain();
	object.loop = false;
	object.reverb = false;
	object.play = function() {
		var s = context.createBufferSource();
		s.buffer = object.buffer;
		s.connect(object.volume);
		if (this.reverb === true) {
			this.convolver = context.createConvolver();
			this.convolver.buffer = irHall.buffer;
			this.volume.connect(this.convolver);
			this.convolver.connect(context.destination);
		} else if (this.convolver) {
			this.volume.disconnect(0);
			this.convolver.disconnect(0);
			this.volume.connect(context.destination);
		} else {
			this.volume.connect(context.destination);
		}
		s.loop = object.loop;
		s.start(0);
		object.s = s;
	}
	object.stop = function() {
		if(object.s) object.s.stop();
	}
}

function reverbObject(url) {
	this.source = url;
	loadAudio(this, url);
}









