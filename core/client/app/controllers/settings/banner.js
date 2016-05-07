import Ember from 'ember';
import SettingsSaveMixin from 'ghost/mixins/settings-save';
import BannerItem from 'ghost/models/banner-item';

const {
    Controller,
    RSVP,
    computed,
    inject: {service}
} = Ember;

export default Controller.extend(SettingsSaveMixin, {
    config: service(),
    notifications: service(),

    newBannerItem: null,

    blogUrl: computed('config.blogUrl', function () {
        let url = this.get('config.blogUrl');

        return url.slice(-1) !== '/' ? `${url}/` : url;
    }),

    init() {
        this._super(...arguments);
        this.set('newBannerItem', BannerItem.create({isNew: true}));
    },

    save() {
        let navItems = this.get('model.banner');
        let newBannerItem = this.get('newBannerItem');
        let notifications = this.get('notifications');
        let validationPromises = [];

        if (!newNavItem.get('isBlank')) {
            validationPromises.pushObject(this.send('addItem'));
        }

        navItems.map((item) => {
            validationPromises.pushObject(item.validate());
        });

        return RSVP.all(validationPromises).then(() => {
            return this.get('model').save().catch((err) => {
                notifications.showErrors(err);
            });
        }).catch(() => {
            // TODO: noop - needed to satisfy spinner button
        });
    },

    addNewNavItem() {
        let navItems = this.get('model.banner');
        let newBannerItem = this.get('newBannerItem');

        newNavItem.set('isNew', false);
        navItems.pushObject(newNavItem);
        this.set('newBannerItem', BannerItem.create({isNew: true}));
    },

    actions: {
        addItem() {
            let newBannerItem = this.get('newBannerItem');

            // If the url sent through is blank (user never edited the url)
            if (newBannerItem.get('url') === '') {
                newBannerItem.set('url', '/');
            }

            return newBannerItem.validate().then(() => {
                this.addNewBannerItem();
            });
        },

        deleteItem(item) {
            if (!item) {
                return;
            }

            let bannerItems = this.get('model.banner');

            bannerItems.removeObject(item);
        },

        reorderItems(bannerItems) {
            this.set('model.navigation', bannerItems);
        },

        updateUrl(url, bannerItem) {
            if (!bannerItem) {
                return;
            }

            bannerItem.set('url', url);
        },

        reset() {
            this.set('newBannerItem', BannerItem.create({isNew: true}));
        }
    }
});
