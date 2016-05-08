import Ember from 'ember';
import ValidationEngine from 'ghost/mixins/validation-engine';

const {
    computed,
    isBlank
} = Ember;

export default Ember.Object.extend(ValidationEngine, {
    image: '',
    url: '',
    isNew: false,

    validationType: 'bannerItem',

    isComplete: computed('image', 'url', function () {
        let {image, url} = this.getProperties('image', 'url');

        return !isBlank(image) && !isBlank(url);
    }),

    isBlank: computed('image', 'url', function () {
        let {image, url} = this.getProperties('image', 'url');

        return isBlank(image) && isBlank(url);
    })
});
