var overrideScript = document.createElement('script');
overrideScript.src = chrome.extension.getURL('js/override.js');
overrideScript.onload = function () {
		this.parentNode.removeChild(this);
};
var h = document.head || document.documentElement;
h.insertBefore(overrideScript, h.childNodes[0]);
