import Ember from 'ember';
import Transform from 'ember-data/transform';
import BannerItem from 'ghost/models/banner-item';

const {isArray} = Ember;
const emberA = Ember.A;

export default Transform.extend({
    deserialize(serialized) {
        let bannerItems, settingsArray;

        try {
            settingsArray = JSON.parse(serialized) || [];
        } catch (e) {
            settingsArray = [];
        }

        bannerItems = settingsArray.map((itemDetails) => {
            return BannerItem.create(itemDetails);
        });

        return emberA(bannerItems);
    },

    serialize(deserialized) {
        let settingsArray;

        if (isArray(deserialized)) {
            settingsArray = deserialized.map((item) => {
                let label = item.get('label').trim();
                let url = item.get('url').trim();

                return {label, url};
            }).compact();
        } else {
            settingsArray = [];
        }

        return JSON.stringify(settingsArray);
    }
});
