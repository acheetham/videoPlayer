/*
Copyright 2009 University of Toronto
Copyright 2011 Charly Molter
Copyright 2011-2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, window, fluid*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */


(function ($) {
    fluid.setLogging(false);

    /*******************************************************************************
     * Browser type detection: html5 or non-html5.                                 *
     *                                                                             *
     * Add type tags of html5 into static environment for the html5 browsers.      *
     *******************************************************************************/
    fluid.registerNamespace("fluid.browser");

    // TODO: this code has been cut and pasted from the framework and from UIOptions.js and needs to be removed as soon as possible.
    // Most of this code is a copy-paste from the https://github.com/fluid-project/infusion/blob/master/src/webapp/framework/enhancement/js/ProgressiveEnhancement.js
    // It should go away and the following http://issues.fluidproject.org/browse/FLUID-4794 should be the fix for the code below

    fluid.browser.supportsHtml5 = function () {
        // ToDo: The plan is to use mediaElement for the detection of the html5 browser.
        // Needs re-work at the integration of mediaElement.
        var isHtml5Browser = !($.browser.msie && $.browser.version < 9);
        return isHtml5Browser ? fluid.typeTag("fluid.browser.supportsHtml5") : undefined;
    };
    
    fluid.browser.requestFullScreen = (function () {
        var v = $("<video />")[0];
        return v.requestFullScreen || v.mozRequestFullScreen || v.webkitRequestFullScreen || v.oRequestFullScreen || v.msieRequestFullScreen;
    })();

    fluid.browser.supportsFullScreen = function () {
        return fluid.browser.requestFullScreen ? fluid.typeTag("fluid.browser.supportsFullScreen") : undefined;
    };

    var features = {
        supportsHtml5: fluid.browser.supportsHtml5(),
        supportsFullScreen: fluid.browser.supportsFullScreen()
    };
    
    fluid.merge(null, fluid.staticEnvironment, features);
    
    // TODO: This method cut and pasted from UIEnhancer.js 
    fluid.hasFeature = function (tagName) {
        return fluid.find(fluid.staticEnvironment, function (value) {
            return value && value.typeName === tagName ? true : undefined;
        });
    };

    
    /*******************************************************************************
     * Video Player                                                                *
     *                                                                             *
     * Renders HTML 5 video player at the detection of HTML5 browsers. It degrades * 
     * gracefully to the browser built-in video player when the browser does not   *
     * support HTML5.                                                              * 
     *******************************************************************************/
    
    fluid.registerNamespace("fluid.videoPlayer");
    
    //This is the default key bindings
    fluid.videoPlayer.defaultKeys = {
        play: {
            modifier: $.ui.keyCode.SHIFT,
            key: 80
        },
        captions: {
            modifier: $.ui.keyCode.SHIFT,
            key: 67
        },
        transcripts: {
            modifier: $.ui.keyCode.SHIFT,
            key: 84
        },
        fullscreen: {
            modifier: $.ui.keyCode.SHIFT,
            key: 70
        },
        volumePlus: {
            key: $.ui.keyCode.UP
        },
        volumeMinus: {
            key: $.ui.keyCode.DOWN
        },
        forward: {
            key: $.ui.keyCode.RIGHT
        },
        rewind: {
            key: $.ui.keyCode.LEFT
        },
        escape: {
            key: $.ui.keyCode.ESCAPE
        }
    };

    /**
     * Video player renders HTML 5 video content and degrades gracefully to an alternative.
     * 
     * @param {Object} container the container in which video and (optionally) captions are displayed
     * @param {Object} options configuration options for the component
     */

    fluid.defaults("fluid.videoPlayer", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        components: {
            media: {
                type: "fluid.videoPlayer.media",
                container: "{videoPlayer}.dom.video",
                createOnEvent: "onCreateMediaReady",
                priority: "first",
                options: {
                    model: "{videoPlayer}.model",
                    applier: "{videoPlayer}.applier",
                    components: {
                        intervalEventsConductor: {
                            type: "fluid.videoPlayer.intervalEventsConductor",
                            options: {
                                events: {
                                    onTimeChange: "{videoPlayer}.events.onTimeChange",
                                    onIntervalChange: "{videoPlayer}.events.onIntervalChange"
                                }
                            }
                        },
                        transcript: {
                            type: "fluid.videoPlayer.transcript",
                            container: "{videoPlayer}.dom.transcript",
                            options: {
                                // TODO (long term) - should not share entire model and applier with transcripts
                                model: "{videoPlayer}.model",
                                applier: "{videoPlayer}.applier",
                                transcripts: "{videoPlayer}.options.video.transcripts",
                                components: {
                                    transcriptInterval: {
                                        type: "fluid.videoPlayer.intervalEventsConductor",
                                        options: {
                                            events: {
                                                onIntervalChange: "{transcript}.events.onIntervalChange"
                                            }
                                        }
                                    }
                                },
                                events: {
                                    onCurrentTranscriptChanged: "{videoPlayer}.events.onCurrentTranscriptChanged",
                                    onTranscriptHide: "{videoPlayer}.events.onTranscriptHide",
                                    onTranscriptShow: "{videoPlayer}.events.onTranscriptShow",
                                    onTranscriptElementChange: "{videoPlayer}.events.onTranscriptElementChange",
                                    onTranscriptsLoaded: "{videoPlayer}.events.onTranscriptsLoaded"
                                }
                            }
                        }
                    },
                    events: {
                        onLoadedMetadata: "{videoPlayer}.events.onLoadedMetadata",
                        onMediaReady: "{videoPlayer}.events.onMediaReady"
                    },
                    sources: "{videoPlayer}.options.video.sources"
                }
            },
            controllers: {
                type: "fluid.videoPlayer.controllers",
                container: "{videoPlayer}.dom.controllers",
                createOnEvent: "onCreateControllersReady",
                options: {
                    model: "{videoPlayer}.model",
                    applier: "{videoPlayer}.applier",
                    captions: "{videoPlayer}.options.video.captions",
                    transcripts: "{videoPlayer}.options.video.transcripts",
                    events: {
                        onControllersReady: "{videoPlayer}.events.onControllersReady",
                        onStartScrub: "{videoPlayer}.events.onStartScrub",
                        onScrub: "{videoPlayer}.events.onScrub",
                        afterScrub: "{videoPlayer}.events.afterScrub",
                        onTranscriptsReady: "{videoPlayer}.events.canBindTranscriptMenu",
                        onCaptionsReady: "{videoPlayer}.events.canBindCaptionMenu",
                        onCaptionControlsRendered: "{videoPlayer}.events.onCaptionControlsRendered",
                        onCaptionListUpdated: "{videoPlayer}.events.onCaptionListUpdated"
                    }
                }
            },
            html5Captionator: {
                type: "fluid.videoPlayer.html5Captionator",
                container: "{videoPlayer}.dom.videoPlayer",
                createOnEvent: "onHTML5BrowserDetected",
                options: {
                    model: "{videoPlayer}.model",
                    applier: "{videoPlayer}.applier",
                    captions: "{videoPlayer}.options.video.captions",
                    events: {
                        onReady: "{videoPlayer}.events.onCaptionsReady"
                    }
                }
            },
            amara: {
                type: "fluid.unisubComponent",
                createOnEvent: "onReady",
                options: {
                    urls: {
                        video: "{videoPlayer}.options.video.sources"
                    },
                    events: {
                        modelReady: "{videoPlayer}.events.onAmaraCaptionsReady"
                    },
                    queryAmaraForCaptions: "{videoPlayer}.options.queryAmaraForCaptions"
                }
            }
        },
        preInitFunction: "fluid.videoPlayer.preInit",
        postInitFunction: "fluid.videoPlayer.postInit",
        finalInitFunction: "fluid.videoPlayer.finalInit",
        events: {
            onScrub: null,
            onTemplateReady: null,
            onViewReady: null,
            onLoadedMetadata: null,
            onMediaReady: null,
            onControllersReady: null,
            afterScrub: null,
            onStartScrub: null,
            onTemplateLoadError: null,
            onCurrentTranscriptChanged: null,
            onTranscriptHide: null,
            onTranscriptShow: null,
            onTranscriptElementChange: null,
            onReady: null,
            onCaptionListUpdated: null,
            
            // public, time events
            onTimeChange: null,
            onIntervalChange: null,
            
            // The following events are private
            onCreateControllersReady: null,
            onCreateMediaReady: null,
            onHTML5BrowserDetected: null,
            onAmaraCaptionsReady: null,
            onAmaraCaptionsReadyBoiled: {
                event: "onAmaraCaptionsReady",
                args: ["{videoPlayer}", "{arguments}.0"]
            },

            // private events used for testing
            onCaptionControlsRendered: null,
            onCaptionControlsRenderedBoiled: {
                event: "onCaptionControlsRendered",
                args: ["{videoPlayer}", "{arguments}.0"]
            },

            // private events used for associating menus with what they control via ARIA
            onTranscriptsReady: null,
            onTranscriptsLoaded: null,
            onCaptionsReady: null,
            canBindTranscriptMenu: {
                events: {
                    controllers: "onControllersReady",
                    transcripts: "onTranscriptsLoaded"
                },
                args: ["{arguments}.transcripts.1"]
            },
            canBindCaptionMenu: {
                events: {
                    controllers: "onControllersReady",
                    captions: "onCaptionsReady"
                },
                args: ["{arguments}.captions.1"]
            }
        },
        invokers: {
            resize: {
                funcName: "fluid.videoPlayer.resize",
                args: "{videoPlayer}"
            }  
        },
        selectors: {
            videoPlayer: ".flc-videoPlayer-main",
            video: ".flc-videoPlayer-video",
            videoContainer: ".flc-videoPlayer-video-container",
            caption: ".flc-videoPlayer-captionArea",
            controllers: ".flc-videoPlayer-controller",
            transcript: ".flc-videoPlayer-transcriptArea",
            overlay: ".flc-videoPlayer-overlay"
        },
        strings: {
            captionsOff: "Captions OFF",
            turnCaptionsOff: "Turn Captions OFF",
            transcriptsOff: "Transcripts OFF",
            turnTranscriptsOff: "Turn Transcripts OFF",
            videoTitlePreface: "Video"
        },
        selectorsToIgnore: ["overlay", "caption", "videoPlayer", "transcript", "video", "videoContainer"],
        keyBindings: fluid.videoPlayer.defaultKeys,
        produceTree: "fluid.videoPlayer.produceTree",
        controls: "custom",
        video: {
            sources: [],
            captions: [],
            transcripts: []
        },
        defaultKinds: {
            captions: "subtitles",
            transcripts: "transcripts"
        },
        model: {
            currentTracks: {
                captions: [],
                transcripts: []
            },
            currentTime: 0,
            totalTime: 0,
            bufferEnd: 0,
            displayCaptions: false,
            displayTranscripts: false,
            fullscreen: false,
            volume: 60,
            muted: false,
            canPlay: false,
            languageList: []
        },
        templates: {
            videoPlayer: {
                forceCache: true,
                href: "../html/videoPlayer_template.html"
            }
        },
        videoTitle: "unnamed video",
        queryAmaraForCaptions: true
    });

    var bindKeyboardControl = function (that) {
        var opts = {
            additionalBindings: [{
                modifier: that.options.keyBindings.play.modifier,
                key: that.options.keyBindings.play.key,
                activateHandler: that.play
            }, {
                modifier: that.options.keyBindings.fullscreen.modifier,
                key: that.options.keyBindings.fullscreen.key,
                activateHandler: function () {
                    that.applier.fireChangeRequest({
                        path: "fullscreen",
                        value: !that.model.fullscreen
                    });
                }
            }, {
                modifier: that.options.keyBindings.captions.modifier,
                key: that.options.keyBindings.captions.key,
                activateHandler: function () {
                    that.applier.fireChangeRequest({
                        path: "displayCaptions",
                        value: !that.model.displayCaptions
                    });
                }
            }, {
                modifier: that.options.keyBindings.transcripts.modifier,
                key: that.options.keyBindings.transcripts.key,
                activateHandler: function () {
                    that.applier.fireChangeRequest({
                        path: "displayTranscripts",
                        value: !that.model.states.displayTranscripts
                    });
                }
            }, {
                modifier: that.options.keyBindings.volumePlus.modifier,
                key: that.options.keyBindings.volumePlus.key,
                activateHandler: function () {
                    that.applier.fireChangeRequest({
                        path: "volume",
                        value: that.model.volume + 10
                    });
                    return false;
                }
            }, {
                modifier: that.options.keyBindings.volumeMinus.modifier,
                key: that.options.keyBindings.volumeMinus.key,
                activateHandler: function () {
                    that.applier.fireChangeRequest({
                        path: "volume",
                        value: that.model.volume - 10
                    });
                    return false;
                }
            }, {
                modifier: that.options.keyBindings.forward.modifier,
                key: that.options.keyBindings.forward.key,
                activateHandler: that.incrTime
            }, {
                modifier: that.options.keyBindings.rewind.modifier,
                key: that.options.keyBindings.rewind.key,
                activateHandler: that.decrTime
            }]
        };
        var video = that.locate("video");
        video.fluid("tabbable");
        video.fluid("activatable", [that.play, opts]);
    };

    var showControllers = function (that) {
        that.locate("controllers").stop(false, true).slideDown();
    };

    var hideControllers = function (that) {
        that.locate("controllers").stop(false, true).delay(500).slideUp();
    };

    var bindVideoPlayerDOMEvents = function (that) {
        var videoContainer = that.locate("videoContainer");

        fluid.tabindex(videoContainer, 0);

        // Using "mousedown" event rather than "click", which does not work
        // with the flash fallback in IE8
        videoContainer.mousedown(function (ev) {
            ev.preventDefault();
            that.play();
        });

        that.locate("videoPlayer").mouseenter(function () {
            showControllers(that);
        });

        that.container.mouseleave(function () {
            hideControllers(that);
        });

        videoContainer.focus(function () {
            showControllers(that);
        });

        that.events.onLoadedMetadata.addListener(function () {
            that.resize();
            
            bindKeyboardControl(that);
        });
    };

    var bindVideoPlayerModel = function (that) {
        that.applier.modelChanged.addListener("fullscreen", that.fullscreen);
        that.applier.modelChanged.addListener("canPlay", function () {
            that.events.onViewReady.fire();
        });
    };

    fluid.videoPlayer.produceTree = function (that) {
        var tree = {};
        
        if (fluid.hasFeature("fluid.browser.supportsHtml5") && that.options.controls === "native") {
            // Use browser built-in video player
            tree.video = {
                decorators: [{
                    type: "attrs",
                    attributes: {
                        controls: "true"
                    }
                }]
            };
        }
        
        // Keep the selector to render "fluid.videoPlayer.controllers"
        if (that.canRenderControllers(that.options.controls)) {
            that.options.selectorsToIgnore.push("controllers");
        }
        
        return tree;
    };
    
    fluid.videoPlayer.addDefaultKind = function (tracks, defaultKind) {
        fluid.each(tracks, function (track) {
            if (!track.kind) {
                track.kind = defaultKind;
            }
        });
    };

    fluid.videoPlayer.preInit = function (that) {
        fluid.each(that.options.defaultKinds, function (defaultKind, index) {
            fluid.videoPlayer.addDefaultKind(fluid.get(that.options.video, index), defaultKind);  
        });
        
        that.fullscreen = function () {
            if (that.model.fullscreen === true) {
                fluid.browser.requestFullScreen.apply(that.locate("video")[0]);
            }
        };
        
        // FLUID-4661: Change the fullscreen model flag back to false when browser exits its HTML5 fullscreen mode
        // Once our own custome fullscreen mode is implemented we want to call this fireChangeRequest in another function
        // which will be called by pressing a full screen toggle Button or when a key shortcut for exiting a fullscreen is pressed
        fluid.each({
            "fullscreenchange": "fullscreen",
            "mozfullscreenchange": "mozFullScreen",
            "webkitfullscreenchange": "webkitIsFullScreen",
            "ofullscreenchange": "oFullScreen"
        }, function (value, key) {
            var turnoffFullScreen = function () {
                if (!document[value]) {
                    that.applier.fireChangeRequest({
                        path: "fullscreen",
                        value: false
                    });
                }
            };
            
            if (document.addEventListener) {
                document.addEventListener(key, turnoffFullScreen);
            } else {
                // IE8 uses attachEvent rather than the standard addEventListener
                document.attachEvent(key, turnoffFullScreen);
            }
        });

        that.model.languageList = that.options.video.captions;
    };

    fluid.videoPlayer.postInit = function (that) {
        // TODO: declarative syntax for this in framework
        // note that the "mega-model" is shared throughout all components - morally, this should go into the 
        // volume control component, but it is best to get at the single model + applier as early as possible
        that.applier.guards.addListener({path: "volume", transactional: true}, fluid.linearRangeGuard(0, 100));

        that.canRenderControllers = function (controlsType) {
            return controlsType === "custom";
        };

        that.play = function (ev) {
            that.applier.fireChangeRequest({
                "path": "play",
                "value": !that.model.play
            });
        };

        that.incrTime = function () {
            that.events.onStartScrub.fire();
            if (that.model.currentTime < that.model.totalTime) {
                var newVol = that.model.currentTime + that.model.totalTime * 0.05;
                that.events.onScrub.fire(newVol <= that.model.totalTime ? newVol : that.model.totalTime);
            }
            that.events.afterScrub.fire();
        };

        that.decrTime = function () {
            that.events.onStartScrub.fire();
            
            if (that.model.currentTime > 0) {
                var newVol = that.model.currentTime - that.model.totalTime * 0.05;
                that.events.onScrub.fire(newVol >= 0 ? newVol : 0);
            }
            that.events.afterScrub.fire();
        };
    };
    
    fluid.videoPlayer.finalInit = function (that) {
        that.container.attr("role", "application");

        that.applier.modelChanged.addListener("languageList", function (newModel, oldModel, requestSpec) {
            that.events.onCaptionListUpdated.fire();
        });
        that.events.onAmaraCaptionsReadyBoiled.addListener(function (that, captionData) {
            var capList = fluid.copy(that.model.languageList);
            fluid.each(captionData, function (cap, index) {
                var lang = fluid.copy(cap);
                capList.push({
                    href: fluid.stringTemplate("http://www.universalsubtitles.org/en/videos/g2QoNQgjJd5y/%lang/%subtitleId/", {
                        lang: cap.code,
                        subtitleId: cap.id
                    }),
                    type: "text/amarajson",
                    srclang: cap.code,
                    label: cap.name
                });
            });
            that.applier.requestChange("languageList", capList);
        });

        // Render each media source with its custom renderer, registered by type.
        // If we aren't on an HTML 5 video-enabled browser, don't bother setting up the controller, captions or transcripts.

        fluid.fetchResources(that.options.templates, function (res) {
            var fetchFailed = false;
            for (var key in res) {
                if (res[key].fetchError) {
                    fluid.log("couldn't fetch" + res[key].href);
                    fluid.log("status: " + res[key].fetchError.status +
                        ", textStatus: " + res[key].fetchError.textStatus +
                        ", errorThrown: " + res[key].fetchError.errorThrown);
                    that.events.onTemplateLoadError.fire(res[key].href);
                    fetchFailed = true;
                } else if (key === "videoPlayer") {
                    that.container.append(res[key].resourceText);
                    that.refreshView();
                    that.locate("video").attr("aria-label", that.options.strings.videoTitlePreface + ": " + that.options.videoTitle);

                    bindVideoPlayerDOMEvents(that);
                    //create all the listeners to the model
                    bindVideoPlayerModel(that);
                }
            }

            if (!fetchFailed) {
                that.events.onTemplateReady.fire();

                if (that.options.video.sources) {
                    that.events.onCreateMediaReady.fire();
                }
                if (that.canRenderControllers(that.options.controls)) {
                    that.events.onCreateControllersReady.fire();
                }

                // TODO: Once we have a non-html5 fall-back for captions to replace captionator,
                // the "if" check on html5 browser can be removed. For now, caption component is
                // only instantiated in html5 browsers.
                if (fluid.hasFeature("fluid.browser.supportsHtml5")) {
                    that.events.onHTML5BrowserDetected.fire();
                }
            }

            that.locate("controllers").hide();

            // Ensure <object> element is not in tab order, for IE9
            $("object", that.locate("video")).attr("tabindex", "-1");

            that.events.onReady.fire(that);
        });
        
        return that;
    };
        
    //returns the time in format hh:mm:ss from a time in seconds 
    fluid.videoPlayer.formatTime = function (time) {
        var fullTime = Math.floor(time);
        var sec = fullTime % 60;
        sec = sec < 10 ? "0" + sec : sec;
        fullTime = Math.floor(fullTime / 60);
        var min = fullTime % 60;
        fullTime = Math.floor(fullTime / 60);
        var ret = "";
        if (fullTime !== 0) {
            ret = fullTime + ":";
        }
        return ret + min + ":" + sec;
    };
    
    // Function which modifies containers and their sizes
    fluid.videoPlayer.resize = function (that) {
        var video = that.locate("video");
        var videoPlayer = that.locate("videoPlayer");
        var overlay = that.locate("overlay");
        
        // Get the video sizes first
        // ToDo: A video wrapper container is used for video scaling. The video width/height are determined by the wrapper container
        // rather then the video itself. This solution needs a re-consideration once we decide on scaling the video through css or
        // API.
//        var videoWidth = video[0].videoWidth;
//        var videoHeight = video[0].videoHeight;
        var videoWidth = video.width();
        var videoHeight = video.height();

        // Set height on the controller area. To make overlay to show up exactly at the bottom of the video regardless to UIO settings
        videoPlayer.css({height: videoHeight});
        
        // Set the width of the overlay to be the width of the video, otherwise, the controller bar spreads into transcript area
        overlay.css({width: videoWidth});
        
        // Save the video width/height in the model so they are accessible by the sub-components
        that.model.videoWidth = videoWidth;
        that.model.videoHeight = videoHeight;
    };

    /*********************************************************************************
     * Event Binder:                                                                 *
     * Shared by all video player component whenever an event binder component is    *
     * needed                                                                        *
     *********************************************************************************/
        
    fluid.defaults("fluid.videoPlayer.eventBinder", {
        gradeNames: ["fluid.eventedComponent", "autoInit"]
    });

    /*********************************************************************************
     * Demands blocks for event binding components                                   *
     *********************************************************************************/
    
    fluid.demands("mediaEventBinder", ["fluid.videoPlayer.media", "fluid.videoPlayer"], {
        options: {
            listeners: {
                "{videoPlayer}.events.onScrub": "{media}.setTime",
                "{videoPlayer}.events.onViewReady": "{media}.refresh",
                "{videoPlayer}.events.onTimeChange": "{media}.updateCurrentTime",
                "{videoPlayer}.events.onTranscriptElementChange": "{media}.setTime"
            }
        }
    });

    /*******************************************************************
     * Converts milliseconds into a WebVTT Timestamp:  HH:MM:SS.mmm
     * @millis:  time in milliseconds expressed as a floating point number
     *******************************************************************/
    fluid.videoPlayer.millisToHmsm = function (millis) {
        var seconds = parseFloat(millis) / 1000;
        seconds = seconds < 0 || isNaN(seconds) ? 0 : seconds;

        var hours = parseInt(seconds / 3600);
        var minutes = parseInt(seconds / 60) % 60;
        seconds = (seconds % 60).toFixed(3);

        // Return result of type HH:MM:SS.mmm
        return (hours < 10 ? "0" + hours : hours) + ":"
            + (minutes < 10 ? "0" + minutes : minutes) + ":"
            + (seconds  < 10 ? "0" + seconds : seconds);
    };

    /******************************************************************************************************
     * Converts JSON from Amara (http://www.universalsubtitles.org/api/1.0/subtitles/) into WebVTT format.
     * Each caption in WebVTT looks like:
     *  empty line
     *  HH:MM:SS.mmm --> HH:MM:SS.mmm
     *  Caption text
     *
     *****************************************************************************************************/
    fluid.videoPlayer.amaraJsonToVTT = function (json) {
        var vtt = "WEBVTT";

        for (var i = 0; i < json.length; i++) {
            var startTime = fluid.videoPlayer.millisToHmsm(json[i].start_time);
            var endTime = fluid.videoPlayer.millisToHmsm(json[i].end_time);
            vtt = vtt.concat("\n\n", startTime, " --> ", endTime, "\n", json[i].text);
        }

        return vtt;
    };

    fluid.videoPlayer.fetchAmaraJson = function (videoUrl, callback) {
        // No point continuing because we can't get a useful JSONP response without the url and a callback
        if (!videoUrl || !callback) {
            return;
        }

        // Hard coded URL to amara here 
        var url = encodeURI("http://www.universalsubtitles.org/api/1.0/subtitles/?video_url=" + videoUrl + "&callback=?");

        $.getJSON(url, callback);
    };

})(jQuery);
