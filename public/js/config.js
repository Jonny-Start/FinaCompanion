if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      // console.log('Service Worker registrado con éxito:', registration);
    })
    .catch((error) => {
      console.error("Error al registrar el Service Worker:", error);
    });
}

var wifiOff = document.getElementById("wifiOff");
// Comprueba si el usuario está offline al cargar la página
if (!navigator.onLine) {
  console.log("El usuario está offline");
  wifiOff.classList.contains("hide") ? wifiOff.classList.remove("hide") : "";
  alert("¡Estás offline!");
} else {
  console.log("El usuario está online");
  wifiOff.classList.contains("hide") ? "" : wifiOff.classList.add("hide");
  // alert("¡Estás online!");
}

// Escucha los eventos 'online' y 'offline'
window.addEventListener("online", () => {
  console.log("El usuario está online");
  wifiOff.classList.contains("hide") ? "" : wifiOff.classList.add("hide");
  // alert("¡Estás online!");
});

window.addEventListener("offline", () => {
  console.log("El usuario está offline");
  wifiOff.classList.contains("hide") ? wifiOff.classList.remove("hide") : "";
  alert("¡Estás offline!");
});

// localStorage.removeItem('clave');
// localStorage.clear();

// Suscripción a notificaciones push
function subscribePush() {
  navigator.serviceWorker.ready.then((registration) => {
    //busco el token en el localstorage
    var public_key = localStorage.getItem("VAPID_PUBLIC_KEY");
    if (!!!public_key) {
      // extraigo el token del servidor
      fetch("/getVAPID_PUBLIC_KEY")
        .then((response) => response.json())
        .then((config) => {
          localStorage.setItem("VAPID_PUBLIC_KEY", config.applicationServerKey);
          public_key = config.applicationServerKey;
        });
    }

    registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: localStorage.getItem("VAPID_PUBLIC_KEY"),
      })
      .then((subscription) => {
        // Envía la suscripción al servidor
        fetch("/subscribeNotifications", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: {
            "Content-Type": "application/json",
          },
        });
        alert("¡Suscripción exitosa!");
      });
  });
}
// const registration = await navigator.serviceWorker.register('/sw.js');
