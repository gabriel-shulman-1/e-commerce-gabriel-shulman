const handleReset = () => {
  const resetForm = document.getElementById("resetForm");
  if(!resetForm) return;
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(resetForm);
    const data = {
      token: formData.get("token"),
      password: formData.get("password"),
    };
    console.log(resetForm);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: result.message,
          confirmButtonText: "Ir al login",
        }).then(() => {
          window.location.href = "/login";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error en la conexión",
      });
    }
  });
};
const handleForgot = () => {
  const forgotForm = document.getElementById("mailForgoted");
  if (!forgotForm) return;
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: data.message,
          text: data.url,
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Ocurrió un problema",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar con el servidor",
      });
    }
  });
};
handleReset();
handleForgot();