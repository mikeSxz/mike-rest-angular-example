String.prototype.capitalize = function (lower) {
    if (this.indexOf(".") > -1) {
        var splices = this.split(" ");
        var completeString = "";
        var currentLength = splices.length;
        $.each(splices, function (i, o) {
            if (o.indexOf(".") > -1 || o.indexOf("&") > -1) {
                if (currentLength - 1 !== i) {
                    completeString += splices[i].charAt(0).toUpperCase() + splices[i].slice(1).toUpperCase() + " ";
                } else {
                    completeString += splices[i].charAt(0).toUpperCase() + splices[i].slice(1).toUpperCase();
                }
            } else {
                if (currentLength - 1 !== i) {
                    completeString += splices[i].charAt(0).toUpperCase() + splices[i].slice(1).toLowerCase() + " ";
                } else {
                    completeString += splices[i].charAt(0).toUpperCase() + splices[i].slice(1).toLowerCase();
                }
            }
        });

        return completeString;
    } else {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    }
};

function callServiceAG($http, url, params, exito, error) {
    var response = $http.get(url,
            params, {
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded", 'X-Requested-With': 'XMLHttpRequest'
                }
            }
    );
    if (error !== null) {
        response.then(exito, error);
    } else {
        response.then(exito);
    }
}