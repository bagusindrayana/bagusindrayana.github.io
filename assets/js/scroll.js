
function scrollPage(e) {
  const parent = document.querySelector('#full-page');
  const childs = parent.childNodes;
  let nodesName = [];
  childs.forEach(element => {
    nodesName.push(element.nodeName);
  });

  if (nodesName.includes(e.target.nodeName)) {
    var next = e.target.nextElementSibling;
    var prev = e.target.previousElementSibling;
  } else {
    var next = e.target.closest(nodesName).nextElementSibling;
    var prev = e.target.closest(nodesName).previousElementSibling;
  }
  var active = document.querySelector(".active");
          active.classList.remove("active");
  if (e.deltaY < 0) {
    e.preventDefault();
    if(nodesName.includes(prev.nodeName)) {
      verticalScroll(prev, 500, 'easeInOutCubic');
      e.target.closest(nodesName).classList.remove('active')
      prev.classList.add('active')
      document.querySelector("ul.side-nav li[data-page='#"+prev.getAttribute('id')+"']").classList.add('active');
    }
    
  } else if (e.deltaY > 0) {
    e.preventDefault();
    if(nodesName.includes(next.nodeName)) {
      verticalScroll(next, 500, 'easeInOutQuad', runAfter);
      e.target.closest(nodesName).classList.remove('active');
      next.classList.add('active');
      document.querySelector("ul.side-nav li[data-page='#"+next.getAttribute('id')+"']").classList.add('active');
    }
  } else {
    return false;
  }
  
  // var nodesName = ['HEADER', 'SECTION', 'FOOTER'];
  // if (nodesName.includes(e.target.nodeName)) {
  //   var next = e.target.nextElementSibling;
  //   var prev = e.target.previousElementSibling;
  // } else {
  //   var next = e.target.closest(nodesName).nextElementSibling;
  //   var prev = e.target.closest(nodesName).previousElementSibling;
  // }
  
  // if (e.deltaY < 0) {
  //   e.preventDefault();
  //   if(nodesName.includes(prev.nodeName)) {
  //     verticalScroll(prev, 500, 'easeInOutCubic');
  //     e.target.closest(nodesName).classList.remove('active')
  //     prev.classList.add('active')
  //   }
    
  // } else if (e.deltaY > 0) {
  //   e.preventDefault();
  //   if(nodesName.includes(next.nodeName)) {
  //     verticalScroll(next, 500, 'easeInOutQuad', runAfter);
  //     e.target.closest(nodesName).classList.remove('active');
  //     next.classList.add('active');
  //   }
  // } else {
  //   return false;
  // }
}

function runAfter() {
  //console.log('after');
}

function verticalScroll(destination) {
  var duration = arguments.length <= 1 || arguments[1] === undefined ? 200 : arguments[1];
  var easing = arguments.length <= 2 || arguments[2] === undefined ? 'linear' : arguments[2];
  var callback = arguments[3];
  var easings = {
    easeInOutQuad: function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
  };
  
  // console.log(easings.easeInOutQuad);
  
  var start = window.pageYOffset;
  var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
  var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
  var destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
  
  // console.log("documentHeight " + documentHeight);
  // console.log("windowHeight " + windowHeight);
  // console.log("destinationOffset " + destinationOffset);
  // console.log("destinationOffsetToScroll " + destinationOffsetToScroll);

  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    var now = 'now' in window.performance ? performance.now() : new Date().getTime();
    var time = Math.min(1, (now - startTime) / duration);
    var timeFunction = easings[easing](time);
    window.scroll(0, Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start));

    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }
    
    requestAnimationFrame(scroll);
  }
  
  scroll();
}
