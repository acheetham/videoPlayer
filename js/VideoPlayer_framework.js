/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, window, fluid_1_5*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */


var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {

    fluid.isTracing = false;
    
    // feature detection functions to be used by the progressive enhancement system
    fluid.registerNamespace("fluid.browser");
    fluid.browser.nativeVideoSupport = function () {
        return !!document.createElement('video').canPlayType;
    };

// TODO: move into DataBinding
    fluid.linearRangeGuard = function(min, max) {
        return function (model, changeRequest, applier) {
            var newValue = changeRequest.value;
    
            if (newValue < min) {
                newValue = min;
            } else if (newValue > max) {
                newValue = max;
            }
            changeRequest.value = newValue;
        }
    };


    
    
    // A "mini-grade" to ease the work of dealing with "modelPath" idiom components - this
    // is only desirable until changeApplier relay gets into the core framework
    fluid.defaults("fluid.videoPlayer.indirectReader", {
        gradeNames: ["fluid.modelComponent", "autoInit"],
        preInitFunction: "fluid.videoPlayer.makeIndirectReader"
    });
    
    fluid.videoPlayer.makeIndirectReader = function(that) {
         that.readIndirect = function(pathName) {
             return fluid.get(that.model, fluid.get(that.options, pathName));
         };
         that.writeIndirect = function(pathName, value, source) {
             fluid.fireSourcedChange(that.applier, fluid.get(that.options, pathName), value, source);
         };
    };
    
    
})(jQuery, fluid_1_5);
    