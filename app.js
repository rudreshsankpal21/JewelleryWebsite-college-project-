gsap.registerPlugin(ScrollTrigger);

/* ------------------------------
    NAVBAR SCROLL ANIMATION
------------------------------ */
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  let currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

/* ------------------------------
    HERO PARALLAX ANIMATION
------------------------------ */
gsap.to(".hero-img img", {
  y: -40,
  duration: 3,
  ease: "power1.inOut",
  repeat: -1,
  yoyo: true,
});

/* ------------------------------
    MOUSE FOLLOW FLOAT EFFECT
------------------------------ */
document.addEventListener("mousemove", (e) => {
  gsap.to(".hero-img img", {
    x: (e.clientX - window.innerWidth / 2) * 0.02,
    y: (e.clientY - window.innerHeight / 2) * 0.02,
    duration: 0.5,
    ease: "power3.out",
  });
});

/* ------------------------------
    HERO TEXT ANIMATION
------------------------------ */
gsap.from(".hero-text h2", {
  opacity: 0,
  y: 40,
  duration: 1,
  ease: "power3.out",
});

gsap.from(".hero-text p", {
  opacity: 0,
  y: 40,
  delay: 0.3,
  duration: 1,
});

gsap.from(".btn", {
  opacity: 0,
  scale: 0.8,
  delay: 0.6,
  duration: 0.7,
  ease: "back.out(1.7)",
});

/* ------------------------------
    SCROLL PARALLAX IMAGE EFFECT
------------------------------ */
gsap.utils.toArray(".item img").forEach((img) => {
  gsap.from(img, {
    scrollTrigger: {
      trigger: img,
      start: "top 85%",
      scrub: 1,
    },
    scale: 0.9,
    opacity: 0,
    y: 50,
    duration: 1.2,
  });
});

/* ------------------------------
    TITLES FADE & SLIDE
------------------------------ */
gsap.utils.toArray(".section-title").forEach((title) => {
  gsap.from(title, {
    scrollTrigger: {
      trigger: title,
      start: "top 80%",
    },
    opacity: 0,
    y: 40,
    duration: 1.2,
    ease: "power3.out",
  });
});
