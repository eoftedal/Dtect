
(function() {
	function slice(args) { return  Array.prototype.slice.call(args); }

    //Ignore feature detection etc.
	function shouldIgnore(stackstring) {
		var ignores = ["jquery.min.js", "modernizr.js", "code.jquery.com"];
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
	function cloakGetter(o, name) {
		var realGetter = o.__lookupGetter__(name);
		o.__defineGetter__(name, function() {
			var s = realGetter.apply(this);
			log("-> " + name, [s]);
			return s;
		});
	}
	var realFn = window.Function;
	window.Function = function() {
		log("new Function", arguments);
		return realFn.apply(window, slice(arguments));
	}
	cloakFunction(window, "setInterval", function(args) { return typeof args[0] == "string"; });
	cloakFunction(window, "setTimeout", function(args) { return typeof args[0] == "string"; });
	cloakFunction(window, "eval");
	cloakFunction(document, "write");
	cloakFunction(document, "writeln");

	cloakGetter(document, "referrer");
	cloakGetter(document, "cookie");
	cloakGetter(document, "location");
	cloakGetter(document, "URL");
	cloakGetter(document, "documentURI");
	cloakGetter(document, "baseURI");
	cloakGetter(window, "name");
	cloakGetter(window, "opener");
	cloakSetter(Element.prototype, "innerHTML", function(args) { return !args[0].match("[0-9]{2}:[0-9]{2}:[0-9]{2}") });







})();

