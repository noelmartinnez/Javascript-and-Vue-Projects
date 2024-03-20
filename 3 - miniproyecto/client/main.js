import { ClienteAPI } from "./ClienteAPI";
import Handlebars from "handlebars";

var items;

// Template
const plantilla_lista = `
{{#each .}}
  <li id={{id}} {{#comprado}}class="tachado"{{/comprado}}>
    {{nombre}}
    <button>Eliminar</button>
  </li>
{{/each}}
`;

document.getElementById("lista").addEventListener("click", function (event) {
  if (event.target.nodeName == "LI") {
    const id = event.target.id;
    const cli = new ClienteAPI();
    const pos = items.findIndex(function (elem) {
      return elem.id == id;
    });
    if (pos > -1) {
      if (items[pos].comprado) {
        if (cli.toggleItem(id, false)) {
          event.target.classList.remove("tachado");
          items[pos].comprado = false;
        }
      } else {
        if (cli.toggleItem(id, true)) {
          event.target.classList.add("tachado");
          items[pos].comprado = true;
        }
      }
    }
  }

  // Código que añade la función de eliminar un elemento de la lista
  if (event.target.nodeName == "BUTTON") {
    const id_borrar = event.target.parentNode.id;
    const cli = new ClienteAPI();

    cli.deleteItem(id_borrar)
      .then((success) => {
        if (success) {
          // Elimina el elemento del DOM en el cliente
          const listItem = event.target.parentNode;
          listItem.remove();
        }
      })
      .catch((error) => {
        console.error("Error al eliminar el elemento:", error);
      });
  }
});


document.getElementById("formAgregar").addEventListener("submit", function (event) {
  event.preventDefault();
  const nuevoItemNombre = document.getElementById("nuevoItem").value;
  const cli = new ClienteAPI();

  cli.addItem({ nombre: nuevoItemNombre })
    .then((item) => {
      // Agregar el nuevo ítem al DOM en el cliente
      const lista = document.getElementById("lista");
      const newItem = document.createElement("li");
      newItem.id = item.id;
      newItem.textContent = item.nombre;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      newItem.appendChild(deleteButton);
      lista.appendChild(newItem);

      // Limpiar el campo de entrada
      document.getElementById("nuevoItem").value = "";
      // Para recargar la página automáticamente
      location.reload();
    })
    .catch((error) => {
      console.error("Error al agregar el nuevo ítem:", error);
    });
});

// Esto se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", async function () {
  const cli = new ClienteAPI();
  items = await cli.getItems();
  const lista = document.getElementById("lista");
  const plantilla_func = Handlebars.compile(plantilla_lista);
  const items_html = plantilla_func(items);
  lista.innerHTML = items_html;
});
