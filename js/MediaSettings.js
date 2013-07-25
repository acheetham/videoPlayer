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
    fluid.staticEnvironment["fluid--videoPlayer--addMediaPanels"] = fluid.typeTag("fluid.videoPlayer.addMediaPanels");

    fluid.registerNamespace("fluid.videoPlayer");

    fluid.defaults("fluid.videoPlayer.schemas.captions", {
        gradeNames: ["autoInit", "fluid.uiOptions.schemas"],
        schema: {
            "fluid.videoPlayer.captions": {
                type: "boolean",
                "default": false
            }
        }
    });
    fluid.defaults("fluid.videoPlayer.schemas.captionLanguage", {
        gradeNames: ["autoInit", "fluid.uiOptions.schemas"],
        schema: {
            "fluid.videoPlayer.captionLanguage": {
                type: "string",
                "default": "en",
                "enum": ["en", "fr"]
            }
        }
    });
    fluid.defaults("fluid.videoPlayer.schemas.transcripts", {
        gradeNames: ["autoInit", "fluid.uiOptions.schemas"],
        schema: {
            "fluid.videoPlayer.transcripts": {
                type: "boolean",
                "default": false
            }
        }
    });
    fluid.defaults("fluid.videoPlayer.schemas.transcriptLanguage", {
        gradeNames: ["autoInit", "fluid.uiOptions.schemas"],
        schema: {
            "fluid.videoPlayer.transcriptLanguage": {
                type: "string",
                "default": "en",
                "enum": ["en", "fr"]
            }
        }
    });

    fluid.videoPlayer.auxSchema = {
        "namespace": "fluid.uiOptions.vp",
        "templatePrefix": "../lib/infusion/components/uiOptions/html/", // relative path to infusion's templates; works for infusion's templates, but not media panels
        transcripts: {
            type: "fluid.videoPlayer.transcripts",
            panel: {
                type: "fluid.videoPlayer.panels.transcriptsSettings",
                container: ".flc-uiOptions-transcripts-settings",
                template: "../html/MediaPanelTemplate.html"
            }
        },
        transcriptLanguage: {
            type: "fluid.videoPlayer.transcriptLanguage",
            panel: {
                type: "fluid.videoPlayer.panels.transcriptsSettings"
            }
        }
    };

    if (fluid.browser.nativeVideoSupport()) {
        fluid.videoPlayer.auxSchema.captions = {
            type: "fluid.videoPlayer.captions", // this string must match the key in the primarySchema
            panel: {
                type: "fluid.videoPlayer.panels.captionsSettings", // this is the gradeName for the panel
                container: ".flc-uiOptions-captions-settings",
                template: "../html/MediaPanelTemplate.html"
            }
        };
        fluid.videoPlayer.auxSchema.captionLanguage = {
            type: "fluid.videoPlayer.captionLanguage",
            panel: {
                type: "fluid.videoPlayer.panels.captionsSettings"
            }
        };
    }

    fluid.defaults("fluid.videoPlayer.auxSchema.mediaPanels", {
        gradeNames: ["fluid.uiOptions.auxSchema", "autoInit"],
        auxiliarySchema: fluid.videoPlayer.auxSchema
    });

    /**
     * Shared grade for both settings panels
     */
    fluid.defaults("fluid.videoPlayer.panels.mediaSettings", {
        gradeNames: ["fluid.uiOptions.panels", "autoInit"],
        model: {
            show: false,
            language: "en",
            type: "media"
        },
        listeners: {
            onCreate: "fluid.videoPlayer.panels.mediaSettings.toggleLanguageOnShow"
        },
        strings: {
            language: ["English", "French"]
        },
        controlValues: {
            language: ["en", "fr"]
        },
        styles: {
            icon: "fl-icon"
        },
        selectors: {
            type: ".flc-videoPlayer-media-type",
            icon: ".flc-videoPlayer-media-icon",
            show: ".flc-videoPlayer-media-show",
            language: ".flc-videoPlayer-media-language"
        },
        produceTree: "fluid.videoPlayer.panels.mediaSettings.produceTree"
    });
    fluid.videoPlayer.panels.mediaSettings.produceTree = function (that) {
        return {
            icon: {
                decorators: [{
                    type: "addClass",
                    classes: that.options.styles.icon
                }]
            },
            // might be able to use IOC to reference a regular option instead of putting type in model
            type: "${type}",
            show: "${show}",
            language: {
                optionnames: that.options.strings.language,
                optionlist: that.options.controlValues.language,
                selection: "${language}",
                decorators: [{
                    type: "jQuery",
                    func: "prop",
                    args: ["disabled", !that.model.show]
                }]
            }
        };
    };
    fluid.videoPlayer.panels.mediaSettings.toggleLanguageOnShow = function (that) {
        that.applier.modelChanged.addListener("show", function (newModel, oldModel, request) {
            that.locate("language").prop("disabled", !that.model.show);
        });
    };

    /**
     * Captions settings panel.
     */
    fluid.defaults("fluid.videoPlayer.panels.captionsSettings", {
        gradeNames: ["fluid.videoPlayer.panels.mediaSettings", "autoInit"],
        preferenceMap: {
            "fluid.videoPlayer.captions": {
                // the key is the internal model path, the value is the path into the schema
                "model.show": "default"
            },
            "fluid.videoPlayer.captionLanguage": {
                "model.language": "default"
            }
        },
        model: {
            type: "captions"
        },
        styles: {
            icon: "fl-icon-captions"
        }
    });
    /**
     * Transcripts settings panel.
     */
    fluid.defaults("fluid.videoPlayer.panels.transcriptsSettings", {
        gradeNames: ["fluid.videoPlayer.panels.mediaSettings", "autoInit"],
        preferenceMap: {
            "fluid.videoPlayer.transcripts": {
                "model.show": "default"
            },
            "fluid.videoPlayer.transcriptLanguage": {
                "model.language": "default"
            }
        },
        model: {
            type: "transcripts"
        },
        styles: {
            icon: "fl-icon-transcripts"
        }
    });

    /**
     * A grade used to add the relay subcomponent to uiEnhancer
     */
    fluid.defaults("fluid.videoPlayer.vpRelay", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        components: {
            relay: {
                type: "fluid.videoPlayer.relay"
            }
        }
    });

    // Add the relay to UIEnhancer
    fluid.demands("fluid.uiEnhancer", ["fluid.videoPlayer.addMediaPanels"], {
        options: {
            gradeNames: ["fluid.videoPlayer.vpRelay"]
        }
    });


    // this needs to be a demand for resourceLoader instead of templateLoader
    fluid.demands("fluid.uiOptions.resourceLoader", ["fluid.videoPlayer.addMediaPanels"], {
        options: {
            templates: {
                uiOptions: "../html/FatPanelUIOptionsNoNativeVideo.html"
            }
        }
    });

    // this needs to be a demand for resourceLoader instead of templateLoader
    fluid.demands("fluid.uiOptions.resourceLoader", ["fluid.videoPlayer.addMediaPanels", "fluid.browser.nativeVideoSupport"], {
        options: {
            templates: {
                uiOptions: "../html/FatPanelUIOptions.html"
            }
        }
    });

    /**
     * A grade responsible for binding the UIEnhancer relay to the VideoPlayer
     */
    fluid.defaults("fluid.videoPlayer.enhancerBinder", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        listeners: {
            onCreate: "fluid.videoPlayer.enhancerBinder.bindRelay"
        }
    });

    fluid.videoPlayer.enhancerBinder.bindRelay = function (that, callback) {
        callback = callback || fluid.identity;
        // TODO: We need a way to wait for UIE if necessary (see FLUID-5016)
        if (fluid.staticEnvironment.uiEnhancer) {
            fluid.staticEnvironment.uiEnhancer.relay.addTarget(that);
        }
        callback(that);
    };

    // Add the grade to the video player
    fluid.demands("fluid.videoPlayer", ["fluid.videoPlayer.addMediaPanels", "fluid.uiEnhancer"], {
        options: {
            gradeNames: ["fluid.videoPlayer.enhancerBinder"]
        }
    });

})(jQuery);
