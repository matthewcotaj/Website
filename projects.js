/* ==========================================================================
   Shared "Projects" nav dropdown.

   To add a new project to the site: add ONE entry to the PROJECTS array
   below and create the page at /projects/<slug>/index.html. Nothing else
   needs to change -- every page that includes this file and calls
   ProjectsNav.init(basePath) will pick up the new entry automatically.

   Each page includes this once, near the end of <body>, then calls
   ProjectsNav.init(basePath), where basePath is the relative path back to
   the site root (e.g. '' from /index.html, '../../' from
   /projects/<slug>/index.html).
   ========================================================================== */

var PROJECTS = [
  {
    slug: 'topology',
    title: 'Topology',
    note: 'Live Chern number & Berry curvature explorer'
  }
  /* Next project goes here, e.g.:
  { slug: 'my-new-project', title: 'My New Project', note: 'One line about it' },
  */
];

var ProjectsNav = (function () {

  function currentSlug() {
    var path = window.location.pathname;
    for (var i = 0; i < PROJECTS.length; i++) {
      if (path.indexOf('/projects/' + PROJECTS[i].slug) !== -1) return PROJECTS[i].slug;
    }
    return null;
  }

  function renderMenu(menuEl, basePath) {
    var active = currentSlug();
    menuEl.innerHTML = '';
    PROJECTS.forEach(function (p) {
      var a = document.createElement('a');
      /* point at the file directly, not the bare folder -- a folder-only
         link relies on the server defaulting to index.html for a directory
         request, which plain file:// browsing (and some static hosts)
         doesn't do, and falls back to a raw directory listing instead. */
      a.href = basePath + 'projects/' + p.slug + '/index.html';
      a.setAttribute('role', 'menuitem');
      if (p.slug === active) a.className = 'cur';

      var title = document.createElement('span');
      title.className = 'proj-title';
      title.textContent = p.title;
      a.appendChild(title);

      if (p.note) {
        var note = document.createElement('span');
        note.className = 'note';
        note.textContent = p.note;
        a.appendChild(note);
      }
      menuEl.appendChild(a);
    });
  }

  function wireDropdown(trigger, menu) {
    function close(){
      menu.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
    function open(){
      menu.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.classList.contains('open')) close(); else open();
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && e.target !== trigger) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* mobile: nav-links is hidden below 1010px by default; this toggle
     reveals it as a stacked panel, tap-to-expand rather than hover. */
  function wireMobileToggle(toggle, links) {
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function init(basePath) {
    basePath = basePath || '';
    var trigger = document.getElementById('projects-trigger');
    var menu = document.getElementById('projects-menu');
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links-list');

    if (trigger && menu) {
      renderMenu(menu, basePath);
      wireDropdown(trigger, menu);
    }
    wireMobileToggle(toggle, links);
  }

  return { init: init, PROJECTS: PROJECTS };
})();
