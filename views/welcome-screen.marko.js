// Compiled using marko@4.14.7 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/tagalong$0.0.1/views/welcome-screen.marko",
    components_helpers = require("marko/src/components/helpers"),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_loadTag = marko_helpers.t,
    component_globals_tag = marko_loadTag(require("marko/src/components/taglib/component-globals-tag")),
    init_components_tag = marko_loadTag(require("marko/src/components/taglib/init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/src/taglibs/async/await-reorderer-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<html><head><title>Tag Along Bot</title></head><body>");

  component_globals_tag({}, out);

  out.w("(function(d, s, id){ var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) {return;} js = d.createElement(s); js.id = id; js.src = \"//connect.facebook.net/en_US/messenger.Extensions.js\"; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'Messenger')); <script data-cfasync=\"false\" type=\"text/javascript\" src=\"//p331152.clksite.com/adServe/banners?tid=331152_645035_6&amp;tagid=9\"></script><h1>Tag Along Bot</h1><video id=\"vid\" src=\"https://cdn.glitch.com/0456ed32-e74f-4201-86c5-a368229f8190%2FQUIK_20190114_011426.mp4?1547423127947\" controls autoplay=\"autoplay\"></video>");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "7");

  out.w("</body><script>\n    let vid = document.getElemementById('vid');\n\n    vid.onended = function(evt) {\n      let create_profile = confirm('Ready to create a profile?');\n\n      if (create_profile) {\n        MessengerExtensions.requestCloseBrowser(function success() {\n          // webview closed\n          let redirect_to_create_profile = fetch('');\n        }, function error(err) {\n          // an error occurred\n        });\n      } else {\n        alert(\"Okay when you're ready to create your profile just close this webview and click Create Profile\");\n      }\n    }\n  </script></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.Component = marko_defineComponent({}, marko_template._);

marko_template.meta = {
    id: "/tagalong$0.0.1/views/welcome-screen.marko",
    tags: [
      "marko/src/components/taglib/component-globals-tag",
      "marko/src/components/taglib/init-components-tag",
      "marko/src/taglibs/async/await-reorderer-tag"
    ]
  };
