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
                    type: "fluid.videoPlayer.templateLoader"
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
            },
            postInitFunction: "fluid.tests.testComponent.postInit"
        });
        fluid.tests.testComponent.postInit = function (that) {
            that.events.afterFetch.addListener(function () {
                that.options.fetchListener(that)
            });
        };
        fluid.demands("fluid.videoPlayer.templateLoader", "fluid.tests.testComponent", {
            options: {
               amalgamateClasses: ["testFetchClass"],
               events: {
                    afterFetch: "{testComponent}.events.afterFetch"
                }
            }
        });

        fluid.tests.initTestComponent = function (testOptions) {
            return fluid.tests.testComponent("#main", testOptions);
        };

        var videoPlayerTemplateLoaderTests = new jqUnit.TestCase("Video Player Template Loader Tests");

        videoPlayerTemplateLoaderTests.asyncTest("Template Loader: valid path", function () {
            expect(2);
            fluid.fetchResources.primeCacheFromResources("fluid.tests.testComponent");
            var loader= fluid.tests.initTestComponent({
                fetchListener: function (that) {
                    jqUnit.assertTrue("Video player's afterFetch event should fire", true);
                    jqUnit.assertFalse("There should not have been an error loading the template", that.options.resources.resource1.fetchError);
                    start();
                }
            });
        });

        videoPlayerTemplateLoaderTests.asyncTest("Template Loader: invalid path", function () {
            expect(2);
            fluid.fetchResources.primeCacheFromResources("fluid.tests.testComponent");
            var loader= fluid.tests.initTestComponent({
                resources: {
                    resource1: {
                        href: "bad/template/path.html"
                    }
                },
                fetchListener: function (that) {
                    jqUnit.assertTrue("Video player's afterFetch event should fire", true);
                    jqUnit.assertTrue("There should have been an error loading the template", that.options.resources.resource1.fetchError);
                    start();
                }
            });
        });
    });
})(jQuery);
