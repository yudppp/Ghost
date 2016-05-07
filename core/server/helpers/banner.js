// ### Banner Helper
// `{{banner}}`
// Outputs banner menu of static urls

var _               = require('lodash'),
    hbs             = require('express-hbs'),
    i18n            = require('../i18n'),

    errors          = require('../errors'),
    template        = require('./template'),
    banner;

banner = function (options) {
    /*jshint unused:false*/
    var bannerData = options.data.blog.banner,
        currentUrl = options.data.root.relativeUrl,
        self = this,
        output,
        data;

    if (!_.isObject(bannerData) || _.isFunction(bannerData)) {
        return errors.logAndThrowError(i18n.t('warnings.helpers.banner.invalidData'));
    }

    if (bannerData.filter(function (e) {
        return (_.isUndefined(e.label) || _.isUndefined(e.url));
    }).length > 0) {
        return errors.logAndThrowError(i18n.t('warnings.helpers.banner.valuesMustBeDefined'));
    }

    // check for non-null string values
    if (bannerData.filter(function (e) {
        return ((!_.isNull(e.label) && !_.isString(e.label)) ||
            (!_.isNull(e.url) && !_.isString(e.url)));
    }).length > 0) {
        return errors.logAndThrowError(i18n.t('warnings.helpers.banner.valuesMustBeString'));
    }

    function _slugify(label) {
        return label.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }

    // strips trailing slashes and compares urls
    function _isCurrentUrl(href, currentUrl) {
        var strippedHref = href.replace(/\/+$/, ''),
            strippedCurrentUrl = currentUrl.replace(/\/+$/, '');
        return strippedHref === strippedCurrentUrl;
    }

    // {{banner}} should no-op if no data passed in
    if (bannerData.length === 0) {
        return new hbs.SafeString('');
    }

    output = bannerData.map(function (e) {
        var out = {};
        out.current = _isCurrentUrl(e.url, currentUrl);
        out.label = e.label;
        out.slug = _slugify(e.label);
        out.url = hbs.handlebars.Utils.escapeExpression(e.url);
        out.secure = self.secure;
        return out;
    });

    data = _.merge({}, {banner: output});

    return template.execute('banner', data, options);
};

module.exports = banner;
