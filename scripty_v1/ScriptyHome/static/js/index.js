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
    $('#textInputSubmit').click( function (e) {
        let data = editor.getData();
        $.ajax({
            type: "get",
            url: "grammarCheck",
            data: {
                text: data
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