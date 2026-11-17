// ---- Content you edit ----------------------------------------------------
// Add real entries only. Empty arrays keep those sections hidden.
// testimonials: { quote: "...", who: "Name, role" }
// notes:        { title: "...", date: "2026-11-17", text: "..." }
const testimonials = [];
const notes = [];
// --------------------------------------------------------------------------

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const make = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
};

// Typing effect for the hero role line
const role = "Software Engineer";
const typed = $("#typed");
let n = 0;
const timer = setInterval(() => {
  typed.textContent = role.slice(0, ++n);
  if (n === role.length) clearInterval(timer);
}, 90);

// Fade-in on scroll (CSS makes it instant under prefers-reduced-motion)
const fade = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); fade.unobserve(e.target); }
  });
}, { threshold: 0.1 });
$$("section").forEach((s) => { s.classList.add("reveal"); fade.observe(s); });

// Active nav link follows the section on screen
const links = $$("nav a");
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.classList.toggle("active", a.hash === "#" + e.target.id));
  });
}, { rootMargin: "-40% 0px -55% 0px" });
$$("section[id]").forEach((s) => spy.observe(s));

// Project filter, built from each card's data-tags
const cards = $$("[data-tags]");
const tags = ["All", ...new Set(cards.flatMap((c) => c.dataset.tags.split(" ")))];
const filters = $("#filters");
tags.forEach((t, i) => {
  const b = make("button", i === 0 ? "on" : "", t);
  b.type = "button";
  b.onclick = () => {
    $$("#filters button").forEach((x) => x.classList.toggle("on", x === b));
    cards.forEach((c) => { c.hidden = t !== "All" && !c.dataset.tags.split(" ").includes(t); });
  };
  filters.append(b);
});

// Testimonials and notes, rendered from the arrays above
function render(list, box, target, build) {
  if (!list.length) return;
  list.forEach((item) => $(target).append(build(item)));
  $(box).hidden = false;
}
render(testimonials, "#testimonials", "#testimonial-list", (t) => {
  const c = make("blockquote", "card");
  c.append(make("p", "", "“" + t.quote + "”"), make("small", "", "— " + t.who));
  return c;
});
render(notes, "#notes", "#note-list", (x) => {
  const c = make("article", "card");
  c.append(make("small", "", x.date), make("h4", "", x.title), make("p", "", x.text));
  return c;
});

// Contact form: no backend, hands off to the visitor's email app
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const subject = encodeURIComponent("Portfolio message from " + f.get("name"));
  const body = encodeURIComponent(f.get("msg") + "\n\n— " + f.get("name"));
  location.href = "mailto:colesarch48@gmail.com?subject=" + subject + "&body=" + body;
});
