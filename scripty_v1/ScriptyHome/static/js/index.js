//created for separations purposes..
let editor;

// ClassicEditor
//         .create( document.querySelector( '#textInput' ) )
//         .then( function ( classicEditor ) {
//             editor = classicEditor;
//         })
//         .catch( error => {
//             console.error( error );
//         } );

$().ready( function () {

    document.ondblclick = function () {
        var sel = (document.selection && document.selection.createRange().text) ||
                  (window.getSelection && window.getSelection().toString());
        document.getElementById("wordInput").value= sel;
     };

     $("#synbtn").submit(function(e) {
        let word =  document.getElementById("wordInput").value;
        var form_elements = document.getElementById('synform').elements;
        var selectedRadio = form_elements['optionsRadios'].value;
        e.preventDefault();
        $.ajax({
            url: '/getDict',
            type: 'POST',
            data: {
                'word': word,
                'find':selectedRadio
            },
            
            success: function(data) {
                console.log(data);
                document.getElementById("textInput").innerHTML = data;
            },
            error: function(data) {
                console.log('error');
            }
        });
     });

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
                document.getElementById("textInput").innerHTML = data;
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
        
        // let data = editor.getData();
        let data = document.getElementById("textInput").innerHTML;
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
                // editor.setData(response.result.result_colored);
                document.getElementById("textInput").innerHTML = response.result.result_colored;
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