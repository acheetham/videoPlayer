/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid, jqUnit, jQuery, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

fluid.registerNamespace("fluid.tests");

(function ($) {
    $(document).ready(function () {

        var uniSubComponentTests = new jqUnit.TestCase("UniSubComponent Tests");

        uniSubComponentTests.asyncTest("Single video (url as string), no captions", function () {
            jqUnit.expect(1);
            var usc = fluid.unisubComponent({
                urls: {
                    video: "http://build.fluidproject.org/videoPlayer/videoPlayer/demos/videos/ReorganizeFuture/ReorganizeFuture.webm"
                                    /* "A chance to reorganize our future?", no captions */
                },
                listeners: {
                    modelReady: function (data) {
                        jqUnit.assertEquals("No captions were found", 0, data.length);
                        start();
                    }
                }
            });
        });

        uniSubComponentTests.asyncTest("Single video (url as string), two captions", function () {
            jqUnit.expect(1);
            var usc = fluid.unisubComponent({
                urls: {
                    video: "http://www.youtube.com/v/_VxQEPw1x9E" /* "A chance to reorganize our future?", two captions */
                },
                listeners: {
                    modelReady: function (data) {
                        jqUnit.assertTrue("Two (or more) captions were found", data.length >= 2);
                        start();
                    }
                }
            });
        });

        uniSubComponentTests.asyncTest("Single video as array (urls as string), two captions", function () {
            jqUnit.expect(1);
            var usc = fluid.unisubComponent({
                urls: {
                    video: ["http://www.youtube.com/v/_VxQEPw1x9E"] /* "A chance to reorganize our future?", two captions */
                },
                listeners: {
                    modelReady: function (data) {
                        jqUnit.assertTrue("Two (or more) captions were found", data.length >= 2);
                        start();
                    }
                }
            });
        });

        uniSubComponentTests.asyncTest("Multiple videos (urls as strings), multiple captions", function () {
            jqUnit.expect(1);
            var usc = fluid.unisubComponent({
                urls: {
                    video: [
                        "http://www.youtube.com/v/_VxQEPw1x9E", /* "A chance to reorganize our future?", two captions */
                        "http://www.youtube.com/v/Xxj0jWQo6ao" /* "Cultivating loving awareness", nine captions (as of Nov. 30, 2012) */
                       ]
                },
                listeners: {
                    modelReady: function (data) {
                        jqUnit.assertTrue("Eleven (or more) captions were found", data.length >= 11);
                        start();
                    }
                }
            });
        });

        uniSubComponentTests.asyncTest("Multiple videos (urls as src properties), multiple captions", function () {
            jqUnit.expect(1);
            var usc = fluid.unisubComponent({
                urls: {
                    video: [
                        {src:"http://www.youtube.com/v/_VxQEPw1x9E"}, /* "A chance to reorganize our future?", two captions */
                        {src:"http://www.youtube.com/v/Xxj0jWQo6ao"} /* "Cultivating loving awareness", nine captions (as of Nov. 30, 2012) */
                       ]
                },
                listeners: {
                    modelReady: function (data) {
                        jqUnit.assertTrue("Eleven (or more) captions were found", data.length >= 11);
                        start();
                    }
                }
            });
        });

        uniSubComponentTests.asyncTest("Non-http video URLs", function () {
            jqUnit.expect(1);
            var usc = fluid.unisubComponent({
                urls: {
                    video: [
                        {src:"../../demos/videos/ReorganizeFuture/ReorganizeFuture.webm"},
                        {src:"../../demos/videos/ReorganizeFuture/ReorganizeFuture.mp4"}
                       ]
                },
                listeners: {
                    modelReady: function (data) {
                        jqUnit.assertEquals("No captions were found", 0, data.length);
                        start();
                    }
                }
            });
        });

        uniSubComponentTests.asyncTest("Mixed video URLs", function () {
            jqUnit.expect(1);
            var usc = fluid.unisubComponent({
                urls: {
                    video: [
                        {src:"http://www.youtube.com/v/_VxQEPw1x9E"}, /* "A chance to reorganize our future?", two captions */
                        {src:"../../demos/videos/ReorganizeFuture/ReorganizeFuture.mp4"}
                       ]
                },
                listeners: {
                    modelReady: function (data) {
                        jqUnit.assertTrue("Two (or more) captions were found", data.length >= 2);
                        start();
                    }
                }
            });
        });
    });
})(jQuery);
