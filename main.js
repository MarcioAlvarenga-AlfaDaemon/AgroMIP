// Menu toggle (progressive enhancement + accessibility)
document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('site-nav');

  if(navToggle && siteNav){
    navToggle.addEventListener('click', function(){
      const open = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!open));
      siteNav.classList.toggle('open');
    });
  }

  // Optional: Smooth inline navigation for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        target.setAttribute('tabindex','-1');
        target.focus({preventScroll:true});
      }
    });
  });
});