$(document).ready(() => {

  $("#btnpokemon").on('click',function(e){
    e.preventDefault();
    const RegionId = $('#region').val();
    const TipoId = $('#Tipo').val();  

    if (validarNumero(RegionId) && validarNumero(TipoId)) {
      $("#pokemonForm").submit();
    }else{
      alert("Todos los campos son requeridos.");
    }
  });

  function validarNumero(valor) {
    if (isNaN(valor) || valor === '') {
      return false;
    }
    return true;
  }

});
