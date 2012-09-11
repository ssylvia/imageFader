(function( $ ) {
  $.fn.imageFader = function(method) {

    // Method calling logic
    if ( methods[method] ) {
		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist in MultiTips' );
	}

  };

  var settings,
      animationReady = true;

  var methods = {

      init : function(options){
          initImageFader(this,options);
      },
      pause : function(){
          pauseAnimation(this);
      },
      play : function(){
          playAnimations(this);
      },
      next : function(){
          nextImg(this);
      },
      prev : function(){
          prevImg(this);
      },
      goTo : function(pos){
          goToPos(this,pos);
      },
      update : function(){
          updateImageFader(this);
      }

  };

  var initImageFader = function(fader,options){

      //Default Options
      settings = $.extend({
          "startPosition" : 0,
          "autoPlay" : true,
          "animationSpeed" : 500,
          "animationDelay" : 4000,
          "captions" : false,
          "captionAttr" : "title",
          "animationStart" : function(eventObj){},
          "animationEnd" : function(eventObjt){}

      },options);

      checkImgLoad(fader,options);

      $(window).resize(function(){
          var imageTags = fader.children("li").children("img");
          imageTags.css("max-width",fader.width()).css("max-height",fader.height());

          imageTags.each(function(){
              if($(this).width() > 0 && $(this).parent().is(":visible")){
                  $(this).css("margin-left",(fader.width() - $(this).width())/2).css("margin-top",(fader.height() - $(this).height())/2);
              }
              else if($(this).parent().is(":visible") === false){
                  $(this).parent().show();
                  $(this).css("margin-left",(fader.width() - $(this).width())/2).css("margin-top",(fader.height() - $(this).height())/2);
                  $(this).parent().hide();

              }
              else{
                  $(this).load(function(){
                      $(this).css("margin-left",(fader.width() - $(this).width())/2).css("margin-top",(fader.height() - $(this).height())/2);
                  });
              }
          });
      });

  };

  var pauseAnimation = function(fader){
      settings.autoPlay = false;
      fader.children("li").removeClass("playingAnimation");
  };

  var playAnimations = function(fader){
      settings.autoPlay = true;
      startSlideShow(fader);
      fader.children("li").addClass("playingAnimation");
  };

  var nextImg = function(fader){
      pauseAnimation(fader);
      startSlideShow(fader);
      setTimeout(function() {
          animationReady = true;
      }, settings.animationSpeed);
  };

  var prevImg = function(fader){
      pauseAnimation(fader);
      fader.children("li").each(function(){
          if($(this).hasClass("visibleImg")){
              if($(this).index() === 0){
                  if(fader.children("li").last().children("img").width > 0 && fader.children("li").last().children("img").is(":visible")){
                      fadeFunction(fader.children("li").last(),$(this),fader);
                  }
                  else if(fader.children("li").last().children("img").is(":visible") === false){
                      fadeFunction(fader.children("li").last(),$(this),fader);
                  }
                  else{
                      fader.children("li").last().children("img").load(function(){
                          fadeFunction(fader.children("li").last(),$(this),fader);
                      });
                  }
              }
              else{
                  if($(this).prev().children("img").width > 0 && $(this).prev().children("img").is(":visible")){
                      fadeFunction($(this).prev(),$(this),fader);
                  }
                  else if($(this).prev().children("img").is(":visible") === false){
                      fadeFunction($(this).prev(),$(this),fader);
                  }
                  else{
                      $(this).prev().children("img").load(function(){
                          fadeFunction($(this).prev(),$(this),fader);
                      });
                  }
              }
          }
      });
      setTimeout(function() {
          animationReady = true;
      }, settings.animationSpeed);
};

  var goToPos = function(fader,pos){
      if (pos > fader.children("li").length - 1) {
          console.log("Error: No image at position " + pos);
      }
      else{
          pauseAnimation(fader);
          fader.children("li").each(function(){
              if($(this).hasClass("visibleImg")){
                  if(fader.children("li").eq(pos).children("img").width > 0 && fader.children("li").eq(pos).children("img").is(":visible")){
                      fadeFunction(fader.children("li").eq(pos),$(this),fader);
                  }
                  else if(fader.children("li").eq(pos).children("img").is(":visible") === false){
                      fadeFunction(fader.children("li").eq(pos),$(this),fader);
                  }
                  else{
                      fader.children("li").eq(pos).children("img").load(function(){
                          fadeFunction(fader.children("li").eq(pos),$(this),fader);
                      });
                  }
              }
          });
          setTimeout(function() {
              animationReady = true;
          }, settings.animationSpeed);
      }
  };

  var updateImageFader = function(fader){
      $(".imageFaderCaption").remove();
      fader.children("li").removeClass("hiddenImg").removeClass("visibleImg").show();
      if(settings.autoPlay === true){
          pauseAnimation(fader);
          fader.children("li").addClass("playingAnimation");
          checkImgLoad(fader);
          setTimeout(function() {
              if(fader.children("li").first().hasClass("playingAnimation")){
                  settings.autoPlay = true;
                  startSlideShow(fader);
              }
          }, settings.animationDelay);
      }
      else{
          checkImgLoad(fader);
      }
      animationReady = true;
  };

  var checkImgLoad = function(fader,options){
      var imageTags = fader.children("li").children("img");

      imageTags.css("max-width",fader.width()).css("max-height",fader.height());
      fader.children("li").css("position","absolute").css("padding","0").css("margin","0").css("width","100%").css("height","100%");
      fader.css("list-style-type","none").css("padding","0").css("margin","0");

      if (settings.captions === true){
          fader.children("li").each(function(i){
              var caption = $(this).children("img").first().attr(settings.captionAttr);
              $(this).append("<div id='imgCaption"+i+"' class='imageFaderCaption'>"+caption+"</div>");
          });
      }

      imageTags.each(function(){
          $(this).parent().addClass("hiddenImg");
          if($(this).width() > 0){
              $(this).css("margin-left",(fader.width() - $(this).width())/2).css("margin-top",(fader.height() - $(this).height())/2);
              if($(this).parent().index() != settings.startPosition){
                  $(this).parent().hide();
              }
              else{
                  $(this).parent().removeClass("hiddenImg");
                  $(this).parent().addClass("visibleImg");
                  if(settings.autoPlay === true){
                      setTimeout(function() {
                          startSlideShow(fader,options);
                      }, settings.animationDelay);
                  }
              }
          }
          else{
              $(this).load(function(){
                  $(this).css("margin-left",(fader.width() - $(this).width())/2).css("margin-top",(fader.height() - $(this).height())/2);
                  if($(this).parent().index() != settings.startPosition){
                      $(this).parent().hide();
                  }
                  else{
                      $(this).parent().removeClass("hiddenImg");
                      $(this).parent().addClass("visibleImg");
                      setTimeout(function() {
                          if(settings.autoPlay === true){
                              startSlideShow(fader,options);
                          }
                      }, settings.animationDelay);
                  }
              });
          }
      });

  };

  var startSlideShow = function(fader,options){
      fader.children("li").each(function(){
          if(settings.autoPlay === true){
              $(this).addClass("playingAnimation");
          }
          if($(this).hasClass("visibleImg")){
              if($(this).index() === fader.children("li").length - 1){
                  if(fader.children("li").first().children("img").width > 0 && fader.children("li").first().children("img").is(":visible")){
                      fadeFunction(fader.children("li").first(),$(this),fader,options);
                  }
                  else if(fader.children("li").first().children("img").is(":visible") === false){
                      fadeFunction(fader.children("li").first(),$(this),fader,options);
                  }
                  else{
                      fader.children("li").first().children("img").load(function(){
                          fadeFunction(fader.children("li").first(),$(this),fader,options);
                      });
                  }
              }
              else{
                  if($(this).next().children("img").width > 0 && $(this).next().children("img").is(":visible")){
                      fadeFunction($(this).next(),$(this),fader,options);
                  }
                  else if($(this).next().children("img").is(":visible") === false){
                      fadeFunction($(this).next(),$(this),fader,options);
                  }
                  else{
                      $(this).next().children("img").load(function(){
                          fadeFunction($(this).next(),$(this),fader,options);
                      });
                  }
              }
          }
      });
  };

  var fadeFunction = function(fIn,fOut,fader,options){
      if(animationReady === true){
          animationReady = false;
          var eventObj = {"index" : fOut.index()};
          settings.animationStart(eventObj);
          fIn.fadeIn(settings.animationSpeed);
          fOut.fadeOut(settings.animationSpeed);
          setTimeout(function() {
              eventObj = {"index" : fIn.index()};
              settings.animationEnd(eventObj);
              fIn.addClass("visibleImg");
              fIn.removeClass("hiddenImg");
              fOut.removeClass("visibleImg");
              fOut.addClass("hiddenImg");

              setTimeout(function() {
                  animationReady = true;
                  if(settings.autoPlay === true){
                      startSlideShow(fader,options);
                  }
              }, settings.animationDelay);

          }, settings.animationSpeed);
      }
  };

})( jQuery );