import { useState } from "react";

export function useAlert(timeout = 3000) {
  const [alert, setAlert] = useState({ message: "", type: "" });

  function showAlert(message, type = "success") {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, timeout);
  }

  return { alert, showAlert };
}
