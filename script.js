function rellenarConCeros(numero) {               
                let numeroComoTexto = numero.toString();
  
                while (numeroComoTexto.length < 12) {
                        numeroComoTexto = "0" + numeroComoTexto;
                    }
  
                return numeroComoTexto;
            }

$(document).ready(function(){
    $('#generar').click(function(){

        var idSoli = $('#folio').val();

        $.ajax({
            type: 'POST',
            url: 'https://bff-mn-prod.masnominadigital.com/api/enqueue/allocate/' + idSoli + '?token=$2y$10$y3xDwNavRPECsk8KYF9IT..galQCtJ8JSan54UwwtmS6PYPvh10W.',
            success: function(msg1){

                var estado = JSON.stringify(msg1.success);
                var mensaje = JSON.stringify(msg1.message);

                if(mensaje == '"Paquete en espera de firma."'){
                    $.ajax({
                        type: 'GET',
                        url: 'https://bff-mn-prod.masnominadigital.com/sol/' + idSoli,
                        success: function(msg2){
                            $('#liga').show();
                            $('#resultado').text('https://revision.prd.masnominadigital.com/?solicitud=' + idSoli + '&telefono=' + msg2.payload.cliente.telefonos.movil);
                            $('#rfc').text(msg2.payload.cliente.rfc);

                            new ClipboardJS('#copy-button');
                            $('#copy-button').click(function() {
                                $(this).attr('data-clipboard-text', $('.txtCopiar').text());
                                console.log('¡Contenido copiado al portapapeles!');
                            });
                        },
                        error: function(){
                            alert('No se pudo llamar al servicio.');
                        }
                    });
                }
                else if(estado == 'false'){
                    alert('La solicitud no existe. Favor de validar');
                }
                else if(mensaje != '"Paquete en espera de firma."' && mensaje != '"Falla al generar el paquete de disposición sin firma."'){
                    alert('La solicitud no esta en espera de firma (NOFIRMA)');
                }
                else if(mensaje == '"Falla al generar el paquete de disposición sin firma."'){
                    alert('ERROR: La solicitud no genero el paquete de disposición para firmar.');
                    $('#errPaqSF').text('Falla al generar el paquete de disposición sin firma de la solicitud ' + idSoli + '.');
                    $('#nofirmaError').show();

                    $('#regenerateBtn').click(function(){

                        $.ajax({

                            type: 'GET',
                            url: 'https://bff-mn-prod.masnominadigital.com/api/request/nofirma/' + idSoli + '?token=$2y$10$y3xDwNavRPECsk8KYF9IT..galQCtJ8JSan54UwwtmS6PYPvh10W.',
                            success: function(msg3){
                                alert('Se envio señal de regeneracíon. Espere.')
                                console.log(JSON.stringify(msg3.message));
                                $('#nofirmaError').hide();

                            },
                            error: function(){
                                alert('No se pudo llamar al servicio.');
                            }
                        });
                    });
                }
                
                console.log(mensaje);
            },
            error: function(){
                alert('No sen pudo llamar al servicio');
            }

        });
    });
});

