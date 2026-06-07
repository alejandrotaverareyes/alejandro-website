// header scroll state + mobile menu
(function(){
  var header=document.querySelector('.site-header');
  // nav always stays visible; on scroll the glass pill just gets a touch more solid
  var onScroll=function(){header.classList.toggle('scrolled',window.scrollY>10);};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // hero headline: each line rises from its own ground, holds, sinks back down, swaps
  var rot=document.querySelector('.hero .rotator');
  if(rot){
    var phrases=[
      ['You didn’t open a','practice to manage','busywork'],
      ['You opened it to win. I','build the AI systems','that let you.']
    ];
    var holds=[5000,6000];                        // 5s on first, 6s on second
    var i=0;
    var render=function(idx,down){
      rot.innerHTML=phrases[idx].map(function(l){
        return '<span class="rt-line"><span class="rt-line-i'+(down?' down':'')+'">'+l+'</span></span>';
      }).join('');
    };
    var setDown=function(d){
      var ls=rot.querySelectorAll('.rt-line-i');
      for(var k=0;k<ls.length;k++){
        ls[k].style.transitionDelay = d ? '0s' : (k*0.09)+'s';  // smooth simultaneous exit; staggered rise
        ls[k].classList.toggle('down',d);
      }
    };
    var step=function(){
      setDown(true);                              // sink current lines (staggered, ~1.1s)
      setTimeout(function(){
        i=(i+1)%phrases.length;
        render(i,true);                           // build next lines, hidden below
        void rot.offsetWidth;                     // reflow so the rise animates
        setDown(false);                           // rise the new lines up
        setTimeout(step,holds[i]);
      },1350);
    };
    // on load: rise the first phrase in — same mechanism as a swap (render hidden -> reflow -> rise)
    render(0,true);                             // first phrase, hidden below
    void rot.offsetWidth;                       // commit the hidden state (paints hidden, then rises)
    setTimeout(function(){ setDown(false); },180);   // brief beat after paint, then rise it up fully
    setTimeout(step,holds[0]+180);              // keep the hold after the rise completes
  }
  var toggle=document.querySelector('.nav-toggle');
  var links=document.querySelector('.nav-links');
  if(toggle&&links){
    toggle.addEventListener('click',function(){
      var open=links.classList.toggle('open');
      toggle.classList.toggle('open',open);
      toggle.setAttribute('aria-expanded',open);
      document.body.style.overflow=open?'hidden':'';
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){links.classList.remove('open');toggle.classList.remove('open');document.body.style.overflow='';});
    });
  }

  // lazy YouTube: swap the lightweight thumbnail facade for the real player only when clicked
  document.querySelectorAll('.yt-lite').forEach(function(btn){
    btn.addEventListener('click',function(){
      var f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+btn.getAttribute('data-yt')+'?autoplay=1';
      f.title='Video player';f.allowFullscreen=true;
      f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      btn.replaceWith(f);
    });
  });

  // ---- reveal-on-scroll ----
  // Add `.in` a couple of frames AFTER the observer fires so the hidden "before" state is guaranteed
  // to paint first. Otherwise, reloading with a section already on screen makes the observer fire
  // before the first paint and the element jumps straight to its end state with no animation.
  function reveal(el){ if(el) requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('in'); }); }); }
  function onView(target, run){
    if(!target) return;
    if(!('IntersectionObserver' in window)){ run(); return; }
    var o=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ run(); o.unobserve(e.target); } });
    },{threshold:0, rootMargin:'0px 0px -12% 0px'});   // fire as soon as the element is genuinely on screen
    o.observe(target);
  }

  // feature bands: title rises (like the hero), support fades in
  document.querySelectorAll('.feature').forEach(function(f){ onView(f,function(){ reveal(f); },.2); });
  // testimonial: quote rises from the ground, cite + button fade in
  onView(document.querySelector('.testi'),function(){ reveal(document.querySelector('.testi')); },.2);
  // comparison table: horizontal dividers draw out from the centre spine
  onView(document.querySelector('.compare'),function(){ reveal(document.querySelector('.compare')); },.2);
  // connector trees: stem/node/horizontal/drops draw in
  [['.problem','.problem .tree'],['.pillars-sec','.pillars-sec .tree']].forEach(function(pair){
    var sec=document.querySelector(pair[0]), tr=document.querySelector(pair[1]);
    onView(tr,function(){ reveal(sec); },.15);
  });
})();
