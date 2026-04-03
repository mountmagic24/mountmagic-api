// Highlight active nav link based on pathname
(function () {
  const links = document.querySelectorAll(".nav-links a");
  const path = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
    }
  });
})();
