/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */


(function ($) {
//    fluid.setLogging(fluid.logLevel.TRACE);

    fluid.staticEnvironment.addMediaPanels = fluid.typeTag("fluid.videoPlayer.addMediaPanels");
    var extraSettings = {
        captions: false,
        captionLanguage: "en",
        transcripts: false,
        transcriptLanguage: "en"
    };

    // TODO: These settings panels should be combined into a grade to reduce duplication
    //       (waiting for resolution to http://issues.fluidproject.org/browse/FLUID-5023)

    /**
     * Captions settings panel.
     */
    fluid.defaults("fluid.videoPlayer.captionsSettings", {
        gradeNames: ["fluid.uiOptions.settingsPanel", "autoInit"],
        model: {
            captions: false,
            language: "en"
        },
        strings: {
            language: ["English", "French", "Klingon"]
        },
        controlValues: { 
            language: ["en", "fr", "kg"]
        },
        selectors: {
            captions: ".flc-uiOptions-captions",
            language: ".flc-uiOptions-caption-language"
        },
        produceTree: "fluid.videoPlayer.captionsSettings.produceTree",
        resources: {
            template: {
                url: "../html/CaptionsPanelTemplate.html"
            }
        }
    });

    /**
     * Transcripts settings panel.
     */
    fluid.defaults("fluid.videoPlayer.transcriptsSettings", {
        gradeNames: ["fluid.uiOptions.settingsPanel", "autoInit"],
        model: {
            transcripts: false,
            language: "en"
        },
        strings: {
            language: ["English", "French", "Klingon"]
        },
        controlValues: { 
            language: ["en", "fr", "kg"]
        },
        selectors: {
            transcripts: ".flc-uiOptions-transcripts",
            language: ".flc-uiOptions-transcript-language"
        },
        produceTree: "fluid.videoPlayer.transcriptsSettings.produceTree",
        resources: {
            template: {
                url: "../html/TranscriptsPanelTemplate.html"
            }
        }
    });

    fluid.videoPlayer.captionsSettings.produceTree = function (that) {
        return {
            captions: "${captions}",
            language: {
                optionnames: that.options.strings.language,
                optionlist: that.options.controlValues.language,
                selection: "${language}",
                decorators: {
                    type: "fluid",
                    func: "fluid.uiOptions.selectDecorator"
                }
            }
        };
    };

    fluid.videoPlayer.transcriptsSettings.produceTree = function (that) {
        return {
            transcripts: "${transcripts}",
            language: {
                optionnames: that.options.strings.language,
                optionlist: that.options.controlValues.language,
                selection: "${language}",
                decorators: {
                    type: "fluid",
                    func: "fluid.uiOptions.selectDecorator"
                }
            }
        };
    };

    fluid.defaults("fluid.videoPlayer.mediaPanels", {
        gradeNames: ["fluid.uiOptions", "autoInit"],
        selectors: {
            captionsSettings: ".flc-uiOptions-captions-settings",
            transcriptsSettings: ".flc-uiOptions-transcripts-settings"
        },
        components: {
            captionsSettings: {
                type: "fluid.videoPlayer.captionsSettings",
                container: "{uiOptions}.dom.captionsSettings",
                createOnEvent: "onUIOptionsMarkupReady",
                options: {
                    sourceApplier: "{uiOptions}.applier",
                    rules: {
                        "selections.captions": "captions",
                        "selections.captionLanguage": "language"
                    },
                    listeners: {
                        "{uiOptions}.events.onUIOptionsRefresh": "{that}.refreshView"
                    },
                    resources: {
                        template: "{templateLoader}.resources.captionsSettings"
                    }
                }
            },
            transcriptsSettings: {
                type: "fluid.videoPlayer.transcriptsSettings",
                container: "{uiOptions}.dom.transcriptsSettings",
                createOnEvent: "onUIOptionsMarkupReady",
                options: {
                    sourceApplier: "{uiOptions}.applier",
                    rules: {
                        "selections.transcripts": "transcripts",
                        "selections.transcriptLanguage": "language"
                    },
                    listeners: {
                        "{uiOptions}.events.onUIOptionsRefresh": "{that}.refreshView"
                    },
                    resources: {
                        template: "{templateLoader}.resources.transcriptsSettings"
                    }
                }
            }
        }
    });

    fluid.defaults("fluid.relayGrade", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        components: {
            relay: {
                type: "fluid.videoPlayer.relay"
            }
        }
    });

    fluid.demands("fluid.uiEnhancer", ["fluid.videoPlayer.addMediaPanels"], {
        options: {
            gradeNames: ["fluid.relayGrade", "autoInit"],
            defaultSiteSettings: extraSettings
        }
    });
    fluid.demands("fluid.uiOptions", ["fluid.uiEnhancer"], {
        options: {
            gradeNames: ["fluid.videoPlayer.mediaPanels"]
        }
    });
    fluid.demands("fluid.uiOptions.templateLoader", ["fluid.uiEnhancer"], {
        options: {
            templates: {
                uiOptions: "../html/FatPanelUIOptions.html",
                captionsSettings: "../html/CaptionsPanelTemplate.html",
                transcriptsSettings: "../html/TranscriptsPanelTemplate.html"
            }
        }
    });

    fluid.demands("fluid.uiOptions.fatPanel", ["fluid.uiEnhancer"], {
        options: {
            outerEnhancerOptions: {
                defaultSiteSettings: extraSettings
            }
        }
    });

})(jQuery);
