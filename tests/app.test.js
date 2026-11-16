const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function iniciar(script, { dark = false, legacy = false, controls = true } = {}) {
    const clases = new Set();
    function elemento() {
        const listeners = {};
        return {
            listeners,
            addEventListener: (type, listener) => { listeners[type] = listener; },
            classList: {
                toggle(name, force) {
                    const enabled = force === undefined ? !clases.has(name) : force;
                    if (enabled) clases.add(name);
                    else clases.delete(name);
                    return enabled;
                }
            }
        };
    }
    const body = elemento();
    const menu = elemento();
    const navigation = elemento();
    const themeButton = elemento();
    const preference = { matches: dark };
    preference[legacy ? 'addListener' : 'addEventListener'] = function (type, listener) {
        this.change = legacy ? type : listener;
    };
    const queries = [];
    const document = {
        body,
        documentElement: { nodeName: 'HTML', className: '' },
        addEventListener: (type, listener) => { document.ready = listener; },
        querySelector(selector) {
            queries.push(selector);
            if (!controls) return null;
            return {
                '.mobile-menu': menu,
                '.header .navegacion': navigation,
                '.dark-mode-boton': themeButton
            }[selector];
        }
    };
    vm.runInNewContext(script, {
        document,
        window: { matchMedia: () => preference },
        Image: function () {},
        setTimeout: callback => callback()
    });
    document.ready();
    return { clases, menu, themeButton, preference, queries };
}

for (const file of ['src/js/app.js', 'build/js/bundle.min.js']) {
    const script = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    const app = iniciar(script);
    assert(!app.clases.has('dark-mode'), file);
    app.themeButton.listeners.click();
    assert(app.clases.has('dark-mode'), 'El boton debe activar el tema oscuro');
    app.preference.change({ matches: false });
    assert(!app.clases.has('dark-mode'), 'Debe seguir los cambios del sistema');
    app.preference.change({ matches: true });
    assert(app.clases.has('dark-mode'));
    const queriesBeforeClicks = app.queries.length;
    app.menu.listeners.click();
    assert(app.clases.has('mostrar'));
    app.menu.listeners.click();
    assert(!app.clases.has('mostrar'));
    assert.strictEqual(app.queries.length, queriesBeforeClicks, 'No debe buscar el menu en cada clic');
    assert(iniciar(script, { dark: true }).clases.has('dark-mode'));
    assert.doesNotThrow(() => iniciar(script, { controls: false }));
    const legacy = iniciar(script, { legacy: true });
    legacy.preference.change({ matches: true });
    assert(legacy.clases.has('dark-mode'));
}

const bundlePath = path.join(__dirname, '../build/js/bundle.min.js');
const bundle = fs.readFileSync(bundlePath, 'utf8');
const mapName = bundle.match(/sourceMappingURL=(\S+)/)[1];
const map = JSON.parse(fs.readFileSync(path.join(path.dirname(bundlePath), mapName), 'utf8'));
assert.strictEqual(map.file, 'bundle.min.js');
console.log('OK: menu, tema, controles ausentes, compatibilidad y source map.');
