!function(a,b){function c(a,b){return a&&b&&a.type===b.type&&a.name===b.name&&m(a.metaData,b.metaData)}function d(a){try{if("function"!=typeof a)return a;if(!a.bugsnag){var b=i();a.bugsnag=function(){if(F=b,!I){var c=a.apply(this,arguments);return F=null,c}try{return a.apply(this,arguments)}catch(d){throw w("autoNotify",!0)&&(H.notifyException(d,null,null,"error"),D()),d}finally{F=null}},a.bugsnag.bugsnag=a.bugsnag}return a.bugsnag}catch(c){return a}}function e(){if(P){var b=function(a){if(y("autoBreadcrumbsClicks")){var b,c;try{b=n(a.target),c=o(a.target)}catch(d){b="[hidden]",c="[hidden]",l("Cross domain error when tracking click event. See https://docs.bugsnag.com/platforms/browsers/faq/#3-cross-origin-script-errors")}H.leaveBreadcrumb({type:"user",name:"UI click",metaData:{targetText:b,targetSelector:c}})}};a.addEventListener("click",b,!0)}}function f(){function b(a,b){y("autoBreadcrumbsConsole")&&H.leaveBreadcrumb({type:"log",name:"Console output",metaData:{severity:a,message:Array.prototype.slice.call(b).join(", ")}})}if("undefined"!=typeof a.console){var c=console.log,d=console.warn,e=console.error;H.enableAutoBreadcrumbsConsole=function(){H.autoBreadcrumbsConsole=!0,k(console,"log",function(){b("log",arguments)}),k(console,"warn",function(){b("warn",arguments)}),k(console,"error",function(){b("error",arguments)})},H.disableAutoBreadcrumbsConsole=function(){H.autoBreadcrumbsConsole=!1,console.log=c,console.warn=d,console.error=e},y("autoBreadcrumbsConsole")&&H.enableAutoBreadcrumbsConsole()}}function g(){function b(a){return a.split("#")[1]||""}function c(a){var c=a.oldURL,d=a.newURL,e={};return c&&d?(e.from=b(c),e.to=b(d)):e.to=location.hash,{type:"navigation",name:"Hash changed",metaData:e}}function d(){return{type:"navigation",name:"Navigated back"}}function e(){return{type:"navigation",name:"Page hidden"}}function f(){return{type:"navigation",name:"Page shown"}}function g(){return{type:"navigation",name:"Page loaded"}}function h(){return{type:"navigation",name:"DOMContentLoaded"}}function i(a,b,c,d){var e=location.pathname+location.search+location.hash;return{type:"navigation",name:"History "+a,metaData:{from:e,to:d||e,prevState:history.state,nextState:b}}}function j(a,b,c){return i("pushState",a,b,c)}function l(a,b,c){return i("replaceState",a,b,c)}function m(a){return function(){y("autoBreadcrumbsNavigation")&&H.leaveBreadcrumb(a.apply(null,arguments))}}if(P&&a.history&&a.history.state&&a.history.pushState&&a.history.pushState.bind){var n=history.pushState,o=history.replaceState;H.enableAutoBreadcrumbsNavigation=function(){H.autoBreadcrumbsNavigation=!0,k(history,"pushState",m(j)),k(history,"replaceState",m(l))},H.disableAutoBreadcrumbsNavigation=function(){H.autoBreadcrumbsNavigation=!1,history.pushState=n,history.replaceState=o},a.addEventListener("hashchange",m(c),!0),a.addEventListener("popstate",m(d),!0),a.addEventListener("pagehide",m(e),!0),a.addEventListener("pageshow",m(f),!0),a.addEventListener("load",m(g),!0),a.addEventListener("DOMContentLoaded",m(h),!0),y("autoBreadcrumbsNavigation")&&H.enableAutoBreadcrumbsNavigation()}}function h(){Q=!1}function i(){var a=document.currentScript||F;if(!a&&Q){var b=document.scripts||document.getElementsByTagName("script");a=b[b.length-1]}return a}function j(a){var b=i();b&&(a.script={src:b.src,content:w("inlineScript",!0)?b.innerHTML:""})}function k(a,b,c){var d=a[b];a[b]=function(){c.apply(this,arguments),"function"==typeof d&&d.apply(this,arguments)}}function l(b){var c=w("disableLog"),d=a.console;void 0===d||void 0===d.log||c||d.log("[Bugsnag] "+b)}function m(a,b){return s(a)===s(b)}function n(a){var b=a.textContent||a.innerText||"";return("submit"===a.type||"button"===a.type)&&(b=a.value),b=b.replace(/^\s+|\s+$/g,""),p(b,140)}function o(a){var b=[a.tagName];if(a.id&&b.push("#"+a.id),a.className&&a.className.length){var c="."+a.className.split(" ").join(".");b.push(c)}var d=b.join("");if(!document.querySelectorAll||!Array.prototype.indexOf)return d;try{if(1===document.querySelectorAll(d).length)return d}catch(e){return d}if(a.parentNode.childNodes.length>1){var f=Array.prototype.indexOf.call(a.parentNode.childNodes,a)+1;d=d+":nth-child("+f+")"}return 1===document.querySelectorAll(d).length?d:a.parentNode?o(a.parentNode)+" > "+d:d}function p(a,b){var c="(...)";return a&&a.length>b?a.slice(0,b-c.length)+c:a}function q(a){return"[object Array]"===Object.prototype.toString.call(a)}function r(a,b,c){var d=(c||0)+1,e=w("maxDepth",O);if(c>e)return"[RECURSIVE]";if("string"==typeof a)return p(a,b);if(q(a)){for(var f=[],g=0;g<a.length;g++)f[g]=r(a[g],b,d);return f}if("object"==typeof a&&null!=a){var h={};for(var i in a)a.hasOwnProperty(i)&&(h[i]=r(a[i],b,d));return h}return a}function s(b,c,d){var e=w("maxDepth",O);if(d>=e)return encodeURIComponent(c)+"=[RECURSIVE]";d=d+1||1;try{if(a.Node&&b instanceof a.Node)return encodeURIComponent(c)+"="+encodeURIComponent(C(b));var f=[];for(var g in b)if(b.hasOwnProperty(g)&&null!=g&&null!=b[g]){var h=c?c+"["+g+"]":g,i=b[g];f.push("object"==typeof i?s(i,h,d):encodeURIComponent(h)+"="+encodeURIComponent(i))}return f.sort().join("&")}catch(j){return encodeURIComponent(c)+"="+encodeURIComponent(""+j)}}function t(a,b,c){if(null==b)return a;if(c>=w("maxDepth",O))return"[RECURSIVE]";a=a||{};for(var d in b)if(b.hasOwnProperty(d))try{a[d]=b[d].constructor===Object?t(a[d],b[d],c+1||1):b[d]}catch(e){a[d]=b[d]}return a}function u(a,b){a+="?"+s(b)+"&ct=img&cb="+(new Date).getTime();var c=w("notifyHandler");if("xhr"===c){var d=new XMLHttpRequest;d.open("GET",a,!0),d.send()}else{var e=new Image;e.src=a}}function v(a){var b={},c=/^data\-([\w\-]+)$/;if(a)for(var d=a.attributes,e=0;e<d.length;e++){var f=d[e];if(c.test(f.nodeName)){var g=f.nodeName.match(c)[1];b[g]=f.value||f.nodeValue}}return b}function w(a,b){R=R||v(Y);var c=void 0!==H[a]?H[a]:R[a.toLowerCase()];return"false"===c&&(c=!1),void 0!==c?c:b}function x(a){return a&&a.match(S)?!0:(l("Invalid API key '"+a+"'"),!1)}function y(a){var b=w("autoBreadcrumbs",!0);return w(a,b)}function z(b,c){var d=w("apiKey");if(x(d)&&N){N-=1;var e=w("releaseStage","production"),f=w("notifyReleaseStages");if(f){for(var g=!1,h=0;h<f.length;h++)if(e===f[h]){g=!0;break}if(!g)return}var i=[b.name,b.message,b.stacktrace].join("|");if(i!==G){G=i;var j={device:{time:(new Date).getTime()}},k={notifierVersion:W,apiKey:d,projectRoot:w("projectRoot")||a.location.protocol+"//"+a.location.host,context:w("context")||a.location.pathname,user:w("user"),metaData:t(t(j,w("metaData")),c),releaseStage:e,appVersion:w("appVersion"),url:a.location.href,userAgent:navigator.userAgent,language:navigator.language||navigator.userLanguage,severity:b.severity,name:b.name,message:b.message,stacktrace:b.stacktrace,file:b.file,lineNumber:b.lineNumber,columnNumber:b.columnNumber,breadcrumbs:K,payloadVersion:"3"},m=H.beforeNotify;if("function"==typeof m){var n=m(k,k.metaData);if(n===!1)return}return 0===k.lineNumber&&/Script error\.?/.test(k.message)?l("Ignoring cross-domain or eval script error. See https://docs.bugsnag.com/platforms/browsers/faq/#3-cross-origin-script-errors"):void u(w("endpoint")||V,k)}}}function A(){var a,b,c=10,d="[anonymous]";try{throw new Error("")}catch(e){a="<generated>\n",b=B(e)}if(!b){a="<generated-ie>\n";var f=[];try{for(var g=arguments.callee.caller.caller;g&&f.length<c;){var h=T.test(g.toString())?RegExp.$1||d:d;f.push(h),g=g.caller}}catch(i){l(i)}b=f.join("\n")}return a+b}function B(a){return a.stack||a.backtrace||a.stacktrace}function C(a){if(a){var b=a.attributes;if(b){for(var c="<"+a.nodeName.toLowerCase(),d=0;d<b.length;d++)b[d].value&&"null"!==b[d].value.toString()&&(c+=" "+b[d].name+'="'+b[d].value+'"');return c+">"}return a.nodeName}}function D(){J+=1,a.setTimeout(function(){J-=1})}function E(a,b,c){var d=a[b],e=c(d);a[b]=e}var F,G,H={},I=!0,J=0,K=[],L=40,M="BugsnagNotify",N=10,O=5;H.breadcrumbLimit=20,H.noConflict=function(){return a.Bugsnag=b,"undefined"==typeof b&&delete a.Bugsnag,H},H.refresh=function(){N=10},H.notifyException=function(a,b,c,d){if(!a){var e="Bugsnag.notifyException() was called with no arguments";return l(e),void H.notify(M,e)}return"string"==typeof a?(l("Bugsnag.notifyException() was called with a string. Expected instance of Error. To send a custom message instantiate a new Error or use Bugsnag.notify('<string>'). see https://docs.bugsnag.com/platforms/browsers/#reporting-handled-exceptions"),void H.notify.apply(null,arguments)):(b&&"string"!=typeof b&&(c=b,b=void 0),c||(c={}),j(c),void z({name:b||a.name,message:a.message||a.description,stacktrace:B(a)||A(),file:a.fileName||a.sourceURL,lineNumber:a.lineNumber||a.line,columnNumber:a.columnNumber?a.columnNumber+1:void 0,severity:d||"warning"},c))},H.notify=function(b,c,d,e){b||(b=M,c="Bugsnag.notify() was called with no arguments",l(c)),z({name:b,message:c,stacktrace:A(),file:a.location.toString(),lineNumber:1,severity:e||"warning"},d)},H.leaveBreadcrumb=function(a,b){var d="manual",e={type:d,name:"Manual",timestamp:(new Date).getTime()};switch(typeof a){case"object":e=t(e,a);break;case"string":b&&"object"==typeof b?e=t(e,{name:a,metaData:b}):e.metaData={message:a};break;default:return void l("expecting 1st argument to leaveBreadcrumb to be a 'string' or 'object', got "+typeof a)}for(var f=[d,"error","log","navigation","process","request","state","user"],g=!1,h=0;h<f.length;h++)if(f[h]===e.type){g=!0;break}g||(l("Converted invalid breadcrumb type '"+e.type+"' to '"+d+"'"),e.type=d);var i=K.slice(-1)[0];if(c(e,i))i.count=i.count||1,i.count++;else{var j=Math.min(H.breadcrumbLimit,L);e.name=p(e.name,32),K.push(r(e,140)),K.length>j&&(K=K.slice(-j))}};var P="undefined"!=typeof a.addEventListener;H.enableAutoBreadcrumbsConsole=function(){},H.disableAutoBreadcrumbsConsole=function(){},H.enableAutoBreadcrumbsNavigation=function(){},H.disableAutoBreadcrumbsNavigation=function(){},H.enableAutoBreadcrumbsErrors=function(){H.autoBreadcrumbsErrors=!0},H.disableAutoBreadcrumbsErrors=function(){H.autoBreadcrumbsErrors=!1},H.enableAutoBreadcrumbsClicks=function(){H.autoBreadcrumbsClicks=!0},H.disableAutoBreadcrumbsClicks=function(){H.autoBreadcrumbsClicks=!1},H.enableAutoBreadcrumbs=function(){H.enableAutoBreadcrumbsClicks(),H.enableAutoBreadcrumbsConsole(),H.enableAutoBreadcrumbsErrors(),H.enableAutoBreadcrumbsNavigation()},H.disableAutoBreadcrumbs=function(){H.disableAutoBreadcrumbsClicks(),H.disableAutoBreadcrumbsConsole(),H.disableAutoBreadcrumbsErrors(),H.disableAutoBreadcrumbsNavigation()};var Q="complete"!==document.readyState;document.addEventListener?(document.addEventListener("DOMContentLoaded",h,!0),a.addEventListener("load",h,!0)):a.attachEvent("onload",h);var R,S=/^[0-9a-f]{32}$/i,T=/function\s*([\w\-$]+)?\s*\(/i,U="https://notify.bugsnag.com/",V=U+"js",W="3.0.7",X=document.getElementsByTagName("script"),Y=X[X.length-1];if(a.atob){if(a.ErrorEvent)try{0===new a.ErrorEvent("test").colno&&(I=!1)}catch(Z){}}else I=!1;if(w("autoNotify",!0)){E(a,"onerror",function(b){return function(c,d,e,f,g){var h=w("autoNotify",!0),i={};if(!f&&a.event&&(f=a.event.errorCharacter),j(i),F=null,h&&!J){var k=g&&g.name||"window.onerror";z({name:k,message:c,file:d,lineNumber:e,columnNumber:f,stacktrace:g&&B(g)||A(),severity:"error"},i),y("autoBreadcrumbsErrors")&&H.leaveBreadcrumb({type:"error",name:k,metaData:{severity:"error",file:d,message:c,line:e}})}b&&b(c,d,e,f,g)}});var $=function(a){return function(b,c){if("function"==typeof b){b=d(b);var e=Array.prototype.slice.call(arguments,2);return a(function(){b.apply(this,e)},c)}return a(b,c)}};E(a,"setTimeout",$),E(a,"setInterval",$),a.requestAnimationFrame&&E(a,"requestAnimationFrame",function(a){return function(b){return a(d(b))}}),a.setImmediate&&E(a,"setImmediate",function(a){return function(){var b=Array.prototype.slice.call(arguments);return b[0]=d(b[0]),a.apply(this,b)}}),"EventTarget Window Node ApplicationCache AudioTrackList ChannelMergerNode CryptoOperation EventSource FileReader HTMLUnknownElement IDBDatabase IDBRequest IDBTransaction KeyOperation MediaController MessagePort ModalWindow Notification SVGElementInstance Screen TextTrack TextTrackCue TextTrackList WebSocket WebSocketWorker Worker XMLHttpRequest XMLHttpRequestEventTarget XMLHttpRequestUpload".replace(/\w+/g,function(b){var c=a[b]&&a[b].prototype;c&&c.hasOwnProperty&&c.hasOwnProperty("addEventListener")&&(E(c,"addEventListener",function(a){return function(b,c,e,f){try{c&&c.handleEvent&&(c.handleEvent=d(c.handleEvent,{eventHandler:!0}))}catch(g){l(g)}return a.call(this,b,d(c,{eventHandler:!0}),e,f)}}),E(c,"removeEventListener",function(a){return function(b,c,e,f){return a.call(this,b,c,e,f),a.call(this,b,d(c),e,f)}}))})}e(),f(),g(),w("autoBreadcrumbs",!0)&&H.leaveBreadcrumb({type:"navigation",name:"Bugsnag Loaded"}),a.Bugsnag=H,"function"==typeof define&&define.amd?define([],function(){return H}):"object"==typeof module&&"object"==typeof module.exports&&(module.exports=H)}(window,window.Bugsnag);