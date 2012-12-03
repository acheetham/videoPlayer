/*
Copyright 2012 OCAD University

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

    "use strict";

    fluid.defaults("fluid.unisubComponent", {
        gradeNames: ["fluid.eventedComponent", "fluid.modelComponent", "autoInit"],
        finalInitFunction: "fluid.unisubComponent.finalInit",
        preInitFunction: "fluid.unisubComponent.preInit",
        model: {
            languages: []
        },
        events: {
            onReady: null,
            modelReady: null,
            onVideo: null
        },
        listeners: {
            onVideo: "{fluid.unisubComponent}.onVideoHandler"
        },
        "api-key": "0c01f5ca0ec8d1dc4e9e0f320a4d1afb1a50273d",
        "api-password": "idrcunisub",
        "api-username": "idrc",
        urls: {
            //api: "https://www.universalsubtitles.org/api2/partners/videos",
            apiLanguages: "http://www.universalsubtitles.org/api/1.0/subtitles/languages/",
            apiVideo: "http://www.universalsubtitles.org/api/1.0/video/",
            video: null
        },
        queryAmaraForCaptions: true
    });
    
    var languageList = [];
    fluid.unisubComponent.preInit = function (that) {
        that.onVideoHandler = function (options) {
            $.ajax({
                dataType: "jsonp",
                url: options.url
            }).done(function (data) {
                languageList = languageList.concat(data);
                if (--videoCount <= 0) {
                    that.applier.requestChange("languages", languageList);
                    that.events.modelReady.fire(languageList);
                    that.events.onReady.fire(that);
                }
            });
        };

        that.loadVideoMetaData = function (options) {
            $.ajax({
                dataType: "jsonp",
                url: options.url
            }).done(function (data) {
                that.applier.requestChange("video", data);
                that.events.onVideo.fire({
                    url: that.buildUrl(that.options.urls.apiLanguages, {
                        video_url: data.video_url
                    })
                });
            });
        };
        
        that.buildUrl = function (baseURL, params) {
            return [baseURL, "?", $.param(params)].join("");
        };
    };
    
    var videoCount;
    fluid.unisubComponent.finalInit = function (that) {
        if (!that.options.queryAmaraForCaptions || !that.options.urls.video) {
            return;
        }

        var videoUrlsArray = [];
        if (typeof that.options.urls.video[0] === "string") {
            videoUrlsArray = fluid.makeArray(that.options.urls.video);
        } else {
            fluid.each(that.options.urls.video, function (vid, index) {
                videoUrlsArray[index] = vid.src;
            });
        }

        videoCount = videoUrlsArray.length;
        fluid.each(videoUrlsArray, function (vidUrl, index) {
            that.loadVideoMetaData({
                url: that.buildUrl(that.options.urls.apiVideo, {
                    username: that.options["api-username"],
                    password: that.options["api-password"],
                    video_url: vidUrl
                })
            });
        });
    };

})(jQuery);