﻿
var CoreField = require('../core-field/core-field.js'),
    application = require('../../framework/Application.js'),
    host = require('./host.jsx');

require('./core-colorbox.less');

/**
 * A custom color field that looks more like the Photoshop one.
 */
var component = CoreField.extend({

    template: require('./core-colorbox.html'),

    twoway: true,

    data: {

        /**
         * Field value.
         * @type String
         * @default ''
         */
        value: '',

    },

    oninit: function ()
    {
        this._super();

        this.observe('value', function (newValue)
        {
            if (this.field)
            {
                this.field.style.background = newValue;
            }

        }), { init: false };

        this.colorClickHandler = this.colorClickHandler.bind(this);
    },

    onrender: function ()
    {
        this._super();
        this.field.addEventListener('click', this.colorClickHandler);
        this.field.style.background = this.get('value');
    },

    onunrender: function ()
    {
        this.field.removeEventListener('click', this.colorClickHandler);
        this._super();
    },

    getField: function ()
    {
        this.field = this.find('div');
    },

    colorClickHandler: function (e)
    {
        if (this.get('disabled'))
        {
            return;
        }

        this.set('disabled', true);

        // Open Photoshop color picker
        var params = 'var params = { baseColor: "' + this.get('value') + '" };';
        application.cep.evalScript(params + host).bind(this).then(function (color)
        {
            this.set('disabled', false);

            if (typeof color === 'string' && color.length === 7)
            {
                this.set('value', color);
            }
            else
            {
                throw new TypeError('Invalid color: ' + color);
            }

        }).catch(function (e)
        {
            application.logger.error('Error while opening color picker', e);

        });
    },

});

module.exports = component;
