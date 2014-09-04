// note.js

jQuery(function($){
    $('#topics').selectize({
        load: function(query, callback) {
            var url = $('#topic-search').prop('href').replace('{q}', encodeURIComponent(query));
            calli.getJSON(url).then(function(json){
                return json.results.bindings.map(function(bindings){
                    return {
                        value: bindings.resource.value,
                        text: bindings.label.value
                    };
                });
            }).then(callback, function(error){
                callback();
                return calli.error(error);
            });
        },
        create: function(label, callback) {
            var url = window.location.pathname + '/' + calli.slugify(label);
            calli.headText(url).then(function(){
                return url; // already exists
            }, function(xhr) {
                if (xhr.status != 404) return calli.reject(xhr);
                return calli.createResource('#topics', '?create=' + encodeURIComponent($('#topic').prop('href')) + '#' + encodeURIComponent(label));
            }).then(function(resource){
                return resource && {
                    value: resource,
                    text: resource.replace(/.*\//,'')
                };
            }).then(callback, function(error){
                callback();
                return calli.error(error);
            });
        }
    });
});