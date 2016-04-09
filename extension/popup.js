
document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('searchButton').addEventListener('click', search);
  //
  function search() {
    chrome.identity.getAuthToken({
        interactive: false,
      }, function (token) {

        if (token) {
          var search = document.getElementById('searchText').value,
            clearstring = search.replace(/[|&;$%@"<>()+,]/g, ''),
            xhr = new XMLHttpRequest();

          xhr.open(
            'GET',
            [
              'https://www.googleapis.com/youtube/v3/search?part=snippet&q=',
              clearstring,
              '&access_token=', token
            ].join(''));

          xhr.onreadystatechange = check;
          xhr.send();

          function check() {
            if (xhr.readyState == 4 && xhr.status == 200) {
              var info = JSON.parse(xhr.responseText);
              for (var i = 0, len = info.items.length; i < len; i++) {
                var div = document.createElement("div");
                var text = document.createElement("h2");
                var img = document.createElement("img");

                div.className = "card";
                img.src = info.items[i].snippet.thumbnails.default.url;
                text.innerText = info.items[i].snippet.title;
                div.appendChild(img);
                div.appendChild(text);
                document.getElementById("videos").appendChild(div);
              }
            }
          }
        }
      }
    );
  }
});