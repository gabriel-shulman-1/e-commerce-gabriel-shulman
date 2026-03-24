const resetForm = document.getElementById("resetForm");
resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = {
    token: formData.get("token"),
    password: formData.get("password"),
  };
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
