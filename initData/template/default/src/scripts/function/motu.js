define(['jQuery'], function() {
  var simple = document.querySelector('[data-type=simple]');
  if (simple) {
    simple.classList && simple.classList.add('motu_cont');
  }
  //引用魔图主js
  loadJs("https://images.pagechoice.net/data/motu_wap/motu_domain.js");

  function loadJs(url) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'utf-8');
    script.setAttribute('src', url);
    head.appendChild(script);
  }
});