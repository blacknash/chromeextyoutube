
document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('searchForm').addEventListener('submit', search);

  function search() {
    event.preventDefault();
    chrome.identity.getAuthToken({
        interactive: false,
      }, function (token) {

      if (!token) {
      } else {
        var search = document.getElementById('searchText').value,
          clearstring = search.replace(/[|&;$%@'<>()+,]/g, ''),
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
            document.getElementById('videos').innerHTML = '';
            document.getElementById('videos').className = '';
            document.getElementById('video').innerHTML = '';

            var info = JSON.parse(xhr.responseText);

            for (var i = 0, len = info.items.length; i < len; i++) {
              var selected = info.items[i];
              if (selected.id.kind == 'youtube#video') {
                var div = document.createElement('div');
                var txt = document.createElement('h2');
                var img = document.createElement('img');
                var ins = document.createElement('div');
                var ply = document.createElement('span');
                var ntb = document.createElement('span');

                div.className = 'card';
                ins.className = 'desc';

                img.src = selected.snippet.thumbnails.default.url;
                txt.innerText = selected.snippet.title;
                ntb.innerText = 'open in tab';
                ply.innerText = 'play video';

                ply.addEventListener('click', function(){
                  document.getElementById('videos').className = 'hide';
                  var video = document.createElement('iframe');
                  video.src = 'http://youtube.com/embed/'+selected.id.videoId+'?autoplay=1';
                  document.getElementById('video').appendChild(video);
                  document.getElementById('searchText').value = "";
                });

                ntb.addEventListener('click', function(){
                  chrome.tabs.create({url: 'http://youtube.com/watch?v='+selected.id.videoId});
                });

                ins.appendChild(txt);
                ins.appendChild(ply);
                ins.appendChild(ntb);
                div.appendChild(img);
                div.appendChild(ins);
                document.getElementById('videos').appendChild(div);
              }
            }
          }
        }
      }
      }
    );
  }
});