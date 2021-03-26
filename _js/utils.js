var utils = {
    ajax: function (options) {
        var method = options.method || 'GET'
        method = method.toUpperCase()

        var url = options.url || ''

        var data = options.data || ''

        var mime;

        if (method == 'GET' || method == 'DELETE') {
            mime = 'application/x-www-form-urlencoded'

            if (data) {

                var query = ''

                for (var key in data) {
                    query += key + '=' + data[key] + '&'
                }
                query = '?' + query.slice(0, -1)

                url = url + query
            }

        } else if (method == 'POST' || method == 'PUT') {
            mime = 'application/json'
            if (data) {
                data = JSON.stringify(data)
            }
        }



        var xhr = new XMLHttpRequest()

        //携带cookie
        xhr.withCredentials = true

        xhr.open(method, url, true)

        mime ? xhr.setRequestHeader('Content-Type', mime) : null

        xhr.send(data)

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {

                if (xhr.status == 200) {
                    try {
                        var obj = JSON.parse(xhr.responseText)
                        typeof options.success == 'function' ? options.success(obj) : null
                    } catch (e) {
                        typeof options.error == 'function' ? options.error(xhr.status, e) : null
                    }

                } else {
                    typeof options.error == 'function' ? options.error(xhr.status) : null
                }
            }
        }
    },
    show: function (elem) {
        elem.style.display = "block"
    },
    hide: function (elem) {
        elem.style.display = "none"
    }
}