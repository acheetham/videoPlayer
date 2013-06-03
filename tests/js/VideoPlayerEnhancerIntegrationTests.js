/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
 
 */

// Declare dependencies
/*global fluid, jqUnit, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($) {

    fluid.staticEnvironment.vpUIEtests = fluid.typeTag("fluid.vpUIEtests");
    fluid.registerNamespace("fluid.vpUIEtests");

    fluid.demands("fluid.uiOptions.templateLoader", ["fluid.vpUIEtests"], {
        options: {
            templates: {
                uiOptions: "../../html/FatPanelUIOptions.html",
                captionsSettings: "../../html/CaptionsPanelTemplate.html",
                transcriptsSettings: "../../html/TranscriptsPanelTemplate.html"
            }
        }
    });

/*
    fluid.uiEnhancer.finalInit = function (that) {
        that.applier.modelChanged.addListener(
            ADD TEST LISTENERS HERE
        );
    };
    fluid.demands("fluid.uiOptions.templateLoader", ["fluid.addMediaPanels", "fluid.vpUIEtests"], {
        options: {
            templates: {
                uiOptions: "../../html/FatPanelUIOptions.html",
                captionsSettings: "../../html/CaptionsPanelTemplate.html",
                transcriptsSettings: "../../html/TranscriptsPanelTemplate.html"
             }
        }
    });

    $(document).ready(function () {

        jqUnit.module("Video Player Enhancer Integration Tests");

        jqUnit.asyncTest("test", function () {
            jqUnit.expect(1);
            var instance = {
                container: ".videoPlayer-transcript",
                options: {
                    templates: {
                        videoPlayer: {
                            href: "../../html/videoPlayer_template.html"
                        }
                    },
                    listeners: {
                        onReady: function (that) {
                            jqUnit.assert("tests run");
                            jqUnit.start();
                        }
                    }
                }
            };
            fluid.testUtils.initEnhancedVideoPlayer(instance, fluid.staticEnvironment.uiEnhancer.relay);
        });

    });
*/






    // TODO: add test to ensure VP works without UIE on the page!!




    fluid.vpUIEtests.vpOpts = {
        video: {
            sources: [{
                src: "../../demos/videos/ReorganizeFuture/ReorganizeFuture.mp4",
                type: "video/mp4"
            }, {
                src: "../../demos/videos/ReorganizeFuture/ReorganizeFuture.webm",
                type: "video/webm"
            }, {
                src: "http://www.youtube.com/v/_VxQEPw1x9E",
                type: "video/youtube"
            }],
            transcripts: [{
                src: "../../demos/videos/ReorganizeFuture/ReorganizeFuture.transcripts.fr.json",
                type: "JSONcc",
                srclang: "fr",
                label: "French"
            }]
        },
        templates: {
            videoPlayer: {
                href: "../../html/videoPlayer_template.html"
            }
        },
        components: {
            controllers: {
                options: {
                    templates: {
                        controllers: {
                            href: "../../html/videoPlayer_controllers_template.html"
                        },
                        menuButton: {
                            href: "../../html/menuButton_template.html"
                        }
                    }
                }
            }
        }
    };
    fluid.defaults("fluid.vpUIEtests.vpEnhancerIntegration", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            uiEnhancer: {
                type: "fluid.uiEnhancer",
                container: "body",
                options: {
                    gradeNames: ["fluid.uiEnhancer.defaultActions"],
                    tocTemplate: "../../lib/infusion/components/tableOfContents/html/TableOfContents.html"
                }
            },
            videoPlayer: {
                type: "fluid.videoPlayer", // TODO: how to set up relay this way???
                container: ".videoPlayer-transcript",
                createOnEvent: "{uiEnhancer}.events.onCreate",
                options: fluid.vpUIEtests.vpOpts
            },
            videoPlayerTester: {
                type: "fluid.vpUIEtests.videoPlayerTester"
            }
        }
    });

    fluid.vpUIEtests.checkPlayerModel = function (player, path, expected) {
        jqUnit.assert("checkPlayerModel happened runs");
    };

    fluid.uiEnhancer.postInit = function (that) {
        console.log("uiEnhancer.postInit");
        that.applier.modelChanged.addListener("*", function (newModel, oldModel, request) {
            console.log("uiEnhancer model changed: "+request[0].path+" set to "+request[0].value);
        });
    };

    fluid.defaults("fluid.vpUIEtests.videoPlayerTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
        },
        modules: [{
            name: "Test videoPlayer-uiEnhancer integration",
            tests: [{
                expect: 1,
                name: "foo",
                sequence: [{
                    func: "{uiEnhancer}.applier.requestChange",
                    args: ["transcripts", "true"]
                }, {
                    listenerMaker: "fluid.vpUIEtests.checkPlayerModel",
                    makerArgs: ["{videoPlayer}", "displayTranscripts", "true"],
                    spec: {path: "displayTranscripts", priority: "last"},
                    changeEvent: "{videoPlayer}.applier.modelChanged"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "fluid.vpUIEtests.vpEnhancerIntegration"
        ]);
    });

})(jQuery);
