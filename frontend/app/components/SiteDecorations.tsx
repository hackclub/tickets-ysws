const decorations = [
  { src: "/popcorn.png", className: "site-decoration--popcorn" },
  { src: "/mic.png", className: "site-decoration--mic" },
  { src: "/popcorn2.png", className: "site-decoration--popcorn-two" },
  { src: "/soda.png", className: "site-decoration--soda" },
  { src: "/popcorn3.png", className: "site-decoration--popcorn-three" },
  { src: "/popcorn4.png", className: "site-decoration--popcorn-four" },
  { src: "/soda.png", className: "site-decoration--soda-two" },
  { src: "/popcorn.png", className: "site-decoration--popcorn-five" },
  { src: "/soda.png", className: "site-decoration--soda-three" },
  { src: "/popcorn.png", className: "site-decoration--popcorn-six" },
  { src: "/soda.png", className: "site-decoration--soda-four" },
  { src: "/popcorn.png", className: "site-decoration--popcorn-seven" },
];

export default function SiteDecorations() {
  return (
    <div className="site-decorations" aria-hidden="true">
      {decorations.map(({ src, className }) => (
        <img
          key={className}
          className={`site-decoration ${className}`}
          src={src}
          alt=""
        />
      ))}
    </div>
  );
}
