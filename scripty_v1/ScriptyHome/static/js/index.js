//created for separations purposes..
let editor;

ClassicEditor
        .create( document.querySelector( '#textInput' ) )
        .then( function ( classicEditor ) {
            editor = classicEditor;
        })
        .catch( error => {
            console.error( error );
        } );

$().ready( function () {

    $("#translateForm").submit(function(e) {
        e.preventDefault();
        let fromLanguage = $("#fromLanguage").val();
        let toLanguage = $("#toLanguage").val();
        //console.log(toLanguage);

        let text = editor.getData();
        
        $.ajax({
            type: "post",
            url: "/translateText",
            data: {
                text: text,
                src:fromLanguage,
                dest: toLanguage,
                csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
            },
            beforeSend: function() {
                $('#loader').removeClass('hidden')
            },
            success: function (response) {
               // console.log(response);
               $('#loader').addClass('hidden')
                editor.setData(response.result);
            },
            error: function (response) {
                $('#loader').addClass('hidden')
                console.log(response);
            },
            complete: function(){
                $('#loader').addClass('hidden')
            },
        });
        
    });

    $("#readPdfImage").submit(function(e) {
        e.preventDefault();

        //getting the file..
        var form = new FormData($(this).get(0));

        $.ajax({
            url: 'readPdfImage',
            type: 'POST',
            data: form,
            cache: false,
            processData: false,
            contentType: false,
            success: function(data) {
                console.log(data);
                editor.setData(data.result);
            },
            error: function(data) {
                console.log('error');
            }
        });
    });

    $('#checkerForm').submit( function (e) {
        $("#ocrFileInput").modal('hide');
        e.preventDefault();
        //close modal ocrFileInput
        
        let data = editor.getData();
        $.ajax({
            type: "post",
            url: "grammarCheck",
            data: {
                text: data,
                csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
            },
            beforeSend: function() {
               // $('#loader').removeClass('hidden')
            },
            success: function (response) {
                console.log(response.result, typeof(response));
                console.log(new DOMParser().parseFromString(response.result.result_colored, "text/html"));
                editor.setData(response.result.result_colored);
            },
            error: function (response) {
                console.log(response);
            },
            complete: function(){
                //$('#loader').addClass('hidden')
            },
        });
    })
});