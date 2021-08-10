document.getElementById('formFileAsText').addEventListener('change', function () {
        console.log('file read started');
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById('textInput').value = fr.result;
        }
        fr.readAsText(this.files[0]);
    });

// var openFile = function(event) {
//     var input = event.target;
//     var reader = new FileReader();
//     reader.onload = function() {
//       var zip = new JSZip(reader.result);
//       var doc = new window.docxtemplater().loadZip(zip);
//       var text = doc.getFullText();
//       var node = document.getElementById('textInput');
//       node.innerText = text;
//     };
//     reader.readAsBinaryString(input.files[0]);
//   };