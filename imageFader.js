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

  var settings;

  var methods = {

      init : function(options){
          initImageFader(this,options);
      }

  };

  var initImageFader = function(fader,options){

      //Default Options
      settings = $.extend({
          "startPosition" : 3,
          "autoPlay" : true,
          "animationSpeed" : 500
      },options);

      checkImgLoad(fader,options);

  };

  var checkImgLoad = function(fader,options){
      var imageTags = fader.children("li").children("img");

      imageTags.css("max-width",fader.width()).css("max-height",fader.height());
      fader.children("li").css("position","absolute");
      fader.css("list-style-type","none").css("padding","0").css("margin","0");

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
                  startSlideShow(fader,options);
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
                      startSlideShow(fader,options);
                  }
              });
          }
      });

  };

  var startSlideShow = function(fader,options){
      fader.children("li").each(function(){
          if($(this).hasClass("visibleImg")){
              if($(this).index() === fader.children("li").length - 1){
              }
          }
      });
  };

})( jQuery );