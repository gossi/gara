function mixin(target, source) {
	for (var p in source) {
		target[p] = source[p];
	}
}

TestCase.prototype.mixin = function (source) {
	mixin(this, source);
}