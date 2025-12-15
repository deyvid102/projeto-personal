export default function Alert({ message, type = "success" }) {
  if (!message) return null;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg
        transition-all duration-300
        ${
          type === "success"
            ? "bg-green-800 text-white"
            : "bg-red-800 text-white"
        }
      `}
    >
      {message}
    </div>
  );
}
