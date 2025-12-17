import { useSlideIn } from "./hooks/useSlideIn";

export default function SlideIn({
  children,
  delay = 0,
  from = "bottom", // bottom | left | right | top
}) {
  const visible = useSlideIn(delay);

  const directions = {
    bottom: "translate-y-10",
    top: "-translate-y-10",
    left: "-translate-x-10",
    right: "translate-x-10",
  };

  return (
    <div
      className={`
        transform transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${directions[from]}`}
      `}
    >
      {children}
    </div>
  );
}
