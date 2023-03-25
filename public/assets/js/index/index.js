$(document).ready(() => {

  $('#bookForm').submit(function(event) {
    alert('Todos los campos son requeridos.');
    if ($('#author').val() === 'Seleccione una opcion' || $('#cate').val() === 'Seleccione una opcion' || $('#editorial').val() === 'Seleccione una opcion' ) {
      event.preventDefault();     
    }
  });

  
  const form = document.getElementById("filtroRegionesForm");
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');

  $("#btnfiltrocategoria").on("click", function (e) {
    let checked = false;

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checked = true;
        break;
      }
    }

    if (!checked) {
      e.preventDefault();
      alert("Debe seleccionar al menos una categoria");
    }
  });

  
 




});
