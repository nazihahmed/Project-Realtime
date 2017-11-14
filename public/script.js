;

(function($,io,window,undefined) {
    'use strict';

    var $window = $(window);

    function showError(error) {
        var message = "An error occurred";
        if (error.message) {
                message = error.message;
        } else if (error.errors) {
                var errors = error.errors;
                message = "";
                Object.keys(errors).forEach(function(k) {
                        message += k + ": " + errors[k] + "\n";
                });
        }
        giveMessage(message);
    }

    function giveMessage(message) {
        alert(message);
    }

    function addArticles(scope,newArticles) {
        angular.extend(scope.articles,newArticles);
        console.log(scope.articles);
        scope.$apply();
        initializemarquee();
        scrollmarquee();
    }

    var socket = io();

    var app = angular.module('schoolApp',["data"]);

    app.controller("mainCTRL", function($scope, dataService) {

        $scope.articles = [];

        $scope.getArticles = function() {
            dataService.getArticles(function(response,err) {
                if(response) {
                    $scope.articles = [];
                    addArticles($scope,response);
                    console.log($scope.articles);
                } else {
                    console.log("error :" , err);
                }
            });
        }

        $scope.getArticles();

        socket.on('articles update', function() {
            console.log(' a new article');
            $scope.getArticles();
        });

    });

    app.controller('dateCTRL', function($scope,$timeout) {
        $scope.clock = "loading clock..."; // initialise the time variable
        $scope.tickInterval = 1000 //ms

        var tick = function() {
            $scope.clock = Date.now() // get the current time
            $timeout(tick, $scope.tickInterval); // reset the timer
        }

        // Start the timer
        $timeout(tick, $scope.tickInterval);
    });

    app.controller("weatherCTRL", function($scope,$timeout) {
        $(function() {
            $.simpleWeather({
                location: 'Israel,Arraba,30812',
                unit: 'c',
                success: function(weather) {
                    $scope.weather = weather;
                    $scope.$apply();
                    $window.on("sliderInitialized", function(){ 
                        $timeout(function() {
                            console.log("slider initialized");
                            var height = parseInt($('#marqueecontainer').outerHeight());
                            var weatherHeight = parseInt($('.weather').outerHeight());
                            var total = height - weatherHeight - 20;
                            $('.slider').outerHeight(total);
                        },500);
                    });
                },
                error: function(error) {
                  $("#weather").html('<p>'+error+'</p>');
                }
            });
        });
    });

    app.controller("slidesCTRL", function($scope,dataService) {
        $scope.files = [];

        function getSlides() {
            $scope.files = [];
            dataService.getSlides(function(res,status) {
                if(status) {
                  $scope.slides = res;
                  setTimeout(function() {
                      window.initializeSlider();
                      $window.triggerHandler("sliderInitialized");
                  }, 500);
                } else {
                  giveMessage('Error', res.message);
                }
            });
        }
        
        getSlides();
    });

    var days = {
        'Sun':'الاحد',
        'Mon':'الاثنين',
        'Tue': 'الثلاثاء',
        'Wed':'الاربعاء',
        'Thu':'الخميس',
        'Fri':'الجمعه',
        'Sat': 'السبت'
    } 

    app.filter('day', function() {
        return function(input) {
            console.log(input);
            return days[input];
        };
    });

    $(function() {
        window.addEventListener("dataavailable", function(e) {
            $("#scrollingText").smoothDivScroll({
                autoScrollingMode: "always",
                autoScrollingDirection: "endlessLoopLeft",
                autoScrollInterval: 10, 
                autoScrollStep: 2 
            });
        });

        var slider;

        window.initializeSlider = function() {
            slider = $('.flexslider').fitVids().flexslider({
                animationLoop: true, 
                slideshow: true, 
                slideshowSpeed: 4000,
                animationSpeed: 600,
                randomize: true,
                animation: "slide",
                video: true,
                itemWidth: 1920,
                smoothHeight: true
            });
            console.log("initialized");
        }

        function addSlide(url, caption) {
            var html;
            if (caption.length) {
                html = '<li><img src="'+url+'" class="img-responsive"/><p class="flex-caption">'+caption+'</li>';
            } else {
                html = '<li><img src="'+url+'" class="img-responsive"/></li>';
            }
            $('.flexslider').data('flexslider')
                            .addSlide(html);
        }

        socket.on('slider update', function(data) {
            console.log(data);
            for (var index in data) {
                var slide = data[index];
                addSlide('upload/' + slide.subdir + '/' + slide.filename,slide.comments);
                console.log(slide);
            }
            $window.triggerHandler("sliderInitialized");
            console.log(' a new slide / slides');

        });

        function removeSlide(data) {
            $('.flexslider').data('flexslider')
                            .removeSlide(data);
        }

        socket.on('addslide', function(url) {
            console.log(' a new slide');
            addSlide(url);
        });

        socket.on('slide removed', function(id) {
            console.log(' remove a slide');
            removeSlide($('img'+id));
        });
        
    });
    

})(jQuery,io,this);


/***********************************************
* Cross browser Marquee II- Dynamic Drive (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit http://www.dynamicdrive.com/ for this script and 100s more.
***********************************************/

var delayb4scroll=100; //Specify initial delay before marquee starts to scroll on page (2000=2 seconds)
var marqueespeed=1; //Specify marquee scroll speed (larger is faster 1-10)
var pauseit=0; //Pause marquee onMousever (0=no. 1=yes)?

////NO NEED TO EDIT BELOW THIS LINE////////////

var copyspeed=marqueespeed
var pausespeed=(pauseit==0)? copyspeed: 0
var actualheight=''

function scrollmarquee(){
if (parseInt(cross_marquee.style.top)>(actualheight*(-1)+8)) //if scroller hasn't reached the end of its height
cross_marquee.style.top=parseInt(cross_marquee.style.top)-copyspeed+"px" //move scroller upwards
else //else, reset to original position
cross_marquee.style.top=parseInt(marqueeheight)+8+"px"
}

function initializemarquee(){
cross_marquee=document.getElementById("vmarquee")
cross_marquee.style.top=0
marqueeheight=document.getElementById("marqueecontainer").offsetHeight
actualheight=cross_marquee.offsetHeight //height of marquee content (much of which is hidden from view)
if (window.opera || navigator.userAgent.indexOf("Netscape/7")!=-1){ //if Opera or Netscape 7x, add scrollbars to scroll and exit
cross_marquee.style.height=marqueeheight+"px"
cross_marquee.style.overflow="scroll"
return
}
setTimeout('lefttime=setInterval("scrollmarquee()",30)', delayb4scroll)
}

if (window.addEventListener)
window.addEventListener("load", initializemarquee, false)
else if (window.attachEvent)
window.attachEvent("onload", initializemarquee)
else if (document.getElementById)
window.onload=initializemarquee
