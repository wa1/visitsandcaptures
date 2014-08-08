// ==UserScript==
// @id             iitc-plugin-uniques
// @name           IITC plugin: Unique Visits and Captures
// @category       Uniques
// @version        0.2.0.20140616.193225
// @namespace      blabla
// @updateURL      blabla
// @downloadURL    blabla
// @description    blabla
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function () { };

    // PLUGIN START ////////////////////////////////////////////////////////

    // use own namespace for plugin
    window.plugin.uniques = function () { };
    window.plugin.uniques.KEY = 'plugin-uniques-data';
    //window.plugin.uniques.KEY = { key: 'plugin-uniques-data', field: 'portals' };
    window.plugin.uniques.portals = {};
    
    /*    
    portals >
        guid >
            visit (0/1)
            capture (0/1)
            - guid
            - lat
            - long
     */

    window.plugin.uniques.addToSidebar = function () {
        if (typeof (Storage) === "undefined") {
            $('#portaldetails > .imgpreview').after("get google chrome or at least firefox, and an updated version");
            return;
        }
        var guid = window.selectedPortal;
        $('#portaldetails > .imgpreview').after(window.plugin.uniques.captureHtml);
        $('#portaldetails > .imgpreview').after(window.plugin.uniques.visitHtml);
        var portal = window.plugin.uniques.portals[guid];
        if (!portal)
            return;
        if (portal.captured === 1) {
            $('.uniqueCaptureToggle').addClass('captureIndicator');    
        }
        if (portal.visited === 1) {
            $('.uniqueVisitToggle').addClass('visitIndicator');
        }
    }

    // Update the localStorage
    window.plugin.uniques.saveStorage = function () {
        localStorage[plugin.uniques.KEY] = JSON.stringify(window.plugin.uniques.portals);
    }
    // Load the localStorage
    window.plugin.uniques.loadStorage = function () {
        window.plugin.uniques.portals = JSON.parse(localStorage[plugin.uniques.KEY]);
    }

    window.plugin.uniques.togglePortalVisited = function () {
        var guid = window.selectedPortal;
        var portal = {};
        //change indicator
        $('.uniqueVisitToggle').toggleClass('visitIndicator');

        if (window.plugin.uniques.portals[guid] !== undefined) {
            portal = window.plugin.uniques.portals[guid];
            if (portal.visited === 0) {
                portal.visited = 1;
            } else {
                portal.visited = 0;
                //You can't have a capture without visiting the portal, i.e. placing a resonator (capturing) gives you a unique visit as well.
                if (portal.captured === 1) {
                    $('.uniqueCaptureToggle').removeClass('captureIndicator');
                    portal.captured = 0;
                }
                
            }
        } else {
            portal.visited = 1;
            //set default captured
            portal.captured = 0;
        }
        window.plugin.uniques.portals[guid] = portal;
        window.plugin.uniques.saveStorage();
    }
    window.plugin.uniques.togglePortalCaptured = function () {
        var guid = window.selectedPortal;
        var portal = {};
        //change indicator
        $('.uniqueCaptureToggle').toggleClass('captureIndicator');
        //if portal gets marked as captured, set to visited as well.

        if (window.plugin.uniques.portals[guid] !== undefined) {
            portal = window.plugin.uniques.portals[guid];
            if (portal.captured === 0) {
                portal.captured = 1;
                //Capturing gives you a unique visit as well (deploying resonator/mod or hacking.
                if (portal.visited === 0) {
                    portal.visited = 1;
                    $('.uniqueVisitToggle').addClass('visitIndicator');
                }
            } else {
                portal.captured = 0;
            }
        } else {
            portal.captured = 1;
            //automatically visited
            portal.visited = 1;
            $('.uniqueVisitToggle').addClass('visitIndicator');
        }
        window.plugin.uniques.portals[guid] = portal;
        window.plugin.uniques.saveStorage();
    }

    window.plugin.uniques.setupCSS = function () {
        //TODO add later
        $('<style>').prop('type', 'text/css').html('.visitIndicator{\nbackground-color:green\n}\n\n.captureIndicator{\nbackground-color:green\n}').appendTo('head');
    }

    window.plugin.uniques.setupContent = function () {
        plugin.uniques.visitHtml = '<a class="uniqueVisitToggle" onclick="window.plugin.uniques.togglePortalVisited();return false;" title="I have visited this portal"><span>&nbsp;[visit]&nbsp;</span></a>';
        plugin.uniques.captureHtml = '<a class="uniqueCaptureToggle" onclick="window.plugin.uniques.togglePortalCaptured();return false;" title="I have captured this portal"><span>&nbsp;[capture]&nbsp;</span></a>';

    }

    var setup = function () {
        window.plugin.uniques.setupCSS();
        window.plugin.uniques.setupContent();
        window.addHook('portalDetailsUpdated', window.plugin.uniques.addToSidebar);
        debugger;
        window.plugin.uniques.loadStorage();
    }

    // PLUGIN END //////////////////////////////////////////////////////////

    setup.info = plugin_info; //add the script info data to the function as a property
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);

