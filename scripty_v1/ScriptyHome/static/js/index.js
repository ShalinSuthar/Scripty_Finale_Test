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
        //let fromLanguage = $("#fromLanguage").val();
        let toLanguage = $("#toLanguage").val();
        //console.log(toLanguage);

        let text = editor.getData();
        
        $.ajax({
            type: "post",
            url: "/translateText",
            data: {
                text: text,
                dest: toLanguage,
                csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
            },
            beforeSend: function() {
                $('#loader').removeClass('hidden')
            },
            success: function (response) {
               // console.log(response);
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


    $('#checkerForm').submit( function (e) {
        e.preventDefault();
        let data = editor.getData();
        $.ajax({
            type: "post",
            url: "grammarCheck",
            data: {
                text: data,
                csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
            },
            beforeSend: function() {
                $('#loader').removeClass('hidden')
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
                $('#loader').addClass('hidden')
            },
        });
    })
});