(function( $ ){
    $.fn.imageFader = function( method ) {

        if ( methods[method] ) {
        	return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    	} else if ( typeof method === 'object' || ! method ) {
    		return methods.init.apply( this, arguments );
    	} else {
    		$.error( 'Method ' +  method + ' does not exist in imageFader' );
    	}

    };

    var methods = {

        init : function(options){
            return this.each(function(options){

                //Default Options
                var settings = $.extend({
                    "startPosition" : 0,
                    "autoPlay" : true,
                    "animationSpeed" : 500,
                    "animationDelay" : 5000,
                    "captions" : false,
                    "captionAttr" : "title",
                    "animationStart" : function(eventObj){},
                    "animationEnd" : function(eventObjt){}
                },options);

                var data = {
                    "settings" : settings
                };

                $(this).data("imageFader", data);

                initializeFader($(this));

            });
        },
        destroy : function(){
            return this.each(function(){

                $(this).data("imageFader", undefined);
                $(window).unbind(".imageFader");

            });
        }

    };

    var initializeFader = function(fader){

        var data = fader.data("imageFader");

        fader.children("img").each(function(){
            $(this).hide().addClass("imageFaderGalleryImg hiddenImg").css("max-height",fader.height()).css("max-width",fader.width());
            $(this).css("position","absolute");
        });

        if(fader.children("img").eq(data.settings.startPosition)[0].complete){
            fader.children("img").eq(data.settings.startPosition).fadeIn(data.settings.animationSpeed).removeClass("hiddenImg").addClass("visibleImg");
            repositionImg(fader,fader.children("img").eq(data.settings.startPosition));
            setTimeout(function() {
                if(data.settings.autoPlay === true){
                    startSlideShow(fader);
                }
            }, data.settings.animationSpeed);
        }
        else{
            fader.children("img").eq(data.settings.startPosition).load(function(){
                $(this).fadeIn(data.settings.animationSpeed).removeClass("hiddenImg").addClass("visibleImg");
                repositionImg(fader,$(this));
                setTimeout(function() {
                    if(data.settings.autoPlay === true){
                        startSlideShow(fader);
                    }
                }, data.settings.animationSpeed);
            });
        }

        data.currentImg = {"index" : data.settings.startPosition,
            "src" : fader.children("img").eq(data.settings.startPosition).attr("src"),
            "caption" : fader.children("img").eq(data.settings.startPosition).attr(data.settings.captionAttr),
            "jqueryElement" : fader.children("img").eq(data.settings.startPosition)
        };

        $(window).bind('resize.imageFader',function(){
            $(".visibleImg").each(function(){
                repositionImg(fader,$(this));
            });
        });
    };

    var repositionImg = function(fader,img){
        img.css("max-height",fader.height()).css("max-width",fader.width()).css("margin-left",(fader.width() - img.width())/2).css("margin-top",((fader.height() - img.height())/2));
    };

    var startSlideShow = function(fader){
        var data = fader.data("imageFader");

        if(data.currentImg.index === fader.children("img").length - 1){
            if(fader.children("img").first()[0].complete){
                setTimeout(function() {
                        if(data.settings.autoPlay === true){
                            fadeImages(fader,fader.children("img").first(),data.currentImg.jqueryElement);
                        }
                    }, data.settings.animationDelay);
            }
            else{
                fader.children("img").first().load(function(){
                    setTimeout(function() {
                        if(data.settings.autoPlay === true){
                            fadeImages(fader,$(this),data.currentImg.jqueryElement);
                        }
                    }, data.settings.animationDelay);
                });
            }
        }
        else{
            if(data.currentImg.jqueryElement.next()[0].complete){
                setTimeout(function() {
                        if(data.settings.autoPlay === true){
                            fadeImages(fader,data.currentImg.jqueryElement.next(),data.currentImg.jqueryElement);
                        }
                    }, data.settings.animationDelay);
            }
            else{
                data.currentImg.jqueryElement.next().load(function(){
                    setTimeout(function() {
                        if(data.settings.autoPlay === true){
                            fadeImages(fader,$(this),data.currentImg.jqueryElement);
                        }
                    }, data.settings.animationDelay);
                });
            }
        }
    };

    var fadeImages = function(fader,fIn,fOut){
        var data = fader.data("imageFader");

        data.settings.animationStart(data);

        fOut.fadeOut(data.settings.animationSpeed);
        fIn.fadeIn(data.settings.animationSpeed).removeClass("hiddenImg").addClass("visibleImg");
        repositionImg(fader,fIn);

        setTimeout(function() {
            repositionImg(fader,fIn);
            fOut.removeClass("visibleImg").addClass("hiddenImg");

            data.currentImg = {"index" : fIn.index(),
                "src" : fIn.attr("src"),
                "caption" : fIn.attr(data.settings.captionAttr),
                "jqueryElement" : fIn
            };
            data.settings.animationEnd(data);

            startSlideShow(fader);

        }, data.settings.animationSpeed);
    };

})( jQuery );