var baseUrl = 'http://127.0.0.1:3000'
var utils = {
    ajax: function (options) {
        options.url = baseUrl + options.url
        $.ajax(options)
    }
}