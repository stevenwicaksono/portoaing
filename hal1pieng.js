(function () {
  const stories = [...document.querySelectorAll(".pieng-story")];
  if (!stories.length || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document.body.classList.add("pieng-motion-ready");
  stories.forEach((story) => observer.observe(story));
})();
