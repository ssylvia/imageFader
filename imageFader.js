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

            //Default Options
            var settings = $.extend({
                "startPosition" : 0,
                "autoPlay" : true,
                "animationSpeed" : 500,
                "animationDelay" : 5000,
                "captions" : false,
                "captionAttr" : "alt",
                "animationStart" : function(eventObj){},
                "animationEnd" : function(eventObjt){}
            },options);

            return this.each(function(i){

                var data = {
                    "settings" : settings,
                    "status" : {
                        "animationReady" : true
                    },
                    "timers" : {}
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
        },
        pause : function(){
            return this.each(function(){
                pauseAnimation($(this));
            });
        },
        play : function(){
            return this.each(function(){
                playAnimation($(this));
            });
        },
        next : function(){
            return this.each(function(){
                nextImg($(this));
            });
        },
        prev : function(){
            return this.each(function(){
                prevImg($(this));
            });
        },
        goTo : function(pos){
            return this.each(function(){
                goToPos($(this),pos);
            });
        },
        update : function(){
            return this.each(function(){
                updateFader($(this));
            });
        }

    };

    var pauseAnimation = function(fader){
        var data = fader.data("imageFader");
        for (var timer in data.timers){
            clearTimeout(timer);
        }
        data.settings.autoPlay = false;
        fader.removeClass("slideshowPlaying");
    };

    var playAnimation = function(fader){
        var data = fader.data("imageFader");
        fader.addClass("slideshowPlaying");
        startSlideShow(fader);
    };

    var nextImg = function(fader){
        var data = fader.data("imageFader");
        pauseAnimation(fader);

        if(data.currentImg.index === fader.children("img").length - 1){
            if(fader.children("img").first()[0].complete){
                fadeImages(fader,fader.children("img").first(),data.currentImg.jqueryElement);
            }
            else{
                fader.children("img").first().load(function(){
                    fadeImages(fader,$(this),data.currentImg.jqueryElement);
                });
            }
        }
        else{
            if(data.currentImg.jqueryElement.next()[0].complete){
                fadeImages(fader,data.currentImg.jqueryElement.next(),data.currentImg.jqueryElement);
            }
            else{
                data.currentImg.jqueryElement.next().load(function(){
                    fadeImages(fader,$(this),data.currentImg.jqueryElement);
                });
            }
        }
    };

    var prevImg = function(fader){
        var data = fader.data("imageFader");
        pauseAnimation(fader);

        if(data.currentImg.index === 0){
            if(fader.children("img").last()[0].complete){
                fadeImages(fader,fader.children("img").last(),data.currentImg.jqueryElement);
            }
            else{
                fader.children("img").last().load(function(){
                    fadeImages(fader,$(this),data.currentImg.jqueryElement);
                });
            }
        }
        else{
            if(data.currentImg.jqueryElement.prev()[0].complete){
                fadeImages(fader,data.currentImg.jqueryElement.prev(),data.currentImg.jqueryElement);
            }
            else{
                data.currentImg.jqueryElement.prev().load(function(){
                    fadeImages(fader,$(this),data.currentImg.jqueryElement);
                });
            }
        }
    };

    var goToPos = function(fader,pos){
        var data = fader.data("imageFader");
        pauseAnimation(fader);

        if (pos > fader.children("img").length - 1) {
            console.log("Error: No image at position " + pos);
        }
        else{
            if(fader.children("img").eq(pos)[0].complete){
                fadeImages(fader,fader.children("img").eq(pos),data.currentImg.jqueryElement);
            }
            else{
                fader.children("img").eq(pos).load(function(){
                    fadeImages(fader,$(this),data.currentImg.jqueryElement);
                });
            }
        }
    };

    var updateFader = function(fader){
        var data = fader.data("imageFader");

        fader.children("img").each(function(){
            $(this).hide().addClass("imageFaderGalleryImg hiddenImg").removeClass("visibleImg").css("max-height",fader.height()).css("max-width",fader.width());
            $(this).css("position","absolute");
        });

        if(fader.children("img").first()[0].complete){
            fader.children("img").first().fadeIn(data.settings.animationSpeed).removeClass("hiddenImg").addClass("visibleImg");
            repositionImg(fader,fader.children("img").first());
            data.timers.updateTimer = setTimeout(function() {
                if(data.settings.autoPlay === true){
                    fader.removeClass("slideshowPlaying");
                    startSlideShow(fader);
                }
            }, data.settings.animationSpeed);
        }
        else{
            fader.children("img").first().load(function(){
                $(this).fadeIn(data.settings.animationSpeed).removeClass("hiddenImg").addClass("visibleImg");
                repositionImg(fader,$(this));
                data.timers.updateTimer = setTimeout(function() {
                    if(data.settings.autoPlay === true){
                        fader.removeClass("slideshowPlaying");
                        startSlideShow(fader);
                    }
                }, data.settings.animationSpeed);
            });
        }

        data.currentImg = {"index" : 0,
            "src" : fader.children("img").first().attr("src"),
            "caption" : fader.children("img").first().attr(data.settings.captionAttr),
            "jqueryElement" : fader.children("img").first()
        };
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
            data.timers.initTimer = setTimeout(function() {
                if(data.settings.autoPlay === true){
                    fader.removeClass("slideshowPlaying");
                    startSlideShow(fader);
                }
            }, data.settings.animationSpeed);
        }
        else{
            fader.children("img").eq(data.settings.startPosition).load(function(){
                $(this).fadeIn(data.settings.animationSpeed).removeClass("hiddenImg").addClass("visibleImg");
                repositionImg(fader,$(this));
                data.timers.initTimer = setTimeout(function() {
                    if(data.settings.autoPlay === true){
                        fader.removeClass("slideshowPlaying");
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

        if (data.settings.captions === true){
            fader.append("<div class='imageFaderCaption'>"+data.currentImg.caption+"</div>");
        }

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
            if(fader.children("img").first()[0]){
                if(fader.children("img").first()[0].complete){
                    data.timers.showTimer = setTimeout(function() {
                            if(fader.hasClass("slideshowPlaying")){
                                fadeImages(fader,fader.children("img").first(),data.currentImg.jqueryElement);
                            }
                        }, data.settings.animationDelay);
                }
                else{
                    fader.children("img").first().load(function(){
                        data.timers.showTimer = setTimeout(function() {
                            if(fader.hasClass("slideshowPlaying")){
                                fadeImages(fader,$(this),data.currentImg.jqueryElement);
                            }
                        }, data.settings.animationDelay);
                    });
                }
            }
        }
        else{
            if(data.currentImg.jqueryElement.next()[0]){
                if(data.currentImg.jqueryElement.next()[0].complete){
                    data.timers.showTimer = setTimeout(function() {
                            if(fader.hasClass("slideshowPlaying")){
                                fadeImages(fader,data.currentImg.jqueryElement.next(),data.currentImg.jqueryElement);
                            }
                        }, data.settings.animationDelay);
                }
                else{
                    data.currentImg.jqueryElement.next().load(function(){
                        data.timers.showTimer = setTimeout(function() {
                            if(fader.hasClass("slideshowPlaying")){
                                fadeImages(fader,$(this),data.currentImg.jqueryElement);
                            }
                        }, data.settings.animationDelay);
                    });
                }
            }
        }
    };

    var fadeImages = function(fader,fIn,fOut){
        var data = fader.data("imageFader");

        if(data.status.animationReady === true && fader.children("img").length > 1){

            data.status.animationReady = false;
            data.settings.animationStart(data);

            fOut.fadeOut(data.settings.animationSpeed);
            fIn.fadeIn(data.settings.animationSpeed).removeClass("hiddenImg").addClass("visibleImg");
            repositionImg(fader,fIn);

            setTimeout(function() {
                repositionImg(fader,fIn);
                fOut.removeClass("visibleImg").addClass("hiddenImg");

                if(fader.hasClass("slideshowPlaying")){
                    data.timers.faderTimer = setTimeout(function() {
                        data.status.animationReady = true;
                    }, data.settings.animationDelay);
                }
                else{
                    data.status.animationReady = true;
                }

                data.currentImg = {"index" : fIn.index(),
                    "src" : fIn.attr("src"),
                    "caption" : fIn.attr(data.settings.captionAttr),
                    "jqueryElement" : fIn
                };
                data.previousImg = {"index" : fOut.index(),
                    "src" : fOut.attr("src"),
                    "caption" : fOut.attr(data.settings.captionAttr),
                    "jqueryElement" : fOut
                };
                if(data.settings.captions === true){
                    $(".imageFaderCaption").html(data.currentImg.caption);
                }
                data.settings.animationEnd(data);

                startSlideShow(fader);

            }, data.settings.animationSpeed);

        }
    };

})( jQuery );