const mk = (folder, n, title, text) => ({
  title,
  text,
  image: `/images/${folder}-${n}.jpg`,
  link: "#",
});

export const happening = [
  mk("blog", 1, "Autumn care questions", "Write a short summary of this post in your own words."),
  mk("blog", 2, "How to photograph the glow", "Write a short summary of this post in your own words."),
  mk("blog", 3, "Cozy indoor styling ideas", "Write a short summary of this post in your own words."),
  mk("blog", 4, "Bringing the glow indoors", "Write a short summary of this post in your own words."),
];

export const science = [
  mk("science", 1, "Meet the growers", "Write a short summary of this post in your own words."),
  mk("science", 2, "Why new buds glow brightest", "Write a short summary of this post in your own words."),
  mk("science", 3, "The science of spooky season", "Write a short summary of this post in your own words."),
  mk("science", 4, "From day to night", "Write a short summary of this post in your own words."),
];

export const myths = [
  mk("myth", 1, "Myth: indoor growing fails", "MYTH: your myth here. FACT: your answer here."),
  mk("myth", 2, "Myth: photos are enhanced", "MYTH: your myth here. FACT: your answer here."),
  mk("myth", 3, "Myth: the glow runs out", "MYTH: your myth here. FACT: your answer here."),
  mk("myth", 4, "Myth: special lights needed", "MYTH: your myth here. FACT: your answer here."),
];

export const reviews = [
  { name: "Customer name", text: "Sample review text. Replace with your own testimonial." },
  { name: "Customer name", text: "Sample review text. Replace with your own testimonial." },
  { name: "Customer name", text: "Sample review text. Replace with your own testimonial." },
  { name: "Customer name", text: "Sample review text. Replace with your own testimonial." },
  { name: "Customer name", text: "Sample review text. Replace with your own testimonial." },
];

export const news = [
  { title: "Headline one", outlet: "Outlet name", text: "One-line summary in your own words.", link: "#" },
  { title: "Headline two", outlet: "Outlet name", text: "One-line summary in your own words.", link: "#" },
  { title: "Headline three", outlet: "Outlet name", text: "One-line summary in your own words.", link: "#" },
  { title: "Headline four", outlet: "Outlet name", text: "One-line summary in your own words.", link: "#" },
  { title: "Headline five", outlet: "Outlet name", text: "One-line summary in your own words.", link: "#" },
  { title: "Headline six", outlet: "Outlet name", text: "One-line summary in your own words.", link: "#" },
];

export const faqs = [
  { q: "Question one?", a: "Answer in your own words." },
  { q: "Question two?", a: "Answer in your own words." },
  { q: "Question three?", a: "Answer in your own words." },
  { q: "Question four?", a: "Answer in your own words." },
  { q: "Question five?", a: "Answer in your own words." },
  { q: "Question six?", a: "Answer in your own words." },
];