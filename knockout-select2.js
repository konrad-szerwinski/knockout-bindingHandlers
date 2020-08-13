'use strict'

ko.bindingHandlers.select2 = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext)
    {
        let select2element = $(element);
 
        let options = ko.unwrap(valueAccessor());

        // This allows user to pass observable or array data
        options.data = ko.unwrap(options.data);
        let selected = allBindings.get('selectedOptions');

        if (selected == null) 
            throw Error("No observable binded to \"selectedOptions\".")

        select2element.empty();

        // Mapping for custom fields
        let isCustomFields = options.fields != null;
        if (isCustomFields) {
            if (options.fields.id == null || options.fields.text == null)
                throw Error("One of fields parameter is not set. Please fill all necessary parameters")

            let fields = options.fields;
            let newData = options.data.map(function (entity) {
                return {id: entity[fields.id], text: entity[fields.text]}
            })
            options.data = newData;
        }

        // Adding placeholder item for non-multiple select
        let isMultiple = select2element.prop('multiple') || options.multiple;
        if (options.placeholder != null && !isMultiple)
            options.data.unshift({id: '-1', text: ''});

        select2element.select2(options);

        selected.subscribe(function () {
            select2element.val(selected()).trigger('change.select2');
        });
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext)
    {
        let select2element = $(element);

        let options = ko.unwrap(valueAccessor());
        options.data = ko.unwrap(options.data);

        select2element.empty();

        // Mapping for custom fields
        let isCustomFields = options.fields != null;
        if (isCustomFields) {
            let fields = options.fields;
            let newData = options.data.map(function (entity) {
                return {id: entity[fields.id], text: entity[fields.text]}
            })
            options.data = newData;
        }

        // Adding placeholder item for non-multiple select
        let isMultiple = select2element.prop('multiple') || options.multiple;
        if (options.placeholder != null && !isMultiple)
            options.data.unshift({id: '-1'});

        select2element.select2(options);
        select2element.trigger('change');
    },
}