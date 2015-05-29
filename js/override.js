(function() {
	function slice(args) { return  Array.prototype.slice.call(args); }
 
    //Ignore feature detection etc.
	function shouldIgnore(stackstring) {
		var ignores = ["jquery.min.js", "modernizr.js", "code.jquery.com", "chartbeat.js", "google-analytics", "cdn.cxense.com", "l.lp4.io"];
		for (var i in ignores) {
			if (stackstring.indexOf(ignores[i]) > -1) return true;
		}
		return false;
	}
 
	function log(name, args, logCondition) {
		if (logCondition && !logCondition(args)) return;
    	var err = new Error();
    	var trace = err.stack.split(/\n/).slice(3);
    	if (shouldIgnore(trace[0])) return;
    	var args = [name].concat(slice(args));
    	console.groupCollapsed.apply(console, args);
    	console.log(trace.join("\n"));
    	console.groupEnd();
	}
 
	function cloakFunction(o, name, logCondition) {
		var fn = o[name];
		o[name] = function cloakEval() {
			log(name, arguments, logCondition);
			return fn.apply(o, slice(arguments));
		}
	}
	function cloakSetter(o, name, logCondition) {
		var realSetter = o.__lookupSetter__(name);
		o.__defineSetter__(name, function() {
			log("<- " + name, arguments, logCondition);
			return realSetter.apply(this, slice(arguments));
		});
	}
	function cloakGetter(o, name, returnvalue) {
		var realGetter = o.__lookupGetter__(name);
		var realSetter = o.__lookupSetter__(name);
		o.__defineGetter__(name, function() {
			var s = realGetter.apply(this);
			s = (returnvalue ? returnvalue(name) : s) || s;
			log("-> " + name, [s]);
			return s;
		});
		o.__defineSetter__(name, function(val) {
			return realSetter.apply(this, [val]);
		})
	}
 
	var realFn = window.Function;
	window.__defineGetter__("Function", function() {
 
		return realFn;
	})
	
 
	var i = 0;
	function attackString(n) {
		if (true) return "'><img src=x onerror=alert(1) y=abc" + ++i + n+ "-1337> ";
		return null;
	}
 
 
	cloakFunction(window, "setInterval", function(args) { return typeof args[0] == "string"; });
	cloakFunction(window, "setTimeout", function(args) { return typeof args[0] == "string"; });
	cloakFunction(window, "eval");
	cloakFunction(document, "write");
	cloakFunction(document, "writeln");
 
	cloakGetter(document, "referrer", attackString);
	cloakGetter(document, "cookie", attackString);
	cloakGetter(document.location, "hash", attackString);
	cloakGetter(document.location, "search", attackString);
	cloakGetter(document.location, "host", attackString);
	cloakGetter(document.location, "hostname", attackString);
	cloakGetter(document.location, "pathname", attackString);
	cloakGetter(document, "URL", attackString);
	cloakGetter(document, "documentURI", attackString);
	cloakGetter(document, "baseURI", attackString);
	cloakGetter(window, "name", attackString);
	//cloakGetter(window, "opener");
	cloakSetter(Element.prototype, "innerHTML", function(args) { return !args[0].match("[0-9]{2}:[0-9]{2}:[0-9]{2}") });
	cloakSetter(Element.prototype, "src");
	cloakSetter(Element.prototype, "href");
 
 
 
 
})();
