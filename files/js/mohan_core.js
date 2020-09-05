$(document).ready(function(){
	var resized,
	cachedWidth = winWidth();
	console.log('Designed and developed by Mohan Subramanian! 2016');
	hamburgerIconEventHandler();
	resizeCustom();
	//Centering brainimage in Firefox and Safari
	if(!navigator.userAgent.match(/chrome/gi)) {
		$("#intro .brainimage").css({"top":"0px","left":"0px"});
	}
	$("#sub-page").css({"width":$("#intro").css("width") , "left": winWidth()});
	$(window).on('resize orientationchange', function(){
		if(cachedWidth != winWidth()) {
			cachedWidth = winWidth();
			clearTimeout(resized);
			resized = setTimeout(resizeCustom, 500);
		}
	});
	$(".clickable[data-href]").each(function(){
		$(this).on("click tap",function(){
			if($(this).parents(".photography").length) {
				replaceContent("photo",$(this).data("href"));
			} else if ($(this).parents(".filmmaking").length) {
				replaceContent("video",$(this).data("href"),$(this).data("href-extra"));
			} else {
				replaceContent("page",$(this).data("href"));
			}				
		});
	});
	$("nav a").on("click tap",function(event){
		event.preventDefault();
		event.stopPropagation();
		$('html,body').animate({scrollTop: $(this).attr("data-scroll")}, 800);
	});
	//Event handlers for the contact icons 
	$("#contact > .flex-container .flex-container .icon").on("click tap",function(){
		var $this = $("#contact .list-container").find("." + $(this).attr('data'));
		if(!($this.hasClass("open"))) {
			$this.parent().find(".open").removeClass("open").fadeOut();
			$this.addClass("open").fadeIn();
		}
	});
	if (cachedWidth < 768) $(".hover-text").addClass("mobile"); 
	//On browser resize, the positioning of different elements being reset
	function resizeCustom() {
		var widthFactor = parseInt($("#about").css("width"),10) * ((winWidth() < 768)? 0.5 : 0.3333),
		xHeight,
		xWidth = parseInt($("#resume").css("width"),10);
		if (winWidth() < 768) {
			$(".hover-text").addClass("mobile");
			xHeight = "auto";
		}
		else {
			xHeight = Math.ceil(xWidth * 1.1);
		}
		if($("#sub-page").height()>0) {
			subpageSlideOut();
		}
		$("#resume").css("height", xHeight);
		$(".calc-height").each(function() {
			if(!($(this).hasClass("text"))) {
				$(this).css("height",$(this).css("width"));
				$(this).find(".image-bg").css("background-color",getRandomColor());
			}
		});
		//Adding circular divs to all List-containers and attaching event handlers to it 
		if(!($(".list-container").hasClass('photography'))) {
			$(".list-container").each(function() {
				var $thisList = $(this),
				widthFactor75 = widthFactor * 0.75,
				listChildren = $(this).find(".clickable").length,
				animated;
				if (listChildren) {
					$(this).find("> .flex-container").css({"width":(listChildren * widthFactor75) + "px","height":widthFactor+20 + "px"});
					$(this).find(".clickable").each(function(index) {
						$(this).css({"left":index*widthFactor75 + "px" , "z-index":listChildren - index , "width":widthFactor});
						$(this).on("mouseenter", function() {
							clearTimeout(animated);
							animated = setTimeout(animateCircles, 350,$(this), widthFactor, widthFactor75);
						});
						$(this).on("mouseleave", function() {
							clearTimeout(animated);
							if($(this).hasClass("animationDone")) {
								var numChildren = $(this).prevAll().length;
								$(this).prevAll().each(function(index) {
									if(index < (numChildren-1)) {
										$(this).animate({"left":"+="+(widthFactor * 0.25)},200);
									}
									else {
										$(this).animate({"width":"+="+(widthFactor * 0.25)},200);
									}
								});
								numChildren = $(this).nextAll().length;
								$(this).nextAll().each(function(index) {
									if(index < (numChildren-1)) {
										$(this).animate({"left":"-="+(widthFactor * 0.25)},200);
									}
									else {
										$(this).animate({"width":"+="+(widthFactor * 0.25),"left":"-="+(widthFactor * 0.25)},200);	
									}
								});
							}
							$(this).removeClass("animationDone");
						});
					});
				}
			});
		}
		//calculating the offset location for scroll function
		$("nav a").each(function(index){
			$(this).attr("data-scroll" , $($(this).attr("href")).offset().top);			
		});
	}
});

$(window).on("load",function () {
	brainImage();
	customSlide();
	$("#intro nav.open").removeClass("open");
	$(".image-bg[data-bg-extra]").on('customEventBgChange', function() {
		var randomNum = Math.floor(Math.random()*7000+7000);
		setTimeout(switchBgImage,randomNum,$(this),randomNum);
	});
	imageReplacement();
	calcDancePhotosProperties();
	calcPhotosProperties();
});
function winWidth() {
	return document.documentElement.clientWidth;
}
function winHeight() {
	return document.documentElement.clientHeight;
}
//lazy loading all img and background-images
function imageReplacement() {
	$("img[data-href]").each(function(){
		$(this).attr("src",$(this).attr("data-href"));
	});
	$(".image-bg[data-bg]").each(function(){
		$(this).css("background-image","url('"+$(this).attr("data-bg")+"')");	
	});
}
function brainImage() {
	var image = new Image();
	$(image).on('load',function () {
		$("#intro .brainimage").css("background-image","url('"+image.src+"')");
		$("#intro .brainimage").addClass("open");
	});
	image.src = $("#intro .brainimage").attr("data-href");
}
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
//load sub-page div with the right content, based on target 
function replaceContent(type,url,url2) {
	if (type === "page") {
		$.when($("#sub-page").load(url+".html")).done(subpageSlideIn("auto"));
	} else if (type === "video") {
		var thisHtml = "<iframe class='videos' src='https://www.youtube.com/embed/" + url + "?autoplay=1&iv_load_policy=3'></iframe>";
		if(url2) {
			thisHtml += "<iframe class='videos' src='https://www.youtube.com/embed/" + url2 + "?autoplay=0&iv_load_policy=3'></iframe>";
		}
		$("#sub-page").html(thisHtml);
		$("#sub-page iframe").on("load",subpageSlideIn("100%"));
	} else if (type === "photo") {
		$("#sub-page").html($("#arts div.photography").clone());
		subpageLoadPhotos(url);
		$("#sub-page .photography").on("load",subpageSlideIn("100%"));
	}	
}
//Calculating the resume circles width & height. Also positioning based on browser width and device.  
function resumeCircles() {
	var xWidth = parseInt($("#resume").css("width"),10),
	xHeight = parseInt($("#resume").css("height"),10);
	if(winWidth() > 768) {
		$("#resume .a1").animate({"opacity":"1","top": (xHeight - parseInt($("#resume .a1").css("width"),10))/2 +"px", "left": (xWidth - parseInt($("#resume .a1").css("width"),10))/2 +"px" , "z-index":"4"},400);
		$("#resume .a2").animate({"opacity":"1","top": "0px", "right": "0px" , "z-index":"4"},400);
		$("#resume .a3").animate({"opacity":"1","top": "0px", "right": "41%"},400);
		$("#resume .a4").animate({"opacity":"1","top": (parseInt($("#resume .a3").css("width"),10)*0.6/xHeight)*100 +"%" , "left":"0px"},400);
		$("#resume .a5").animate({"opacity":"1","top": (xHeight - parseInt($("#resume .a5").css("width"),10))/2 +"px","right":"0px"},400);
		$("#resume .a6").animate({"opacity":"1","left": (xWidth - parseInt($("#resume .a6").css("width"),10))/2 +"px","bottom":"0px"},400);
		$("#resume .a7").animate({"opacity":"1","top":((parseInt($("#resume .a3").css("width"),10)*0.6+parseInt($("#resume .a4").css("width"),10)-15)/xHeight)*100 +"%","left":"0px"},400);
		$("#resume .a8").animate({"opacity":"1","bottom": (xHeight/2 - (parseInt($("#resume .a5").css("width"),10)/2) + parseInt($("#resume .a9").css("width"),10) - parseInt($("#resume .a8").css("width"),10))/2 +"px","right":"16%"},400);
		$("#resume .a9").animate({"opacity":"1","bottom": "0px", "right": "0px"},400);
	}
	else {
		$("#resume .clickable").each(function(){
			$(this).animate({"opacity":"1"},400);
		});
	}
	//Hover animation for all resume circles
	$("#resume .clickable").each(function() {
		$(this).off("mouseenter").on("mouseenter", function() {
			$(this).animate({"width":"+=10px","height":"+=10px"},200).animate({"width":"-=3px","height":"-=3px"},50);
		});
		$(this).off("mouseleave").on("mouseleave", function() {
			$(this).animate({"width":"-=7px","height":"-=7px"},200);
		});
	});
}
//Hover animations for all work-samples and arts circles.
function animateCircles(thisEl, widthFactor, widthFactor75) {
	var numChildren = thisEl.prevAll().length;
	thisEl.addClass("animationDone")
	thisEl.prevAll().each(function(index) {
		if(index < (numChildren-1)) {
			$(this).animate({"left":"-="+(widthFactor * 0.3)},300).animate({"left":"+="+(widthFactor * 0.05)},100);
		}
		else {
			$(this).animate({"width":"-="+(widthFactor * 0.3)},300).animate({"width":"+="+(widthFactor * 0.05)},100);
		}
	});
	numChildren = thisEl.nextAll().length;
	thisEl.nextAll().each(function(index) {
		if(index < (numChildren-1)) {
			$(this).animate({"left":"+="+(widthFactor * 0.3)},300).animate({"left":"-="+(widthFactor * 0.05)},100);
		}
		else {
			$(this).animate({"width":"-="+(widthFactor * 0.3),"left":"+="+(widthFactor * 0.3)},300).animate({"width":"+="+(widthFactor * 0.05),"left":"-="+(widthFactor * 0.05)},100);
		}
	});
}
//Slide out the sub-page and display the main page back
function subpageSlideOut() {
	var newTop = $("#sub-page").attr("data-href") - $(window).scrollTop();
	$("#sub-page .circle-container .dots.full").each(function() {
		$(this).off(); 
	});
	$("#sub-page .slideElement").each(function() {
		$(this).off();
	});
	$(".subpage-impact").show();
	$("#sub-page").css("top",newTop + "px");
	$(window).scrollTop($("#sub-page").attr("data-href"));
	$("header").css({"height":$("header").height() , "width":$("header").width() , "top":$("header").css("top")});
	$(".subpage-impact").css("left", "0px");
	$("#sub-page").css("left", winWidth());
	setTimeout(function(){
		$("#sub-page").css({"top":"0px","height":"0px","min-height":"0px"});
		$('#hamburger-icon').removeClass("subpage");
		$('header').removeClass("subpage");
		hamburgerIconEventHandler();
		$("header").removeAttr("style");
		$("#sub-page").attr("data-href","").html("");
	},750);
}
//Slide in the sub-page with appropriate content
function subpageSlideIn(height) {
	var oldMarginLeft = $("#resume").css("margin-left")
	,oldWidth = $("#resume").width();
	$("header").css({"height":$("header").height() , "width":$("header").width() , "top":$("header").css("top")});
	$("#sub-page").attr("data-href",$(window).scrollTop()).css({"height":height,'min-height':winHeight()});
	$(".subpage-impact").css("left","-" + oldWidth + "px");	
	$("#sub-page").css({"top" : $(window).scrollTop(),"left": oldMarginLeft });
	setTimeout(function(){
		experiencePage();
		$("#sub-page").css("top","0px");
		$(window).scrollTop(0);
		$(".subpage-impact").hide();
		$('#hamburger-icon').addClass("subpage");
		$('header').addClass("subpage");
		hamburgerIconEventHandler();
		$("header").removeAttr("style");
	},750);	
}
//Event handler for hamburger icons to open the menu or slide out sub-page div
function hamburgerIconEventHandler() {
	if($('#hamburger-icon').hasClass("subpage")) {
		$("header").removeClass("opened closed").addClass("closed");
		$("#hamburger-icon").removeClass("open");
		$("header").off("click tap").on("click tap",subpageSlideOut);
	} else {
		$("header").off("click tap").on("click tap",function(){
			$(this).find("#hamburger-icon").toggleClass('open');
			$(this).toggleClass("closed").toggleClass("opened");
		});
	}
}
//Loading all photography images and setup up a scrollable div in 2 rows
function calcPhotosProperties() {
	var spanWidth,
	totalWidthA = 0,
	totalWidthB = 0,
	index = $("#arts .photography .image-bg").length,
	noChildren = parseInt(index/2);
	spanWidth = (winWidth() < 960) ? ((winWidth() < 720) ? 225 : 300) : 400;
	$("#arts .photography .image-bg").each(function(){
		var image = new Image(), 
		iWidth, 
		iHeight,
		iThis = $(this);
		$(image).on('load',function () {
			iWidth = image.width;
			iHeight = image.height;
			iThis.parent().css({"width":((iWidth/iHeight)*spanWidth)+"px" , "height":spanWidth+"px"});
			iThis.css("background-image", "url(" + iThis.parent().attr('data-href') + ")");
			if(index > noChildren) {
				totalWidthA += (iWidth/iHeight)*spanWidth;
			}
			else {
				totalWidthB += (iWidth/iHeight)*spanWidth;
			}
			index--;
			loadPhotos(index,totalWidthA,totalWidthB,spanWidth);
		});
		image.src = iThis.parent().attr("data-href");
	});
}
function loadPhotos(index,totalWidthA,totalWidthB,spanWidth) {
	if(index == 0) {
		totalWidthA = (totalWidthA > totalWidthB)? totalWidthA : totalWidthB;
		$("#arts .photography div.flex-container").css({"width":totalWidthA + "px","height":2*spanWidth + "px"});
		$("#arts .photography div.flex-container").css({"-webkit-flex-direction":"row","flex-direction":"row"});
		$("#arts div.photography").addClass("list-container");
		$("#arts .photography").addClass("slideElement slide-left");
		$(".image-bg[data-bg-extra]").trigger('customEventBgChange');
		customSlide();
	}
}
//loading all dance images and setup up a scrollable div in 1 row
function calcDancePhotosProperties() {
	var spanWidth,
	totalWidth = 0,
	index = $("#arts .performing span").length;
	spanWidth = (winWidth() < 960) ? ((winWidth() < 720) ? 225 : 300) : 400;
	$("#arts .performing span").each(function(){
		var image = new Image(), 
		iWidth, 
		iHeight,
		iThis = $(this);
		$(image).on('load',function () {
			iWidth = image.width;
			iHeight = image.height;
			iThis.css({"width":((iWidth/iHeight)*spanWidth)+"px" , "height":spanWidth+"px"});
			iThis.css("background-image", "url(" + iThis.attr('data-href') + ")");
			totalWidth += (iWidth/iHeight)*spanWidth;
			index--;
			loadDancePhotos(index,totalWidth,spanWidth);
		});
		image.src = iThis.attr("data-href");
	});
}
function loadDancePhotos(index,totalWidth,spanWidth) {
	if(index == 0) {
		$("#arts .performing div.flex-container").css({"width":totalWidth + "px","height":spanWidth + "px"});
		$("#arts .performing div.flex-container").css({"-webkit-flex-direction":"row","flex-direction":"row"});
		$("#arts div.performing").addClass("list-container");
		$("#arts .performing").addClass("slideElement slide-left");
		customSlide();
	}
}
//Event handler for loading all photography images in a theatre mode inside sub-page div
function subpageLoadPhotos(url) {
	var spanFlag = false;
	$("#sub-page .photography > div.flex-container , #sub-page .photography span").css({"width":'',"height":''});
	$("#sub-page .photography span:first-child").addClass("firstSpan");
	$("#sub-page .photography span:last-child").addClass("lastSpan");
	$("#sub-page .photography span.clickable").each(function() {
		$(this).removeClass('clickable');
		if(spanFlag) {
			$(this).addClass("next");
		} else {
			if($(this).attr('data-href') == url) {
				$(this).addClass("current");
				spanFlag = true;
			}
			else {
				$(this).addClass("previous");
			}
		}
	});
	$("#sub-page .photography").append("<div class='nav-arrows flex-container'><h3 class='flex-item chevron-left'><i class='fa fa-chevron-left'></i></h3><h3 class='flex-item'><i class='fa fa-chevron-right'></i></h3></div>");
	$("#sub-page .photography").on('click tap', function(event){
		if(event.pageX > (winWidth()/2)){
			spanNext();
		}
		else {
			spanPrev();
		}
	});
	$("#sub-page .photography").on('swipeleft', function(){
		spanNext();
	});
	$("#sub-page .photography").on('swiperight', function(){
		spanPrev();
	});

}
function spanPrev() {
	spanThis = $("#sub-page .photography span.current");
	if(!(spanThis.hasClass("firstSpan"))){
		spanThis.removeClass("current").addClass("next").prev()
		.removeClass("previous").addClass("current");
	}
}
function spanNext() {
	spanThis = $("#sub-page .photography span.current");
	if(!(spanThis.hasClass("lastSpan"))){
		spanThis.removeClass("current").addClass("previous").next()
		.removeClass("next").addClass("current");
	}
}
//Animation to keep switching circles’s images in a loop
function switchBgImage(el,duration) {
	setTimeout( function() { 
		var imageArray = el.attr("data-bg-extra").split(","),
		imageLength = imageArray.length,
		flagBoolean = true;
		$.each(imageArray,function(index,value) {
			if((flagBoolean)&&(value == el.css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '').split(".com")[1])) {
				if(index == imageLength-1 ) {
					el.css("background-image", "url(" + imageArray[0] + ")").fadeIn(250);
				}
				else {
					el.css("background-image", "url(" + imageArray[index+1] + ")").fadeIn(250);
				}
				flagBoolean = false;
			}
		});
		switchBgImage(el,duration);
	}, duration);
}
//Slide animation on circles , when the user loads the first page for the first time
function customSlide() {
	var queueElement = $({});
	$(".slideElement").each(function() {
		var $this = $(this);
		$this.on("customEventSlide" , function() {
			queueElement.queue(function(next){
				if($this.closest(".customSlideEvent").length){
					$this.animate({
						left: "0%",
						opacity: "1"
					},400);
					next();
					$this.removeClass("slide-right").removeClass("slide-left");
				}
				else {
					$(".slideDone").promise().done(function() {
						$this.animate({
							left: "0%",
							opacity: "1"
						},400);
						next();
						$this.removeClass("slide-right").removeClass("slide-left");
					});
				}
			});
		});
	});
	$(window).on("scroll", function(){
		var heightFactor = winHeight()*0.7;
		$(".slideElement").each(function(){
			if(($(window).scrollTop() > $(this).offset().top - heightFactor)&&($(window).scrollTop() < $(this).offset().top + heightFactor)&&(!$(this).hasClass("slideDone"))) {
				$(this).addClass("slideDone");
				if($(this).closest("#about").length){
					$("#about .image-container").removeClass("open");
				}
				else if($(this).closest("#resume").length){
					resumeCircles();
				}
				else {
					$(this).trigger("customEventSlide");
				}
			}
		});
	});
}
var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};
function experiencePage() {
	prepareCircleContainer();
	imageReplacement();
	samplePageDesign();
}
//Create a content circle and load it with all images from the experience
function prepareCircleContainer() {
	var angle = 0,
	startDate,
	endDate = new Date(),
	temp,
	eventList = "click tap",
	eventFlag = false;
	if(!isMobile.any()){
		eventList = "mouseenter " + eventList;
	}
	$(".experience-page .circle-container .dot-container").each(function() {
		if(!($(this).hasClass("sample-container"))) {
			if(!navigator.userAgent.match(/chrome/gi)) {
				$(this).css("left",(parseInt($("#sub-page .circle-container").css("width"),10) - parseInt($(this).css("width"),10))/2 +"px");
			}
		}
		$(this).css("transform","rotate("+angle+"deg)");
		if($(this).find(".dots.full").length){
			$(this).find(".dots.full").css("transform","rotate("+(-angle)+"deg)");	
		}
		angle+=18;
	});
	temp = $(".experience-page .circle-container .dot-bg");
	if((!($(this).hasClass("sample-container")))&&(!navigator.userAgent.match(/chrome/gi))) {
		temp.css("left",(parseInt($("#sub-page .circle-container").css("width"),10) - parseInt(temp.css("width"),10))/2 +"px");
		temp.css("top","0px");
	}
	temp = $(".experience-page .circle-container .dot-bg");
	temp.css("height",temp.css("width"));
	temp = $(".experience-page .circle-container")
	temp.css("height",$(".experience-page .circle-container .dot-bg").css("width"));
	if($(".circle-container .dot-bg .calcTime2").length) {
		startDate = new Date($(".circle-container .dot-bg .calcTime2").attr('data-start'));
		temp = Math.floor((endDate - startDate)/31536000000);
		$(".circle-container .dot-bg .calcTime1").append(temp + ((temp>1)?"<span> years </span>":"<span> year </span>"));
		temp = Math.floor((endDate - startDate) % 31536000000/86400/30420);
		$(".circle-container .dot-bg .calcTime1").append(temp + ((temp>1)?"<span> months </span>":"<span> month </span>"));
	}
	$(".circle-container .dots.full").each(function() {
		$(this).on(eventList, function(event) {
			event.stopPropagation();
			$this = $(this);
			var varA, varB, varC;
			if(event.type == "mouseenter") {
				eventFlag = true;
			}
			else {
				eventFlag = false;
				varA = $(".circle-content").find("."+$this.attr("data-href"));
				if(varA.length) {
					if(!($(".circle-content .selected").length)) {
						$(".circle-content").css("height", parseInt(varA.css("height"),10)+100+"px");
						if($(window).scrollTop() < $(document).height()/5) {
							$('html,body').animate({scrollTop: "+=300" }, 1500);
						}
						varA.addClass("selected").slideDown(400);
					} else if ($(".circle-content .selected").hasClass($this.attr("data-href"))) {
						$(".circle-content .selected").slideUp(250);
						$(".circle-content .selected").promise().done(function() {
							$(".circle-content .selected").removeClass("selected");
							$(".circle-content").animate({height:'100px'},250);	
						});
					} else {
						$(".circle-content .selected").slideUp(250);
						$(".circle-content .selected").promise().done(function() {
							$(".circle-content").animate({height: parseInt(varA.css("height"),10)+100+"px"},250);
							$(".circle-content .selected").removeClass("selected");
							varA.addClass("selected").slideDown(400);
							if($(window).scrollTop() < $(document).height()/5) {
								$('html,body').animate({scrollTop: "+=300" }, 1500);
							}
						});
					}
				}
			}
			varB = $(".circle-container .dot-container .dots.full.hover");
			if(!($this.attr("data-href") == varB.attr("data-href"))) {
				varC = $(".circle-container .dot-bg .hover");
				if(varB) {
					if(varC) {
						varC.slideUp(250);
					}
					$(".circle-container .dot-bg").find("."+varB.attr("data-href")).slideUp(250);
					varB.removeClass("hover");
				}
				$(".circle-container .dot-container .dots.full").promise().done(function() {
					if(varC) {
						varC.slideUp(250);
					}
					$(".circle-container .dot-bg").find("."+$this.addClass("hover").attr("data-href")).slideDown(400);
					if($(".circle-container .dot-bg").hasClass("sample-container")){
						$(".circle-container .dot-bg").find("."+$this.addClass("hover").attr("data-href")).css({'display': '-webkit-flex','display': 'flex'});	
					}
				});
			} else {
				eventFlag = false;
			}
		});
		$(this).on("mouseleave", function() {
			if(eventFlag) {
				if($(".circle-container .dot-container .dots.full.hover").length) {
					$(".circle-container .dot-bg").find("."+$(".circle-container .dot-container .dots.full.hover").attr("data-href")).slideUp(250);
					$(".circle-container .dot-container .dots.full.hover").removeClass("hover");
					$(".circle-content .selected").removeClass("selected").slideUp(250);
				}
				eventFlag = false;
			}
		});
	});
}
function samplePageDesign() {
	if($("#sub-page .titlecard").length) {
		$("#sub-page .titlecard").animate({ 
			opacity: '1',
			left: '0px'
		},400, function(){
			$("#sub-page .circle-container.before").removeClass("before");
		});
	} else if ($("#sub-page .sample-container").length) {
		var widthA = parseInt($("#resume").css("width"),10),
		heightA = winHeight(),
		widthFinal = (widthA < heightA) ? widthA-90 : heightA-90;
		$("#sub-page .sample-container.dot-bg").css({"height":widthFinal, "width":widthFinal});
		widthFinal+=50;
		$("#sub-page .sample-container.dot-container").each(function() {
			$(this).css("width",widthFinal);
		});
		widthFinal+=40;
		$(".experience-page .circle-container").css("height","").css({"height":widthFinal,"padding":"20px 0"});
		if(!navigator.userAgent.match(/chrome/gi)) {
			$(".experience-page .sample-container.dot-container").each(function() {
				$(this).css("left",(parseInt($("#sub-page .circle-container").css("width"),10) - parseInt($(".experience-page .sample-container.dot-container:eq(0)").css("width"),10))/2 +"px");
			});
			temp = $(".experience-page .sample-container.dot-bg");
			temp.css("left",(parseInt($("#sub-page .circle-container").css("width"),10) - parseInt(temp.css("height"),10))/2 +"px");
			temp.css("top",(heightA - parseInt(temp.css("height"),10))/2 +"px");
			temp.find("h4").css("left","0px");
		}
		$("#sub-page .circle-container.before").removeClass("before");
	}
}
