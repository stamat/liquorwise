/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 * Modified by Stamat <nikola.stamatovic@stamat.info>
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var boilerwise = {
    // All pages
    init: function() {
      // JavaScript to be fired on all pages
    },
    finalize: function(a, b, c) {
      // JavaScript to be fired on all pages, after page specific JS after everything else was executed
    },
    // Home page
    'home': function() {
        // JavaScript to be fired on the home page
    },
    // About us page, note the change from about-us to about_us.
    'about_us': function() {
        // JavaScript to be fired on the about us page
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {};
  
  UTIL.namespace = boilerwise;
  
  // Parses arguments in body's attribute data-args that are passed to the functions
  // Arguments are coma sepparated like in array without the need to begin and end with []
  UTIL.argsParse = function(args) {
    if (!args || args.replace(/^\s\s*/, '').replace(/\s\s*$/, '') === '') {
      return [];
    }
    
    if (!args.match(/^\[/gmi)) {
      args = '[' + args;
    }
    
    if (!args.match(/$\]/gmi)) {
      args = args + ']';
    }
    
    args = '{ "arr": ' + args + '}';
    
    try {
      args = JSON.parse(args);
    } catch(e) {
      if (window.console && window.console.error) {
        console.error(e);
      }
      return [];
    }
    
    return args.arr;
  };
  
  UTIL.fire = function(func, args) {
    var namespace = UTIL.namespace;
    
    if (func !== '' &&
        namespace[func] &&
        typeof namespace[func] === 'function') {
      
      namespace[func].apply(null, args);
    }
  };
  
  UTIL.loadEvents= function() {
    var body = document.body;
    var args = UTIL.argsParse($(body).data('args'));
    
    // Fire common init JS
    UTIL.fire('init', args);
    
    // Fire page-specific init JS, and then finalize JS
    $.each(body.className.split(/\s+/), function(i, classnm) {
      //todo: get data args
      
      UTIL.fire(classnm.replace(/-/g, '_'), args);
    });

    // Fire common finalize JS
    UTIL.fire('finalize', args);
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
