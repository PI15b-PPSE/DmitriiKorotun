function login(callback) {
    var CLIENT_ID = '362df30b7db846dcae9db7be61fad1c3';
    var REDIRECT_URI = 'https://vk.com';

    function getLoginURL(scopes) {
        return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
            '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
            '&scope=' + encodeURIComponent(scopes.join(' ')) +
            '&response_type=token';
    }

    var url = getLoginURL([
        'user-read-email'
    ]);

    var width = 450,
        height = 730,
        left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);

    window.addEventListener("message", function (event) {
        var hash = JSON.parse(event.data);
        if (hash.type == 'access_token') {
            callback(hash.access_token);
        }
    }, false);

    var w = window.open(url,
        'Spotify',
        'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
    );

}

function getUserData(accessToken) {
    return $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
}

$(document).ready(function () {
    $("#submit").on("click", login);
});


function something() {
    var client_id = '362df30b7db846dcae9db7be61fad1c3',
        response_type = 'code',
        redirect_uri = encodeURIComponent('https://vk.com');

    window.location.href ='https://accounts.spotify.com/authorize/?client_id='
        + client_id + '&response_type=' + response_type
        + '&redirect_uri=' + redirect_uri;
}
