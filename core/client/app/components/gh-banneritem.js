import Ember from 'ember';
import ValidationState from 'ghost/mixins/validation-state';
import SortableItem from 'ember-sortable/mixins/sortable-item';

const {Component, computed, run} = Ember;
const {alias, readOnly} = computed;

export default Component.extend(ValidationState, SortableItem, {
    classNames: 'gh-blogbanner-item',
    classNameBindings: ['errorClass', 'bannerItem.isNew::gh-blogbanner-item--sortable'],

    new: false,
    handle: '.gh-blogbanner-grab',

    model: alias('bannerItem'),
    errors: readOnly('bannerItem.errors'),

    errorClass: computed('hasError', function () {
        if (this.get('hasError')) {
            return 'gh-blogbanner-item--error';
        }
    }),

    keyPress(event) {
        // enter key
        if (event.keyCode === 13 && this.get('bannerItem.isNew')) {
            event.preventDefault();
            run.scheduleOnce('actions', this, function () {
                this.send('addItem');
            });
        }
    },

    actions: {
        addItem() {
            this.sendAction('addItem');
        },

        deleteItem(item) {
            this.sendAction('deleteItem', item);
        },

        updateUrl(value) {
            this.sendAction('updateUrl', value, this.get('bannerItem'));
        },

        clearLabelErrors() {
            this.get('bannerItem.errors').remove('label');
        },

        clearUrlErrors() {
            this.get('bannerItem.errors').remove('url');
        }
    }
});
