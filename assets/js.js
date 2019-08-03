window.onscroll = function() {
  scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};

function topFunction() {
  scrollToTop();
}
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    if (this.getAttribute('href') != '#') {
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
var Expand = function() {
  var tile = document.querySelectorAll('.strips__strip');
  var tileLink = document.querySelectorAll('.strips__strip > .strip__content');
  var tileText = document.querySelectorAll('.strips__strip > .strip__content .strip__inner-text');
  var stripClose = document.querySelectorAll('.strip__close');
  var expanded = false;
  var open = function() {
    var tile = this.parentNode;
    if (!expanded) {
      tile.classList.add('strips__strip--expanded');
      this.querySelectorAll('.strip__inner-text')[0].style.transition = 'all .5s .3s cubic-bezier(0.23, 1, 0.32, 1)';
      stripClose[0].classList.add('strip__close--show');
      stripClose[0].transition = 'all .6s 1s cubic-bezier(0.23, 1, 0.32, 1)';
      expanded = true;
    }
  };
  var close = function() {
    // var tile = this.parentNode;
    if (expanded) {
      for (var i = 0; i < tile.length; i++) {
        tile[i].classList.remove('strips__strip--expanded')
      }
      document.querySelectorAll('.strip__inner-text').transition = 'all 0.15s 0 cubic-bezier(0.23, 1, 0.32, 1)';
      stripClose[0].classList.remove('strip__close--show');
      stripClose[0].transition = 'all 0.2s 0s cubic-bezier(0.23, 1, 0.32, 1)';
      expanded = false;
    }
  };
  var modal = document.getElementById("myModal");
  var img = document.getElementById("myImg");
  var modalImg = document.getElementById("img01");
  var captionText = document.getElementById("caption");
  // img.onclick = function(){
  //   modal.style.display = "block";
  //   modalImg.src = this.src;
  //   captionText.innerHTML = this.alt;
  // }
  var openmodal = function() {
    modal.style.display = "block";
    modalImg.src = this.querySelectorAll('.thumbnail img')[0].src;
    captionText.innerHTML = this.querySelectorAll('.thumbnail img')[0].alt;
  };
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = "none";
  };
  var bindActions = function() {
    for (var i = 0; i < tileLink.length; i++) {
      tileLink[i].addEventListener('click', open, false)
    }
    for (var i = 0; i < stripClose.length; i++) {
      stripClose[i].addEventListener('click', close, false);
    }
    var cer = document.querySelectorAll('.card > .sertifikat');
    for (var i = 0; i < cer.length; i++) {
      cer[i].addEventListener('click', openmodal, false);
    }
  };
  var init = function() {
    bindActions();
  };
  return {
    init: init
  };
}();
Expand.init();