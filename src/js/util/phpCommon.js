/**
 *
 Created by zhangzhao on 2017/2/28.
 Email: zhangzhao@gomeplus.com
 */

let page = window.$CONFIG || {};
var keys = Object.keys(page);
for (var i = 0, l = keys.length; i < l; i++) {
    let key = keys[i];
    let val = page[keys[i]];
    var property = Object.getOwnPropertyDescriptor(page, key);
    if (property && property.configurable === false) {
        continue;
    }
    Object.defineProperty(page, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            return val;
        },
        set: function reactiveSetter(newVal) {
            val = newVal;
        }
    });
}

var host = window.location.host;
var env;
if (host.indexOf('uatplus') != -1 || host.indexOf('pre') !== -1) {
    env = 'pre';
} else if (host.indexOf('dev') != -1) {
    env = 'dev';
} else {
    env = 'dist';
}

export {page, env};
