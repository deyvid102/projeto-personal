import { useState, useRef } from "react";

export function useAlert(timeout = 2000) {
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const timerRef = useRef(null);

  function showAlert(message, type = "success") {
    if (timerRef.current) clearTimeout(timerRef.current);

    setAlert({ message, type });

    timerRef.current = setTimeout(() => {
      setAlert({ message: "", type });
    }, timeout);
  }

  return { alert, showAlert };
}