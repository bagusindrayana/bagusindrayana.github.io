document.addEventListener('DOMContentLoaded', (event) => {
        
    const scrollPage = new ScrollPage("#full-page",{menu:"#menu"});
    scrollPage.onScroll(function(e){
        console.log(e);
        var page = e.nextPageName;
        if (findElement("#" + page + " .bg-animasi")) {
            findElement("#" + page + " .bg-animasi").style.display = 'block';
        }
        setTimeout(() => {
            animasiTulisan("[animasi-tulisan]", 100);
        }, 500);
    });
    
    setTimeout(() => {
        findElement('#loading').classList.add('close');
        findElement(".loading-text").setAttribute('animasi-tulisan', 'WELCOME');
        animasiTulisan(".loading-text");
        setTimeout(() => {
            findElement(".bg-animasi").style.display = 'block';
            findElement('#loading').style.display = 'none';
            animasiTulisan("#page1 [animasi-tulisan]", 50);
        }, 3500);
    }, 4500);
    setTimeout(() => {
        animasiTulisan(".loading-text");
    }, 2000);

    var folderLists = document.querySelectorAll("ul.folder-list li");
    folderLists.forEach(f => {

        f.addEventListener("click", function () {
            folderLists.forEach(ff => {
                ff.classList.remove('selected');
            });
            var target = document.querySelector(this.dataset.target);
            document.querySelectorAll(".box-content").forEach(b => {
                b.classList.remove("active");
            });
            target.classList.add("active");
            f.classList.add('selected');
        });
    });

    let offetX = 0;
    let offetY = 0;

    const tooltipEl = document.querySelector("#mouse-tooltip");
    var tooltips = document.querySelectorAll("[tooltip]");
    tooltips.forEach(t => {
        t.addEventListener("mouseover", function () {
            tooltipEl.setAttribute("animasi-tulisan", t.getAttribute("tooltip"));
            tooltipEl.style.opacity = "1";
            offetX = tooltipEl.offsetWidth + 20;

            animasiTulisan("#mouse-tooltip");
        });

        t.addEventListener("mouseout", function () {
            tooltipEl.innerHTML = "";
            tooltipEl.style.opacity = "0";
        });
    });

    let mouseX = 0;
    let mouseY = 0;

    let tooltipElX = 0;
    let tooltipElY = 0;



    let speed = 0.5;


    function animateTooltip() {

        let distX = mouseX - tooltipElX - offetX;
        let distY = mouseY - tooltipElY;


        tooltipElX = tooltipElX + (distX * speed);
        tooltipElY = tooltipElY + (distY * speed);

        tooltipEl.style.left = (tooltipElX) + "px";
        tooltipEl.style.top = (tooltipElY) + "px";

        requestAnimationFrame(animateTooltip);
    }
    animateTooltip();

    document.addEventListener("mousemove", function (event) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    })


    const words = [
        "HELLO WORLD",
        "404",
        "WELCOME",
        "500",
        "ERROR",
        "COMPLETE",
        "JAVASCRIPT",
        "PHP",
        "CSS",
        "HTML",
        "200",
        "LARAVEL",
        "CODING",
        "PROGRAMMER",
        "WEBSITE",
        "MOBILE",
    ];

    const texts = document.querySelectorAll(".text");
    texts.forEach(t => {

        let interval = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;
        setInterval(() => {
            var e = t;
            e.setAttribute('animasi-tulisan', words[Math.floor(Math.random() * words.length)]);
            animasiTulisan(e, 50);
        }, interval);
    });


    function playOnScroll(element, func = null, func2 = null) {
        const observer = new IntersectionObserver(entries => {
            if (func2) {
                func2();
            }
            var elements = document.querySelector(element);
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('play-animation');
                    if (func) {
                        func();
                    }
                    return;
                }
                if (elements) {
                    elements.classList.remove('play-animation');
                }
            });




        });

        observer.observe(document.querySelector(element));
    }

    playOnScroll(".biodata");
    playOnScroll(".project", function () {
        document.querySelector(".project .loading-bar").classList.add('close');
        setTimeout(() => {
            document.querySelector(".project .box-content").classList.add('active');
            document.querySelector(".project .loading-bar").style.display = 'none';
            document.querySelector("ul.folder-list li").classList.add('selected');
        }, 3000);
    }, function () {
        folderLists.forEach(ff => {
            ff.classList.remove('selected');
        });
        document.querySelector(".project .loading-bar").classList.remove('close');
        document.querySelector(".project .loading-bar").style.display = 'block';
        document.querySelectorAll(".box-content").forEach(b => {
            b.classList.remove("active");
        });
    });
});
// docReady(function(){
//     (function () {

//         document.addEventListener('wheel', function (e) {
//             scrollPage(e);
//             var page = e.target.getAttribute('id');
//             if (findElement("#" + page + " .bg-animasi")) {
//                 findElement("#" + page + " .bg-animasi").style.display = 'block';
//             }
//             setTimeout(() => {
//                 animasiTulisan("[animasi-tulisan]", 100);
//             }, 500);
//         }, { passive: false });
    
//         setTimeout(() => {
//             document.body.scrollTop = document.documentElement.scrollTop = 0;
//             findElement('#loading').classList.add('close');
//             findElement(".loading-text").setAttribute('animasi-tulisan', 'WELCOME');
//             animasiTulisan(".loading-text");
//             setTimeout(() => {
//                 findElement(".bg-animasi").style.display = 'block';
//                 findElement('#loading').style.display = 'none';
//                 animasiTulisan("#page1 [animasi-tulisan]", 50);
//             }, 3500);
//         }, 4500);
    
    
//         var folderLists = document.querySelectorAll("ul.folder-list li");
//         folderLists.forEach(f => {
    
//             f.addEventListener("click", function () {
//                 folderLists.forEach(ff => {
//                     ff.classList.remove('selected');
//                 });
//                 var target = document.querySelector(this.dataset.target);
//                 document.querySelectorAll(".box-content").forEach(b => {
//                     b.classList.remove("active");
//                 });
//                 target.classList.add("active");
//                 f.classList.add('selected');
//             });
//         });
    
    
//         let offetX = 0;
//         let offetY = 0;
    
//         const tooltipEl = document.querySelector("#mouse-tooltip");
//         var tooltips = document.querySelectorAll("[tooltip]");
//         tooltips.forEach(t => {
//             t.addEventListener("mouseover", function () {
//                 tooltipEl.setAttribute("animasi-tulisan", t.getAttribute("tooltip"));
//                 tooltipEl.style.opacity = "1";
//                 offetX = tooltipEl.offsetWidth + 20;
    
//                 animasiTulisan("#mouse-tooltip");
//             });
    
//             t.addEventListener("mouseout", function () {
//                 tooltipEl.innerHTML = "";
//                 tooltipEl.style.opacity = "0";
//             });
//         });
    
//         var navs = document.querySelectorAll("ul.side-nav li");
//         navs.forEach(nav => {
//             nav.addEventListener("click", function (e) {
//                 e.preventDefault();
//                 var active = document.querySelector(".active");
//                 if (active) {
//                     active.classList.remove("active");
//                 }
    
    
//                 var page = nav.getAttribute("data-page");
//                 var target = document.querySelector(page);
//                 verticalScroll(target, 500, 'easeInOutQuad', function () {
//                     if (findElement(page + " .bg-animasi")) {
//                         findElement(page + " .bg-animasi").style.display = 'block';
//                     }
    
//                     setTimeout(() => {
//                         animasiTulisan(page + " [animasi-tulisan]", 100);
//                     }, 200);
//                 });
//                 nav.classList.add("active");
//                 target.classList.add("active");
//             });
//         });
    
    
    
    
//         let mouseX = 0;
//         let mouseY = 0;
    
//         let tooltipElX = 0;
//         let tooltipElY = 0;
    
    
    
//         let speed = 0.5;
    
    
//         function animateTooltip() {
    
//             let distX = mouseX - tooltipElX - offetX;
//             let distY = mouseY - tooltipElY;
    
    
//             tooltipElX = tooltipElX + (distX * speed);
//             tooltipElY = tooltipElY + (distY * speed);
    
//             tooltipEl.style.left = (tooltipElX) + "px";
//             tooltipEl.style.top = (tooltipElY) + "px";
    
//             requestAnimationFrame(animateTooltip);
//         }
//         animateTooltip();
    
//         document.addEventListener("mousemove", function (event) {
//             mouseX = event.pageX;
//             mouseY = event.pageY;
//         })
    
    
//         const words = [
//             "HELLO WORLD",
//             "404",
//             "WELCOME",
//             "500",
//             "ERROR",
//             "COMPLETE",
//             "JAVASCRIPT",
//             "PHP",
//             "CSS",
//             "HTML",
//             "200",
//             "LARAVEL",
//             "CODING",
//             "PROGRAMMER",
//             "WEBSITE",
//             "MOBILE",
//         ];
    
//         const texts = document.querySelectorAll(".text");
//         texts.forEach(t => {
    
//             let interval = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;
//             setInterval(() => {
//                 var e = t;
//                 e.setAttribute('animasi-tulisan', words[Math.floor(Math.random() * words.length)]);
//                 animasiTulisan(e, 50);
//             }, interval);
//         });
    
    
//         function playOnScroll(element, func = null, func2 = null) {
//             const observer = new IntersectionObserver(entries => {
//                 if (func2) {
//                     func2();
//                 }
//                 var elements = document.querySelector(element);
//                 entries.forEach(entry => {
//                     if (entry.isIntersecting) {
//                         entry.target.classList.add('play-animation');
//                         if (func) {
//                             func();
//                         }
//                         return;
//                     }
//                     if (elements) {
//                         elements.classList.remove('play-animation');
//                     }
//                 });
    
    
    
    
//             });
    
//             observer.observe(document.querySelector(element));
//         }
    
//         playOnScroll(".biodata");
//         playOnScroll(".project", function () {
//             document.querySelector(".project .loading-bar").classList.add('close');
//             setTimeout(() => {
//                 document.querySelector(".project .box-content").classList.add('active');
//                 document.querySelector(".project .loading-bar").style.display = 'none';
//                 document.querySelector("ul.folder-list li").classList.add('selected');
//             }, 3000);
//         }, function () {
//             folderLists.forEach(ff => {
//                 ff.classList.remove('selected');
//             });
//             document.querySelector(".project .loading-bar").classList.remove('close');
//             document.querySelector(".project .loading-bar").style.display = 'block';
//             document.querySelectorAll(".box-content").forEach(b => {
//                 b.classList.remove("active");
//             });
//         });
    
    
    
//     })();
// });



function findElement(query) {
    return document.querySelector(query);
}

function findElements(query) {
    return document.querySelectorAll(query);
}



function animasiTulisan(params = '[animasi-tulisan]', speed = 100) {
    let elements = [];
    if (params.nodeType && params.nodeType === Node.ELEMENT_NODE) {
        elements = [params];
    } else {
        elements = findElements(params);
    }

    elements.forEach(function (el) {
        var a = el.querySelector('a');

        const tulisan = el.getAttribute("animasi-tulisan");
        if (a) {
            a.innerHTML = "";
        } else {
            el.innerHTML = '';
        }

        if (tulisan == "" || tulisan == null || tulisan == ",") {
            return;
        }
        const tulisanArray = tulisan.split("");
        const finalTulisanArray = tulisan.split("");

        var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var numbers = "0123456789"
        var string = numbers + letters;


        for (let i = 0; i < tulisanArray.length; i++) {
            const span = document.createElement("span");
            span.setAttribute("data-final", tulisanArray[i]);
            span.innerHTML = string.charAt(Math.random() * string.length);

            if (a) {
                a.appendChild(span);
            } else {
                el.appendChild(span);
            }
        }
        var allCounters = [];
        if (a) {
            allCounters = a.querySelectorAll("span");
        } else {
            allCounters = el.querySelectorAll("span");
        }



        allCounters.forEach(function (el2) {
            var final = el2.getAttribute("data-final");
            if (final != " ") {
                var duration = speed + Array.from(allCounters).indexOf(el2) * speed;
                var interval = setInterval(function () {
                    el2.innerText = string.charAt(Math.random() * string.length);
                    duration = duration - speed;
                    if (duration <= 0) {
                        clearInterval(interval);
                        el2.innerText = final;
                    }
                }, speed);
            } else {
                el2.innerText = " ";
            }
        });

    });




}

// Get the modal
var modal = document.getElementById('myModal');
 
// Get the image and insert it inside the modal - use its "alt" text as a caption

var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

function openModalImage (e){
    modal.style.display = "block";
    modalImg.src = e.src;
    modalImg.alt = e.alt;
    captionText.innerHTML = e.alt;
}
 
 
// When the user clicks on <span> (x), close the modal
modal.onclick = function() {
    img01.className += " out";
    setTimeout(function() {
       modal.style.display = "none";
       img01.className = "modal-content";
     }, 400);
    
 }    

