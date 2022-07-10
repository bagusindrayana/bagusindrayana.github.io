class ScrollPage {
    constructor(element, options = null) {
        const _this = this;
        _this.reachTop = true;
        _this.reachBottom = false;
        _this.index = 0;
        _this.element = element;
        _this.options = options ?? {};
        if (_this.options.relative === undefined) {
            _this.options.relative = false;
        }

        if (_this.options.triggerScrollChildren === undefined) {
            _this.options.triggerScrollChildren = false;
        }

        _this.initEvents();
        // document.querySelector(element).addEventListener('wheel', function (e) {
        //     e.preventDefault();
        //     _this.scrollListener(e);
        // }, { passive: options?.passive ?? false });

        _this.touchstartX = 0;
        _this.touchstartY = 0;
        _this.touchendX = 0;
        _this.touchendY = 0;

        // const body = document.body;
        // body.addEventListener('touchstart', function(event) {
        //     event.preventDefault();
        //     _this.touchstartX = event.changedTouches[0].screenX;
        //     _this.touchstartY = event.changedTouches[0].screenY;
        // },{passive: false});
    
        // body.addEventListener('touchend', function(event) {
        //     _this.scrollListener(event);
        // },{passive: true}); 

        _this.parent = document.querySelector(_this.element);
        _this.parent.setAttribute('scroll-page', true);
        if (_this.options.relative || _this.options.relative === undefined) {
            _this.parent.style.position = "relative";
        }
        
        var pc = [..._this.parent.children];
        var childs = [];
        var ignore = null;
        pc.forEach(child => {
            if(!child.hasAttribute('ignore-page')){
                ignore = null;
                childs.push(child);
            } else {
                // var div = document.createElement('div');
                // div.setAttribute('id', child.id);
                // child.removeAttribute('id');
                // div.appendChild(child);
                // var nextChild = child.nextElementSibling;
                // while (nextChild != null && nextChild.hasAttribute('ignore-page')) {
                //     nextChild = nextChild.nextElementSibling;
                //     div.appendChild(nextChild);
                // }

            }
        });
        _this.childs = childs;
      
       
        _this.childs.forEach(e => {
            e.setAttribute('scroll-page-item', true);
            e.addEventListener('wheel', function (e) {
                if(_this.checkScrollContent(e)){
                    e.preventDefault();
                    _this.scrollListener(e);
                }
            }, { passive: options?.passive ?? false });
            

            e.addEventListener('touchstart', function(event) {
                
                if(_this.checkScrollContent(event)){
                    event.preventDefault();
                    
                }  
                _this.touchstartX = event.changedTouches[0].screenX;
                _this.touchstartY = event.changedTouches[0].screenY;  
            },{passive: false});
        
            e.addEventListener('touchend', function(event) {
                if(_this.checkScrollContent(event)){
                    _this.scrollListener(event);
                }
            },{passive: true}); 
        });
        _this.stop = true;
        if(options?.menu){
            _this.setMenu(options?.menu);
        }
        _this.setTagLink();
        _this.pageSelectedClass = options?.pageSelectedClass ?? 'active';
        _this.menuSelectedClass = options?.menuSelectedClass ?? 'active';
        
        _this.currentPage = options?.currentPage ?? 1;
        _this.currentTarget = _this.childs[_this.currentPage-1];
        if(options?.currentPage){
            _this.moveTo(_this.currentPage);
        } else {
            //check current scroll position
            if(!_this.options.relative){
                var childOffset = [];

                
                _this.childs.forEach(child => {
                    childOffset.push(child.offsetTop);
                    // if(window.pageYOffset <= child.offsetTop){
                    //     _this.currentPage = _this.pageNumber(child);
                    //     _this.index = _this.pageIndex(child);
                    //     _this.currentTarget = child;
                    // }
                });
                
                var pageOffset = window.pageYOffset;
                var closest = childOffset.reduce(function(prev, curr) {
                    return (Math.abs(curr - pageOffset) < Math.abs(prev - pageOffset) ? curr : prev);
                });

                var index = childOffset.indexOf(closest);
                var child = _this.childs[index];
                _this.currentPage = _this.pageNumber(child);
                _this.index = index;
                _this.currentTarget = child;
            } else {
                if(_this.parent.scrollTop <= 1){
                    _this.currentPage = options?.currentPage ?? 1;
                    _this.currentTarget = _this.childs[0];
                    _this.index = 0;
                } else {
                    var childOffset = [];

                    _this.childs.forEach(child => {
                        childOffset.push(child.offsetTop);
                    });
                    
                    var pageOffset = _this.parent.scrollTop;
                    var closest = childOffset.reduce(function(prev, curr) {
                        return (Math.abs(curr - pageOffset) < Math.abs(prev - pageOffset) ? curr : prev);
                    });

                    var index = childOffset.indexOf(closest);
                    var child = _this.childs[index];
                    _this.currentPage = _this.pageNumber(child);
                    _this.index = index;
                    _this.currentTarget = child;
                }
               
            }

            _this.moveTo(_this.currentPage);
            
        }
        _this.nextPage = _this.currentPage;
        _this.nextTarget = _this.currentTarget;
        
        if(!_this.options.relative){
            if(options?.scrollBar){
                document.body.style.overflow = 'visible';
            } else {
                document.body.style.overflow = 'hidden';
            }
        } else {
            if(options?.scrollBar){
                _this.parent.style.overflow = 'visible';
            } else {
                _this.parent.style.overflow = 'hidden';
            }
        }
        _this.updateMenuClass();
        _this.updatePageClass();
    }

    checkScrollContent(e){
        var _this = this;
        var currentTarget = e.currentTarget;
        var scrollPage = true;
        if(!this.moveHorizontalOrVertical(e)){
            scrollPage = false;
            return scrollPage;
        }
        let up = false;
        up = this.moveDownOrUp(e);
        

        var element = _this.parent;
        let p = e.target;
        var hasVerticalScrollbar = p.scrollHeight > p.clientHeight;
        if (hasVerticalScrollbar) {
            if(this.options.triggerScrollChildren){
                if((p.offsetHeight + p.scrollTop >= p.scrollHeight) && !up){
                    scrollPage = true; 
                //if reach top element and scroll up
                } else if((p.scrollTop <= 0) && up){
                    scrollPage = true; 
                } else {
                    scrollPage = false;                      
                }
            } else {
                scrollPage = false;
            }
            
            p = false;
            
        } else {
            

            while(p){
                if(p.nodeName == "BODY"){
                    break;
                }
                var hasOverflow = p.style.overflow === "visible" || p.style.overflow === "auto" || p.style.overflow === "scroll";
                hasVerticalScrollbar = p.scrollHeight > p.clientHeight && hasOverflow;
                if (hasVerticalScrollbar && p !== element && !p.hasAttribute('scroll-page') && !p.hasAttribute('scroll-page-item')) {
                    if(this.options.triggerScrollChildren){
                        //if reach bottom element and scroll down
                        if((p.offsetHeight + p.scrollTop >= p.scrollHeight) && !up){
                            scrollPage = true; 
                            
                        //if reach top element and scroll up
                        } else if((p.scrollTop <= 0) && up){
                            
                            scrollPage = true; 
                        } else {
                            scrollPage = false; 
                        }
                    } else {
                        scrollPage = false;
                    }
                    
                    p = false;
                    break;
                }
                p = p.parentElement;
            }
        }
        
        
        // scrollPage = false; 
        
        
        if(currentTarget.hasAttribute('scroll-page-item') && currentTarget.querySelectorAll('[scroll-page]').length > 0 && this.options.triggerScrollChildren){
            const nested = currentTarget.querySelectorAll('[scroll-page]');
            const firstNested = nested[0];
            var top,bottom = false;
            
            var hasOverflow = firstNested.style.overflow === "visible" || firstNested.style.overflow === "auto" || firstNested.style.overflow === "scroll";
            var firstNestedHasVerticalScrollbar = firstNested.scrollHeight > firstNested.clientHeight && hasOverflow;
            
            if(firstNestedHasVerticalScrollbar){
                //if reach bottom element and scroll down
                if(((firstNested.offsetHeight + firstNested.scrollTop+_this.marginChild(_this.childs.indexOf(_this.currentTarget))) >= firstNested.scrollHeight) && !up){
                    if(nested.length == 1){
                        bottom = true;
                    }
                    

                //if reach top element and scroll up
                } else if((firstNested.scrollTop-1 <= 0) && up){
                    top = true;
                } else {
                    top = false; 
                    if(!nested.length){
                        bottom = false;
                    }
                    
                }
            }

            if(nested.length > 1){
                const lastNested = nested[nested.length-1];
                var hasOverflow = lastNested.style.overflow === "visible" || lastNested.style.overflow === "auto" || lastNested.style.overflow === "scroll";
                var lastNestedHasVerticalScrollbar = firstNested.scrollHeight > firstNested.clientHeight && hasOverflow;
            
                if(lastNestedHasVerticalScrollbar){
                    //if reach bottom element and scroll down
                    if((lastNested.offsetHeight + lastNested.scrollTop >= lastNested.scrollHeight) && up){
                        bottom = true;
                    } else {
                        bottom = false;
                    }
                } else {
                    bottom = false;
                }
            }

            if(top || bottom){
                scrollPage = true;
            } else {
                scrollPage = false;
            }
            
        }

        return scrollPage;
    }

    initEvents(){
        this.scrollCallback = this.options?.scrollCallback ?? function(e){};
        this.moveCallback = this.options?.moveCallback ?? function(e){};
        this.startCallback = this.options?.startCallback ?? function(e){};
        this.finishCallback = this.options?.finishCallback ?? function(e){};
    }

    has(object, key) {
        return object ? hasOwnProperty.call(object, key) : false;
    }


    pageIndex(element) {
        return this.childs.indexOf(element ?? this.currentTarget);
    }

    pageNumber(element) {
        return this.pageIndex(element ?? this.currentTarget)+1;
    }

    moveDownOrUp(e){
        var up = false;
        if(e.changedTouches != undefined && e.changedTouches != null){
            this.touchendX = e.changedTouches[0].screenX;
            this.touchendY = e.changedTouches[0].screenY;
            const delx = this.touchendX - this.touchstartX;
            const dely = this.touchendY - this.touchstartY;
            if(Math.abs(delx) < Math.abs(dely)){
                if(dely > 0){
                    up = true;
                }
                else {
                    up = false;
                }
            }
        }

        if(e.deltaY != undefined && e.deltaY != null){
            if (e.deltaY < 0) {
                up = true;
            } else if (e.deltaY > 0) {
                up = false;
            }
        }
        return up;
    }

    moveLeftOrRight(e){
        var right = false;
        if(e.changedTouches != undefined && e.changedTouches != null){
            this.touchendX = e.changedTouches[0].screenX;
            this.touchendY = e.changedTouches[0].screenY;
            const delx = this.touchendX - this.touchstartX;
            const dely = this.touchendY - this.touchstartY;
            if(Math.abs(delx) > Math.abs(dely)){
                if(delx > 0){
                    right = true;
                }
                else {
                    right = false;
                }
            }
        }

        if(e.deltaX != undefined && e.deltaX != null){
            if (e.deltaX < 0) {
                right = true;
            } else if (e.deltaX > 0) {
                right = false;
            }
        }
        return right;
    }

    moveHorizontalOrVertical(e){
        var vertical = false;
        if(e.changedTouches != undefined && e.changedTouches != null){
            this.touchendX = e.changedTouches[0].screenX;
            this.touchendY = e.changedTouches[0].screenY;
            const delx = this.touchendX - this.touchstartX;
            const dely = this.touchendY - this.touchstartY;
            if(Math.abs(delx) > Math.abs(dely)){
                vertical = false;
            } else if(Math.abs(delx) < Math.abs(dely)) {
                vertical = true;
            }
        }

        if(e.deltaX != undefined && e.deltaY != undefined){
            if (e.deltaX != 0) {
                vertical = false;
            } else if(e.deltaY != 0) {
                vertical = true;
            }
        }
        return vertical;
    }

    scrollListener(e) {
        const childs = this.childs;
        var prev,next = null;

        if(this.index > 0){
            prev = childs[this.index-1];
        }  
        if(this.index < childs.length-1){
            next = childs[this.index+1];
        }  
        
        // var next = e.currentTarget.nextElementSibling; 
        // var prev = e.currentTarget.previousElementSibling;
        let up = false;
        up = this.moveDownOrUp(e);
        
        if (up) {
            if (childs.includes(prev)) {
                if(prev){
                    this.nextPage = this.pageNumber(prev);
                    this.nextTarget = prev;
                    this.scrollCallback(this.responseCallback());
                    const pn = this.pageNumber(prev);
                    const optionsPage = this.has(this.options?.pages,pn) ? this.options?.pages[pn] : null;
                    let easingAnimation = optionsPage?.animation ?? this.options?.animation;
                    let timeAnimation = optionsPage?.time ?? this.options?.time;
                    this.moveTo(prev,{
                        animation: easingAnimation,
                        time: timeAnimation,
                        finish:optionsPage?.finish,
                        start:optionsPage?.start,
                        next:false
                    });  
                }
         
            }
    
        } else {
            if (childs.includes(next)) {
                if(next){
                    this.nextPage = this.pageNumber(next);
                    this.nextTarget = next;
                    this.scrollCallback(this.responseCallback());
                    const pn = this.pageNumber(next);
                    const optionsPage = this.has(this.options?.pages,pn) ? this.options?.pages[pn] : null;
                    
                    let easingAnimation = optionsPage?.animation ?? this.options?.animation;
                    let timeAnimation = optionsPage?.time ?? this.options?.time;
                    this.moveTo(next,{
                        animation: easingAnimation,
                        time: timeAnimation,
                        finish:optionsPage?.finish,
                        start:optionsPage?.start,
                        next:true
                    });
                }
            }
        }

        this.updateMenuClass();
        this.updatePageClass();
    }

    updateMenuClass(){
        if(this.menu){
            const activeMenus = this.menu.querySelectorAll("."+this.menuSelectedClass);
            if(activeMenus.length > 0){
                activeMenus.forEach(menuItem => {
                    menuItem.classList.remove(this.menuSelectedClass);
                });
            }
            if(this.currentTarget){
                const targetMenu = this.menu.querySelector("[data-page='#"+this.currentTarget.getAttribute('id')+"']");
                if(targetMenu){
                    targetMenu.classList.add(this.menuSelectedClass);
                }
            }
        }
    }

    updatePageClass(){
        if(this.currentTarget){
            const activePages = this.parent.querySelectorAll("."+this.pageSelectedClass);
            if(activePages.length > 0){
                activePages.forEach(pageItem => {
                    pageItem.classList.remove(this.pageSelectedClass);
                });
            }
            this.currentTarget.classList.add(this.pageSelectedClass);
        }
    }

    verticalScroll(destination) {
        const _this = this;
        if(destination === undefined || destination === null) {
            return false;
        }
        const duration = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];
        const easing = arguments.length <= 2 || (arguments[2] === undefined || arguments[2] === null) ? 'easeInSine' : arguments[2];
        const callback = arguments[3];
        const next = arguments[4] ?? null;
        const easings = {
            easeInSine(x) {
                return 1 - Math.cos(x * Math.PI / 2);
            },
            easeOutSine(x) {
                return Math.sin((x * Math.PI) / 2);
            },
            easeInOutSine(x) {
                return -(Math.cos(Math.PI * x) - 1) / 2;
            },
            easeInQuad(x) {
                return x * x;
            },
            easeInQuad(x) {
                return 1 - (1 - x) * (1 - x);
            },
            easeInOutQuad(x) {
                return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
            },
            easeInCubic(x) {
                return x * x * x;
            },
            easeOutCubic(x) {
                return 1 - Math.pow(1 - x, 3);
            },
            easeInOutCubic(x) {
                return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
            },
            easeInQuart(x) {
                return x * x * x * x;
            },
            easeOutQuart(x) {
                return 1 - Math.pow(1 - x, 4);
            },
            easeInOutQuart(x) {
                return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
            },
            easeInQuint(x) {
                return x * x * x * x * x;
            },
            easeOutQuint(x) {
                return 1 - Math.pow(1 - x, 5);
            },
            easeInOutQuint(x) {
                return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
            },
            easeInExpo(x) {
                return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
            },
            easeOutExpo(x) {
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
            },
            easeInOutExpo(x) {
                return x === 0
                ? 0
                : x === 1
                ? 1
                : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
                : (2 - Math.pow(2, -20 * x + 10)) / 2;
            },
            easeInCirc(x) {
                return 1 - Math.sqrt(1 - Math.pow(x, 2));
            },
            easeOutCirc(x) {
                return Math.sqrt(1 - Math.pow(x - 1, 2));
            },
            easeInOutCirc(x) {
                return x < 0.5
                  ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                  : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
            },
            easeInBack(x) {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                
                return c3 * x * x * x - c1 * x * x;
            },
            easeOutBack(x) {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                
                return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
            },
            easeInOutBack(x) {
                const c1 = 1.70158;
                const c2 = c1 * 1.525;
                
                return x < 0.5
                  ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                  : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
            },
            easeInElastic(x) {
                const c4 = (2 * Math.PI) / 3;
                
                return x === 0
                  ? 0
                  : x === 1
                  ? 1
                  : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
            },
            easeOutElastic(x) {
                const c4 = (2 * Math.PI) / 3;
                
                return x === 0
                  ? 0
                  : x === 1
                  ? 1
                  : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
            },
            easeInOutElastic(x) {
                const c5 = (2 * Math.PI) / 4.5;
                
                return x === 0
                  ? 0
                  : x === 1
                  ? 1
                  : x < 0.5
                  ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                  : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
            },
            easeInBounce(x) {
                return 1 - easings["easeOutBounce"](1 - x);
            },
            easeOutBounce(x) {
                const n1 = 7.5625;
                const d1 = 2.75;
                
                if (x < 1 / d1) {
                    return n1 * x * x;
                } else if (x < 2 / d1) {
                    return n1 * (x -= 1.5 / d1) * x + 0.75;
                } else if (x < 2.5 / d1) {
                    return n1 * (x -= 2.25 / d1) * x + 0.9375;
                } else {
                    return n1 * (x -= 2.625 / d1) * x + 0.984375;
                }
            },
            easeInOutBounce(x) {
                return x < 0.5
                    ? (1 - easings["easeOutBounce"](1 - 2 * x)) / 2
                    : (1 + easings["easeOutBounce"](2 * x - 1)) / 2;
            }
        };
        var last = false;
        if(_this.options.relative){
            var start = _this.parent.scrollTop;
            var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
            var parentHeight = Math.max(_this.parent.scrollHeight, _this.parent.offsetHeight, _this.parent.clientHeight, _this.parent.scrollHeight, _this.parent.offsetHeight);
            var windowHeight = _this.parent.innerHeight;
            var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
            destinationOffset -= this.marginChild(_this.childs.indexOf(_this.currentTarget));
            var destinationOffsetToScroll = parentHeight - destinationOffset < windowHeight ? parentHeight - windowHeight : destinationOffset;
            if(_this.childs.indexOf(_this.currentTarget) == 0 && _this.index > 0){
                destinationOffsetToScroll = 0;
            } else if(_this.childs.indexOf(_this.currentTarget) == _this.childs.length-1 && _this.index < _this.childs.length-1){
                last = true;
                //destinationOffsetToScroll = documentHeight;
            }
            
            if ('requestAnimationFrame' in window === false) {
                _this.parent.scroll(0, destinationOffsetToScroll);
                if (callback) {
                    callback();
                }
                _this.stop = true;
                return;
            }
        } else {
           
            var start = window.pageYOffset;
            var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
            var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
            var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
            var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
            destinationOffset -= this.marginChild(_this.childs.indexOf(_this.currentTarget));
            var destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
           
            if(_this.childs.indexOf(_this.currentTarget) == 0 && _this.index > 0){
                destinationOffsetToScroll = 0;
            } else if(_this.childs.indexOf(_this.currentTarget) == _this.childs.length-1 && _this.index < _this.childs.length-1){
                last = true;
                destinationOffsetToScroll = documentHeight;
            }
            if ('requestAnimationFrame' in window === false) {
                window.scroll(0, destinationOffsetToScroll);
                if (callback) {
                    callback();
                }
                _this.stop = true;
                return;
            }
        }

        _this.updateMenuClass();

        function scroll() {
            if(_this.options.relative){
                var now = 'now' in window.performance ? performance.now() : new Date().getTime();
                var time = Math.min(1, (now - startTime) / duration);
                var timeFunction = (typeof easing === "function")?easing(time):easings[easing](time);
                _this.parent.scroll(0, Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start));
                

                if (_this.parent.scrollTop === destinationOffsetToScroll || (easing == "easeInSine" && _this.parent.scrollTop - destinationOffsetToScroll) == 1 || time == 1) {
                    if (callback) {
                        callback();
                    }
                   
                    _this.stop = true;
                    
                    if(next != null){
                        if(next){
                            _this.index += 1;
                        } else {
                            _this.index -= 1;
                        }
                    } else {
                        _this.index = _this.pageIndex(destination);
                    }
                
                    _this.currentPage = _this.pageNumber();
                    _this.finishCallback(_this.responseCallback());
                    // _this.updateMenuClass();
                    _this.updatePageClass();
                    return;
                }
            } else {
                var now = 'now' in window.performance ? performance.now() : new Date().getTime();
                var time = Math.min(1, (now - startTime) / duration);
                var timeFunction = (typeof easing === "function")?easing(time):easings[easing](time);
                window.scroll(0, Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start));
                
                if (window.pageYOffset === destinationOffsetToScroll || (easing == "easeInSine" && window.pageYOffset - destinationOffsetToScroll) == 1 || time == 1) {
                    if (callback) {
                        callback();
                    }
                    _this.stop = true;
                    
                    if(next != null){
                        if(next){
                            _this.index += 1;
                        } else {
                            _this.index -= 1;
                        }
                        
                    } else {
                        _this.index = _this.pageIndex(destination);
                    }
                
                    _this.currentPage = _this.pageNumber();
                    _this.finishCallback(_this.responseCallback());
                    // _this.updateMenuClass();
                    _this.updatePageClass();
                    return;
                }
            }
            
            
            
            
            
            _this.moveCallback(_this.responseCallback());
            
    
            requestAnimationFrame(scroll);
        }
    
        scroll();
    }

    onScroll(callback){
        this.scrollCallback = callback;
    }

    onMove(callback){
        this.moveCallback = callback;
    }

    onStart(callback){
        this.startCallback = callback;
    }

    onFinish(callback){
        this.finishCallback = callback;
    }

    moveTo(page, options = null){
        
        let target = null;
        let i = 0;
        if (typeof page === 'number' ) {
            i = page-1;
            target = this.childs[i];
        } else if (typeof page === 'string') {
            i = this.findPageByNode(document.querySelector(page));
            target = this.childs[i];
        } else if (this.findPageByNode(page) !== -1) {
            i = this.findPageByNode(page);
            target = this.childs[i];
        } else {
            target = document.querySelector(page);
        }

        if(options == null){
            if(this.has(this.options?.pages,i+1)  && this.options?.pages[i+1]){
                options = this.options?.pages[i+1];
            } else {
                options = this.options;
            }
            
        }
        
        if(target){
            
            this.nextPage = this.pageNumber(target);
            this.nextTarget = target;
            if(this.stop){
                
                this.startCallback(this.responseCallback());
                
            } else {
                return false;
            }
            this.stop = false;
            if(options?.start){
                options?.start();
            }
            this.currentTarget = target;
            
            this.verticalScroll(target, options?.time,options?.animation,options?.finish,options?.next);
            

            const event = new Event(this.currentTarget.getAttribute("id"));
            this.parent.dispatchEvent(event);
            
        } else {
            console.log("page not found");
        }
    }

    setMenu(menuSelector){
        const _this = this;
        _this.menu = document.querySelector(menuSelector);
        if(_this.menu){
            const menuItems = [..._this.menu.children];
            menuItems.forEach((item)=>{
                item.addEventListener('click',(e)=>{
                    e.preventDefault();
                    _this.moveTo(item.getAttribute('data-page'));
                    this.scrollCallback(this.responseCallback());
                });
                if ('ontouchstart' in window) {
                    item.addEventListener("touchstart", function(e) {
                        _this.moveTo(item.getAttribute('data-page'));
                        this.scrollCallback(this.responseCallback());
                      
                    });
                }
            });
            
        }
        

       
    }

    setTagLink(){
        const _this = this;
        const a = document.getElementsByTagName("a");
        for (let i = 0; i < a.length; i++) {
            const link = a[i];
            link.addEventListener('click',(e)=>{
                var href = link.getAttribute("href");
                if(href.includes("#") && href !== "#"){
                    e.preventDefault();
                    _this.moveTo(href);
                    this.scrollCallback(this.responseCallback());
                }
            });
        }
    }

    findPageByNode(node){
        return this.childs.indexOf(node);
    }

    on(pageName, callback){
        const _this = this;
        _this.parent.addEventListener(pageName, function (e) {
            callback(_this.responseCallback());
        }, false);
        
    }

    responseCallback(){
        const datas = {
            sp:this,
            currentPage:this.currentPage,
            nextPage:this.nextPage,
            currentPageName:this.currentTarget.getAttribute('id') ?? this.currentPage,
            nextPageName:this.nextTarget.getAttribute('id') ?? this.nextPage,
            index:this.index
        };

        return datas;
    }

    marginChild(index){
        return this.convertCssUnit(window.getComputedStyle(this.childs[index]).marginTop);
    }

    convertCssUnit = function( cssValue, target ) {

        target = target || document.body;
    
        const supportedUnits = {
    
            // Absolute sizes
            'px': value => value,
            'cm': value => value * 38,
            'mm': value => value * 3.8,
            'q': value => value * 0.95,
            'in': value => value * 96,
            'pc': value => value * 16,
            'pt': value => value * 1.333333,
    
            // Relative sizes
            'rem': value => value * parseFloat( getComputedStyle( document.documentElement ).fontSize ),
            'em': value => value * parseFloat( getComputedStyle( target ).fontSize ),
            'vw': value => value / 100 * window.innerWidth,
            'vh': value => value / 100 * window.innerHeight,
    
        };
    
        // Match positive and negative numbers including decimals with following unit
        const pattern = new RegExp( `^([\-\+]?(?:\\d+(?:\\.\\d+)?))(${ Object.keys( supportedUnits ).join( '|' ) })$`, 'i' );
    
        // If is a match, return example: [ "-2.75rem", "-2.75", "rem" ]
        const matches = String.prototype.toString.apply( cssValue ).trim().match( pattern );
    
        if ( matches ) {
            const value = Number( matches[ 1 ] );
            const unit = matches[ 2 ].toLocaleLowerCase();
    
            // Sanity check, make sure unit conversion function exists
            if ( unit in supportedUnits ) {
                return supportedUnits[ unit ]( value );
            }
        }
    
        return cssValue;
    
    }
};



if(typeof module != "undefined"){
    module.exports = ScrollPage;
}