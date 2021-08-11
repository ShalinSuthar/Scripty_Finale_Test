//created for separations purposes..
let editor;
var doc = new jsPDF();
var can1 = new handwriting.Canvas(document.getElementById("imageCanvas"));




// ClassicEditor
//         .create( document.querySelector( '#textInput' ) )
//         .then( function ( classicEditor ) {
//             editor = classicEditor;
//         })
//         .catch( error => {
//             console.error( error );
//         } );


class Trie {
  constructor() {
    this.trie = null;
    this.suggestions = [];
  }

  newNode() {
    return {
      isLeaf: false,
      children: {}
    }
  }

  add(word) {
    if (!this.trie) this.trie = this.newNode();

    let root = this.trie;
    for (const letter of word) {
      if (!(letter in root.children)) {
        root.children[letter] = this.newNode();
      }
      root = root.children[letter];
    }
    root.isLeaf = true;
  }

  find(word) {
    let root = this.trie;
    for (const letter of word) {
      if (letter in root.children) {
        root = root.children[letter];
      } else {
        return null;
      }
    }

    return root;
  }

  traverse(root, word) {
    if (root.isLeaf) {
      this.suggestions.push(word);
      return;
    }

    for (const letter in root.children) {
      this.traverse(root.children[letter], word + letter);
    }
  }

  complete(word, CHILDREN = null) {
    const root = this.find(word);

    if (!root) return this.suggestions; // cannot suggest anything

    const children = root.children;

    let spread = 0;

    for (const letter in children) {
      this.traverse(children[letter], word + letter);
      spread++;

      if (CHILDREN && spread === CHILDREN) break;
    }

    return this.suggestions;
  }

  clear() {
    this.suggestions = [];
  }

  print() {
    console.log(this.trie);
  }
}


const getData = async () => {
  const url = 'https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary_compact.json';
  const res = await fetch(url, {
    method: 'GET'
  });

  return await res.json();
}


const getPopular = async () => {
  const url = 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt';

  const res = await fetch(url, {
    method: 'GET'
  });

  let text = await res.text();

  const popular = {};

  text = text.split('\n');

  const TOTAL = text.length;

  text.forEach((word, freq) => {
    if (word !== '') {
      popular[word.toLowerCase()] = TOTAL - freq;
    }
  });

  return popular;
}


  
$().ready(function () {
  const $input = document.getElementById('textInput');
const $time = document.getElementById('time');
const $fakeDiv = document.getElementById('fake-div');
const r = $input.getBoundingClientRect();
let INPUT_DEBOUNCE = null;
const css = getComputedStyle($input);
const $span = document.createElement('span');
$span.style.cssText = `
    width: ${r.width}px;
    height: ${r.height}px;
    left: ${r.left}px;
    top: ${r.top}px;
    z-index: -10;
    opacity: 0.4;
    position: absolute;
    white-space: pre-wrap;
    font-size: ${parseInt(css.fontSize)}px;
    padding-left: ${parseInt(css.paddingLeft+0.5)}px;
    padding-top: ${parseInt(css.paddingTop) + 1}px;
`;
    
    
document.body.appendChild($span);




let data = null,
  words = null,
  trie = null,
  popular = null;
let rest = null,
  suggestion = null;

  const init = async () => {
    console.log("GETTING DATA");
    $input.style.cursor = 'not-allowed';
  
    data = await getData();
    popular = await getPopular();
  
    words = Object.keys(data).sort();
  
    trie = new Trie();
  
    words.forEach(word => trie.add(word.toLowerCase()));
  
    $input.style.cursor = 'auto';
  
    console.log("INITIALIZED");
  }
  
  const getBestMatch = (suggestions) => {
    let bestMatch = null,
      bestScore = -100;
    for (const suggestion of suggestions) {
      if (suggestion in popular && popular[suggestion] > bestScore) {
        bestMatch = suggestion;
        bestScore = popular[suggestion];
      }
    }
  
    if (!bestMatch) bestMatch = suggestions[0];
  
    return bestMatch;
  }
  
  const main = (e) => {
    const query = e.target.textContent.toLowerCase();
  
    if (query !== '') {
      const find_start = new Date().getTime();
  
      let parts = query.split(' ');
  
      const wordToComplete = parts.pop();
  
      rest = parts.join(' ') + ' ';
  
      if (wordToComplete !== '') {
        suggestion = getBestMatch(trie.complete(wordToComplete));
  
        if (suggestion) {
          $fakeDiv.innerText = query;
  
          $span.style.left = r.left + $fakeDiv.clientWidth + 'px';
  
          const ghost = suggestion.slice(wordToComplete.length);
  
          trie.clear();
  
          $span.textContent = ghost;
  
          const find_end = new Date().getTime();
  
          const execTime = find_end - find_start;
  
          $time.textContent = `fetched in ${execTime}ms`;
        }
      } else {
        $span.textContent = '';
      }
    } else {
      $time.textContent = '';
      $span.textContent = '';
    }
  }
  
  init();
  
  const setEndOfContenteditable = (contentEditableElement) => {
    let range, selection;
    if (document.createRange) //Firefox, Chrome, Opera, Safari, IE 9+
    {
      range = document.createRange(); //Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
      range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection(); //get the selection object (allows you to change selection)
      selection.removeAllRanges(); //remove any selections already made
      selection.addRange(range); //make the range you have just created the visible selection
    } else if (document.selection) //IE 8 and lower
    {
      range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
      range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
      range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
      range.select(); //Select the range (make it the visible selection
    }
  }
  
  $input.addEventListener('input', e => {
    clearTimeout(INPUT_DEBOUNCE);
    $span.textContent = '';
  
    INPUT_DEBOUNCE = setTimeout(() => main(e), 250);
  });
  
  $input.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      $span.textContent = '';
      $input.textContent = rest + suggestion;
  
      setEndOfContenteditable($input);
    } else if (e.key === 'Enter') {
      $span.textContent = '';
    }
  });
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
              $("#wordOutput").html("No synonyms found");
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
              $("#wordOutput").append(`Verb - ${data.result.Verb[0]}`);
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
              $("#wordOutput").append(`No Meaning found`);
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

  var imageLoader = document.getElementById('formFile');
    imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');




function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     

    
}

  $("#readPdfImage").submit(function (e) {
    e.preventDefault();
    can1.setOptions(
      {
          language: "en",
          numOfReturn: 3
      }
  );
    can1.setCallBack(function(data, err) {
      if(err) throw err;
      else console.log(data);
  });
    can1.recognize();
    //getting the file..
    /*var form = new FormData($(this).get(0));

  
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
    });*/
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
      } else if (this.files[0].name.endsWith(".txt")) {
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

  $("#fmr_txt_sum").on("submit", function (e) {
    e.preventDefault();
    let text = document.getElementById("textInput").innerHTML;
    console.log((text));
    $.ajax({
      url: "textsummarize",
      type: "POST",
      data: {
        text: text,
        csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
      },
      success: function (data) {
        console.log(data);
        document.getElementById("textInput").innerHTML = data.result;
      },
      error: function (data) {
        console.log("error");
      },
    });
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
    var text = data;
    text = text.toString();
    text = text.replace( /(<([^>]+)>)/ig, '')
    localStorage.setItem('rawText', text);
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
        $("#textInput").html("Not found.");
      },
      complete: function () {
        $("#loader").addClass("hidden");
      },
    });
  });
});


$(function () {
  $('#sendmail').click(function (event) {
    var email = '';
    var subject = '';
    var emailBody = document.getElementById("textInput").innerHTML;
    var attach = 'path';
    document.location = "mailto:" + email + "?subject=" + subject + "&body=" + emailBody + "?attach=" + attach;
    console.log("mailto:" + email + "?subject=" + subject + "&body=" + emailBody + "?attach=" + attach);
    console.log(emailBody);
  });
});

$(function () {
  $('#copyText').click(function (event) {
    var text = document.getElementById("textInput").innerHTML;
    text = text.toString();
    text = text.replace( /(<([^>]+)>)/ig, '');
    navigator.clipboard.writeText(text).then(function () {
      console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  });
});

document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'z') {
    var correctText = document.getElementById('textInput').innerHTML;
    localStorage.setItem('correctText', correctText);
    document.getElementById('textInput').innerHTML = localStorage.getItem('rawText');
  }
  if (event.ctrlKey && event.key === 'y') {
    document.getElementById('textInput').innerHTML = localStorage.getItem('correctText');
  }
});