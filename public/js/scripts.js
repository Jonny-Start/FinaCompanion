function activeOptionFooter(option) {
  if (!option) {
    return console.log(
      "No se ha seleccionado una opcion del footer: " + option
    );
  }
  const OPCIONES = {
    Contacts: "footer_contacts",
    History: "footer_history",
    Add: "footer_add",
    Home: "footer_home",
    Overdue: "footer_overdue",
    Setting: "footer_setting",
  };

  if (OPCIONES[option] !== undefined) {
    let footerElement = document.getElementById(OPCIONES[option]);
    console.log(footerElement);
    footerElement.classList.add("active");

    return console.log(`${option} está presente en OPCIONES.`);
  } else {
    return console.log(`${option} no está presente en OPCIONES.`);
  }
}

function redirect(endPoint) {
  window.location.href = "/" + endPoint;
}
