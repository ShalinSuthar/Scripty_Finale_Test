//created for separations purposes..
let editor;
var doc = new jsPDF();

// ClassicEditor
//         .create( document.querySelector( '#textInput' ) )
//         .then( function ( classicEditor ) {
//             editor = classicEditor;
//         })
//         .catch( error => {
//             console.error( error );
//         } );

$().ready(function () {
  document.ondblclick = function () {
    var sel =
      (document.selection && document.selection.createRange().text) ||
      (window.getSelection && window.getSelection().toString());
    document.getElementById("wordInput").value = sel;
  };

  $("#synform").submit(function (e) {
    e.preventDefault();
    $("#wordInput").empty();
    let word = document.getElementById("wordInput").value;
    var form_elements = document.getElementById("synform").elements;
    var selectedRadio = form_elements["optionsRadios"].value;
    e.preventDefault();
    switch (selectedRadio) {
      case "synonym":
        console.log("synonym");
        $.ajax({
          type: "POST",
          url: "/gosynonym",
          data: {
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            word: word,
          },
          success: function (data) {
            console.log(data);
            if (data.result.length == 0) {
              $("#wordOutput").html("No antonyms found");
            } else {
              $("#wordOutput").html(data.result.slice(0, 3).toString(","));
            }
          },
          beforeSend: function () {
            $("#loader").removeClass("hidden");
          },

          error: function (response) {
            $("#loader").addClass("hidden");
            console.log(response);
          },
          complete: function () {
            $("#loader").addClass("hidden");
          },
        });
        break;
      case "meaning":
        $.ajax({
          type: "POST",
          url: "/gomeaning",
          data: {
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            word: word,
          },
          success: function (data) {
            $("#wordOutput").empty();
            console.log(data);
            if (data.result.Noun !== undefined) {
              $("#wordOutput").html(`Noun - ${data.result.Noun[0]}`);
            }
            if (data.result.Verb !== undefined) {
              $("#wordOutput").append(`\nVerb - ${data.result.Verb[0]}`);
            }
            if (data.result.Adjective !== undefined) {
              $("#wordOutput").append(
                `\nAdjective - ${data.result.Adjective[0]}`
              );
            }
            if (data.result.Adverb !== undefined) {
              $("#wordOutput").append(`\nAdverb - ${data.result.Adverb[0]}`);
            }
            if (data.result.Pronoun !== undefined) {
              $("#wordOutput").append(`\nPronoun - ${data.result.Pronoun[0]}`);
            }
            if (data.result.Preposition !== undefined) {
              $("#wordOutput").append(
                `\nPreposition - ${data.result.Preposition[0]}`
              );
            }
            if (
              data.result.sub_members !== undefined &&
              data.result.sub_members.length == 0
            ) {
              $("#wordOutput").append(`\nNo Meaning found`);
            }
          },
          beforeSend: function () {
            $("#loader").removeClass("hidden");
          },

          error: function (response) {
            $("#loader").addClass("hidden");
            console.log(response);
          },
          complete: function () {
            $("#loader").addClass("hidden");
          },
        });
        break;
      case "antonym":
        $.ajax({
          type: "POST",
          url: "/goantonym",
          data: {
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            word: word,
          },
          success: function (data) {
            console.log(data);
            if (data.result.length == 0) {
              $("#wordOutput").html("No antonyms found");
            } else {
              $("#wordOutput").html(data.result.slice(0, 3).toString(","));
            }
          },
          beforeSend: function () {
            $("#loader").removeClass("hidden");
          },

          error: function (response) {
            $("#loader").addClass("hidden");
            console.log(response);
          },
          complete: function () {
            $("#loader").addClass("hidden");
          },
        });
        break;
      default:
        $.ajax({
          type: "POST",
          url: "/gosynonym",
          data: {
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            word: word,
          },
          success: function (data) {
            console.log(data);
            if (data.result.length == 0) {
              $("#wordOutput").html("No Synonyms found");
            } else {
              $("#wordOutput").html(data.result.slice(0, 3).toString(","));
            }
          },
          beforeSend: function () {
            $("#loader").removeClass("hidden");
          },

          error: function (response) {
            $("#loader").addClass("hidden");
            console.log(response);
          },
          complete: function () {
            $("#loader").addClass("hidden");
          },
        });
        break;
    }
    // $.ajax({
    //     url: '/getDict',
    //     type: 'post',
    //     data: {
    //         'word': word,
    //         'find':selectedRadio,
    //         csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
    //     },

    //     success: function(data) {
    //         console.log(data);
    //         document.getElementById("textInput").innerHTML = data;
    //     },
    //     error: function(data) {
    //         console.log('error');
    //     }
    // });
  });

  $("#textInput").on("focus", function () {
    $("#get_back").css("color", "black");
    $("span:last-child").css("color", "black");
  });

  $("#get_back").on("key");

  $("#translateForm").submit(function (e) {
    e.preventDefault();
    let fromLanguage = $("#fromLanguage").val();
    let toLanguage = $("#toLanguage").val();
    //console.log(toLanguage);

    let text = document.getElementById("textInput").innerHTML;
    console.log(text, "here");
    $.ajax({
      type: "post",
      url: "/translateText",
      data: {
        text: text,
        src: fromLanguage,
        dest: toLanguage,
        csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
      },
      beforeSend: function () {
        $("#loader").removeClass("hidden");
      },
      success: function (response) {
        // console.log(response);
        $("#loader").addClass("hidden");
        document.getElementById("textInput").innerHTML = response.result;
        // editor.setData(response.result);
      },
      error: function (response) {
        $("#loader").addClass("hidden");
        console.log(response);
      },
      complete: function () {
        $("#loader").addClass("hidden");
      },
    });
  });

  $("#readPdfImage").submit(function (e) {
    e.preventDefault();

    //getting the file..
    var form = new FormData($(this).get(0));

    $.ajax({
      url: "readPdfImage",
      type: "POST",
      data: form,
      cache: false,
      processData: false,
      contentType: false,
      success: function (data) {
        console.log(data);
        document.getElementById("textInput").innerHTML = data.result;
      },
      error: function (data) {
        console.log("error");
      },
    });
  });

  // $("#exportBtn").on('click', function () {
  //   let text = document.getElementById("textInput").innerHTML;

  //   //download text from the editor
  //   var blob = new Blob([text], {
  //     type: "text/plain;charset=utf-8"
  //   });
  //   saveAs(blob, "text.txt");
  // });

  //read input file from txtFileReader form
  document
    .getElementById("formFileAsText")
    .addEventListener("change", function () {
      // var fr = new FileReader();
      // fr.onload = function () {
      //   document.getElementById("textInput").textContent = fr.result;
      // };

      if (this.files[0].name.endsWith(".docx")) {
        parseWordDocxFile(this);
      } else if(this.files[0].name.endsWith(".txt")) {
        var fr = new FileReader();
        fr.onload = function () {
          document.getElementById("textInput").textContent = fr.result;
        };
        fr.readAsText(this.files[0]);
      }

      // fr.readAsText(this.files[0]);
      function parseWordDocxFile(inputElement) {
        var files = inputElement.files || [];
        if (!files.length) return;
        var file = files[0];

        console.time();
        var reader = new FileReader();
        reader.onloadend = function (event) {
          var arrayBuffer = reader.result;
          // debugger

          mammoth
            .convertToHtml({ arrayBuffer: arrayBuffer })
            .then(function (resultObject) {
              $("#textInput").html(resultObject.value);
              //console.log(resultObject.value)
            });
          console.timeEnd();

          // mammoth.extractRawText({arrayBuffer: arrayBuffer}).then(function (resultObject) {
          //   result2.innerHTML = resultObject.value
          //   console.log(resultObject.value)
          // })

          // mammoth.convertToMarkdown({arrayBuffer: arrayBuffer}).then(function (resultObject) {
          //   result3.innerHTML = resultObject.value
          //   console.log(resultObject.value)
          // })
        };
        reader.readAsArrayBuffer(file);
      }
    });
  //export pdf
  $("#txtExportBtn").on("click", function () {
    let text = document.getElementById("textInput").innerHTML;
    let blob = new Blob([text], {
      type: "text/plain",
    });
    saveAs(blob, "text");
  });

  // export pdf from #textInput
  $("#pdfExportBtn").on("click", function () {
    let text = document.getElementById("textInput").innerHTML;
    // let blob = new Blob([text], {
    //   type: "application/pdf",
    // });
    // saveAs(blob, "text.pdf");

    doc.text(text, 10, 10);
    doc.save("a4.pdf");
  });

  function saveAs(blob, filename) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  $("#checkerForm").submit(function (e) {
    $("#ocrFileInput").modal("hide");
    e.preventDefault();
    //close modal ocrFileInput

    // let data = editor.getData();
    let data = document.getElementById("textInput").innerHTML;
    $.ajax({
      type: "post",
      url: "grammarCheck",
      data: {
        text: data,
        csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
      },
      beforeSend: function () {
        $("#loader").removeClass("hidden");
      },
      success: function (response) {
        console.log(response.result, typeof response);
        console.log(
          new DOMParser().parseFromString(
            response.result.result_colored,
            "text/html"
          )
        );

        // editor.setData(response.result.result_colored);
        document.getElementById("textInput").innerHTML =
          response.result.result_colored;
      },
      error: function (response) {
        console.log(response);
      },
      complete: function () {
        $("#loader").addClass("hidden");
      },
    });
  });
});
