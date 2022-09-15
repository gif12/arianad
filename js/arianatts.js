window.onload = function(){
	document.getElementById("text").value = "";
	var myAudio = document.getElementById('player');
	refreshCaptcha();
}

function playToggle() {
	var valid;	
	valid = validateContact();
	if(valid) {
		artext = document.getElementById("text").value;
		textBoxText = artext.trim();
		if (textBoxText == '')
			return;
			
		if (!(textBoxText.substring(textBoxText.length - 1) == ".")) {
			textBoxText = textBoxText + ".";
		}
		var captcha = $('#captcha').prop("value");
		var pitch = $('#Pitchi').prop("value");
		var tone = $('#Tonei').prop("value"); 
		var speed = $('#Speedi').prop("value");
		var gain = $('#Voli').prop("value");
		var speaker = $('input[name=speaker]:checked', '#formMain').val();
		var punc = $('#puncState').is(':checked') ? "3": "2";
		
		jQuery.ajax({
		    type: "POST",
		    ContentType: "application/json; charset=UTF-8",
		    dataType: "json",
		    data: {text: textBoxText, speaker: speaker, volume: gain, pitch: pitch, speed: speed, tone: tone,captcha: captcha},
		    url: 'tts.php',
		    complete: function(jdata) {
		        var data = jdata.responseText;
			if (data=="CAPTCHAERR"){
				jQuery("#win8").css('display', 'none');
				$("#captcha-info").html("The entered security code is not correct!");
				document.getElementById("captcha").value = "";
			}
			else{
				$("#captcha-info").html("");
				document.getElementById("captcha").value = "";
				var raw = atob(data);
			    	var rawLength = raw.length;
			    	var array = new Uint8Array(new ArrayBuffer(rawLength));
			        for(i = 0; i < rawLength; i++) {
			            array[i] = raw.charCodeAt(i);
			        }
			        var blobBuffer = new Blob([array], {type:"audio/mpeg"});
					var blobUrl = window.URL.createObjectURL(blobBuffer);
					loadAudio(blobUrl);
					jQuery("#win8").css('display', 'none');
			}

		    }
		});
		jQuery("#win8").css('display', 'block');
	}
}

function CheckRecaptcha(SessVal) {
	var inputed = document. getElementById('captcha_code').value;
	autCaptcha(inputed);
}

function autCaptcha(inputedcap){
	var xmlhttpAutMob;
	if (window.XMLHttpRequest)
	  {
	  	xmlhttpAutMob=new XMLHttpRequest();
	  }
	else
	  {
	 	xmlhttpAutMob=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttpAutMob.open("POST","http://farsireader.com/webdemoen/checkCaptcha.php",true);
	xmlhttpAutMob.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttpAutMob.send("InputedCaptcha="+inputedcap);
	xmlhttpAutMob.onreadystatechange=function()
	  {
	  	if (xmlhttpAutMob.readyState==4 && xmlhttpAutMob.status==200)
		{
			alert(xmlhttpAutMob.responseText);
			if(xmlhttpAutMob.responseText=="ACC"){
				alert("کد امنیتی صحیح بود:"); 
		    	}
		    	else if(xmlhttpAutMob.responseText=="ERR"){
				alert("کد وارد شده صحیح نیست!");
		    	}
	    	}
	 }	
}

function resetSliders() {

		var sliderVol = $("#Voli").data("ionRangeSlider");
		sliderVol.reset();
		$(".irs-slider:eq(3)").html("بلندی");

		var sliderpitch = $("#Pitchi").data("ionRangeSlider");
		sliderpitch.reset();
		$(".irs-slider:eq(2)").html("بسامد");

		var slidertone = $("#Tonei").data("ionRangeSlider");
		slidertone.reset();
		$(".irs-slider:eq(1)").html("زیرایی");

		var sliderSpeed = $("#Speedi").data("ionRangeSlider");
		sliderSpeed.reset();
		$(".irs-slider:eq(0)").html("سرعت");
}


function countChar(val) {
	var len = val.value.length;
	if (len > 199) {
		$('#charNum').css("color", "#e14443");
		val.value = val.value.substring(0, 199);

	} else {
		$('#charNum').css("color", "#000000");
		$('#charNum').text(199 - len);

	}
};

function insertAtCaret(areaId, text) {
		var txtarea = document.getElementById(areaId);
		if (!txtarea) {
			return;
		}

		var scrollPos = txtarea.scrollTop;
		var strPos = 0;
		var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
			"ff" : (document.selection ? "ie" : false));
		if (br == "ie") {
			txtarea.focus();
			var range = document.selection.createRange();
			range.moveStart('character', -txtarea.value.length);
			strPos = range.text.length;
		} else if (br == "ff") {
			strPos = txtarea.selectionStart;
		}

		var front = (txtarea.value).substring(0, strPos);
		var back = (txtarea.value).substring(strPos, txtarea.value.length);
		txtarea.value = front + text + back;
		strPos = strPos + text.length;
		if (br == "ie") {
			txtarea.focus();
			var ieRange = document.selection.createRange();
			ieRange.moveStart('character', -txtarea.value.length);
			ieRange.moveStart('character', strPos);
			ieRange.moveEnd('character', 0);
			ieRange.select();
		} else if (br == "ff") {
			txtarea.selectionStart = strPos;
			txtarea.selectionEnd = strPos;
			txtarea.focus();
		}

		txtarea.scrollTop = scrollPos;
}

function loadAudio(sourceUrl) {
	var audio = document.getElementById("player");

			audio.src = sourceUrl;
			audio.pause();
			audio.load();
			audio.oncanplaythrough = audio.play();
			refreshCaptcha();
}

function hideErroeBox() {
	$("#errBox").css('display', 'none'); 
	$("#btnReadText").prop("disabled", false); 
	$("#win8").css('display', 'none');
}

function updateOutput(el, val) {
	el.textContent = val;
}

$(function() {
	var slider = $('#slider'),tooltip = $('.tooltip');
	tooltip.hide();
	slider.slider({
		range: "min",min: 50,max: 150,value: 100,step: 25,start: function(event, ui) {	tooltip.fadeIn('fast');	},

		slide: function(event, ui) {
			//When the slider is sliding

			var value = slider.slider('value'),volume = $('.volume');

			tooltip.css('left', value).text(ui.value);

			;
		},

		stop: function(event, ui) {
		  tooltip.fadeOut('fast');
		},
	});

	var aud = document.getElementById("player");
	
	aud.onloadeddata = function() {
		$("#win8").css('display', 'none');
		$("#btnReadText").prop("disabled", false);
	};

	$('audio,video').mediaelementplayer();
	
	var $element = $('input[type="range"]');
	var $output = $('output');

	$element
		.rangeslider({
			polyfill: false,
			onInit: function() {
				updateOutput($output[0], this.value);
			}
		})
		.on('input', function() {
			updateOutput($output[0], this.value);
		});

	$("#Pitchi").ionRangeSlider({
		grid: false,from: 3,values: ["1", "2","3", "4","5", "6","7", "8","9", "10"]
	});

	$("#Tonei").ionRangeSlider({
		grid: false,from: 9,values: ["1", "2","3", "4","5", "6","7", "8","9", "10","11", "12","13", "14","15", "16","17", "18","19", "20"]
	});

	$("#Speedi").ionRangeSlider({
		grid: false,from: 4,values: ["1", "2","3", "4","5", "6","7", "8","9", "10"]
	});
	$("#Voli").ionRangeSlider({
		grid: false,from: 2,values: ["1", "2","3", "4","5"]
	});

	$(".irs-slider:eq(0)").html("سرعت");
	$(".irs-slider:eq(1)").html("زیرایی");
	$(".irs-slider:eq(2)").html("بسامد");
	$(".irs-slider:eq(3)").html("بلندی");


});