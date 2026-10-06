(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var btn = document.getElementById("menuBtn");
  var overlay = document.getElementById("navOverlay");
  var links = document.querySelectorAll("#navOverlay a, #sideNav a");

  function closeMenu() {
    overlay.classList.remove("open");
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  btn.addEventListener("click", function () {
    var open = overlay.classList.toggle("open");
    btn.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  });

  overlay.addEventListener("click", function (event) {
    if (event.target.classList.contains("nav-dim")) closeMenu();
  });

  links.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  var motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animated = document.querySelectorAll("[data-anim]");
  animated.forEach(function (el) {
    var delay = Number(el.dataset.delay) || 0;
    if (delay) el.style.transitionDelay = delay + "ms";
    if (!motionOk) el.classList.add("in");
  });
  if (motionOk && "IntersectionObserver" in window) {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        reveal.unobserve(entry.target);
      });
    }, {
      threshold: window.matchMedia("(max-width: 1100px)").matches ? 0.08 : 0.22,
      rootMargin: window.matchMedia("(max-width: 1100px)").matches ? "0px 0px -6% 0px" : "0px"
    });
    animated.forEach(function (el) { reveal.observe(el); });
  } else {
    animated.forEach(function (el) { el.classList.add("in"); });
  }

  var quotes = document.querySelectorAll(".quote-card");
  var quoteIndex = 0;
  var quoteCount = document.getElementById("quoteCount");
  function showQuote(next) {
    if (!quotes.length) return;
    quoteIndex = (next + quotes.length) % quotes.length;
    quotes.forEach(function (card, index) {
      card.classList.toggle("active", index === quoteIndex);
    });
    if (quoteCount) quoteCount.textContent = (quoteIndex + 1) + " / " + quotes.length;
  }
  var prevQuote = document.getElementById("quotePrev");
  var nextQuote = document.getElementById("quoteNext");
  if (prevQuote) prevQuote.addEventListener("click", function () { showQuote(quoteIndex - 1); });
  if (nextQuote) nextQuote.addEventListener("click", function () { showQuote(quoteIndex + 1); });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  var sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 });
    sections.forEach(function (section) { spy.observe(section); });
  }

  var filters = document.querySelectorAll(".stack-filters button");
  var groups = document.querySelectorAll(".stack-group");
  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      var key = button.getAttribute("data-filter");
      filters.forEach(function (item) {
        var on = item === button;
        item.classList.toggle("active", on);
        item.setAttribute("aria-pressed", on ? "true" : "false");
      });
      groups.forEach(function (group) {
        group.hidden = key !== "all" && group.getAttribute("data-group") !== key;
      });
    });
  });

  var copyMail = document.getElementById("copyMail");
  if (copyMail) {
    copyMail.addEventListener("click", function () {
      var email = "qaziasad17@gmail.com";
      function markCopied() {
        copyMail.textContent = "Copied";
        copyMail.classList.add("done");
        window.setTimeout(function () {
          copyMail.textContent = "Copy";
          copyMail.classList.remove("done");
        }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(markCopied).catch(markCopied);
      } else {
        markCopied();
      }
    });
  }

  var toTop = document.getElementById("toTop");
  if (toTop) {
    function toggleTop() {
      toTop.hidden = window.scrollY < 480;
    }
    window.addEventListener("scroll", toggleTop, { passive: true });
    toggleTop();
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: motionOk ? "smooth" : "auto" });
    });
  }

  var form = document.getElementById("contactForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var subject = data.get("subject") || "Portfolio enquiry";
    var body = [
      "Name: " + (data.get("name") || ""),
      "Email: " + (data.get("email") || ""),
      "Phone: " + (data.get("phone") || ""),
      "",
      data.get("message") || ""
    ].join("\n");
    window.location.href = "mailto:qaziasad17@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();
