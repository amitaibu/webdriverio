/**
 *
 * Get a css property from a DOM-element selected by given selector. The return value
 * is formatted to be testable. Colors gets parsed via [rgb2hex](https://www.npmjs.org/package/rgb2hex)
 * and all other properties gets parsed via [css-value](https://www.npmjs.org/package/css-value).
 *
 * Note that shorthand CSS properties (e.g. background, font, border, margin, padding, list-style, outline,
 * pause, cue) are not returned, in accordance with the DOM CSS2 specification- you should directly access
 * the longhand properties (e.g. background-color) to access the desired values.
 *
 * <example>
    :getCssProperty.js
    client.getCssProperty('#someElement', 'color').then(function(color) {
        console.log(color);
        // outputs the following:
        // {
        //     property: 'color',
        //     value: 'rgba(0, 136, 204, 1)',
        //     parsed: {
        //         hex: '#0088cc',
        //         alpha: 1,
        //         type: 'color',
        //         rgba: 'rgba(0, 136, 204, 1)'
        //     }
        // }
    });

    client.getCssProperty('#someElement', 'width').then(function(width) {
        console.log(width);
        // outputs the following:
        // {
        //     property: 'width',
        //     value: '100px',
        //     parsed: {
        //         type: 'number',
        //         string: '100px',
        //         unit: 'px',
        //         value: 100
        //     }
        // }
    });

    client.getCssProperty('body', 'font-family').then(function(font) {
        console.log(font);
        // outputs the following:
        // {
        //      property: 'font-family',
        //      value: 'helvetica',
        //      parsed: {
        //          value: [ 'helvetica', 'arial', 'freesans', 'clean', 'sans-serif' ],
        //          type: 'font',
        //          string: 'helvetica, arial, freesans, clean, sans-serif'
        //      }
        //  }
    })
 * </example>
 *
 * @param {String} selector    element with requested style attribute
 * @param {String} cssProperty css property name
 *
 * @uses protocol/elements, protocol/elementIdCssProperty
 * @type property
 *
 */

var Q = require('q'),
    parseCSS = require('../helpers/parseCSS.js'),
    ErrorHandler = require('../utils/ErrorHandler.js');

module.exports = function getCssProperty (selector, cssProperty) {

    /*!
     * parameter check
     */
    if(typeof cssProperty !== 'string') {
        throw new ErrorHandler.CommandError('number or type of arguments don\'t agree with getCssProperty command');
    }

    return this.elements(selector).then(function(res) {

        if(!res.value || res.value.length === 0) {
            // throw NoSuchElement error if no element was found
            throw new ErrorHandler(7);
        }

        var self = this,
            elementIdCssPropertyCommands = [];

        res.value.forEach(function(elem) {
            elementIdCssPropertyCommands.push(self.elementIdCssProperty(elem.ELEMENT, cssProperty));
        });

        return Q.all(elementIdCssPropertyCommands);

    }).then(function(result) {
        return parseCSS(result, cssProperty);
    });

};

