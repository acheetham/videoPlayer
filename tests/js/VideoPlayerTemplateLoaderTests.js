/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
 
 */

// Declare dependencies
/*global fluid, jqUnit, expect, jQuery, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

fluid.registerNamespace("fluid.tests");

(function ($) {
    $(document).ready(function () {

        fluid.defaults("fluid.tests.testComponent", {
            gradeNames: ["fluid.rendererComponent", "autoInit"],
            components: {
                templateLoader: {
                    type: "fluid.videoPlayer.templateLoader",
                    options: {
                        events: {
                            afterFetch: "{testComponent}.events.readyToTest"
                        }
                    }
                }
            },
            resources: {
                resource1: {
                    fetchClass: "testFetchClass",
                    href: "../../html/videoPlayer_template.html"
                }
            },
            events: {
                afterFetch: null
            }
        });
        fluid.demands("fluid.videoPlayer.templateLoader", "fluid.tests.testComponent", {
            options: {
               amalgamateClasses: ["testFetchClass"],
            }
        });

        fluid.tests.initTestComponent = function (testOptions) {
            var opts = fluid.copy(fluid.tests.baseOpts);
            $.extend(true, opts, testOptions);
            return fluid.tests.testComponent("#main", opts);
        };

        var videoPlayerTemplateLoaderTests = new jqUnit.TestCase("Video Player Template Loader Tests");

        videoPlayerTemplateLoaderTests.asyncTest("Template Loader loads template", function () {
            expect(2);
            fluid.fetchResources.primeCacheFromResources("fluid.tests.testComponent");
            var loader = fluid.tests.initTestComponent({
                listeners: {
                    afterFetch: function () {
                        jqUnit.assertTrue("The video player should render", true);
                        jqUnit.assertEquals("There should be exactly one <video> element", 1, $("video").length);
                        start();
                    }
                }
            });
        });
    });
})(jQuery);
