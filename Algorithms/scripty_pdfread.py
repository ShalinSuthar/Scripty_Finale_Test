import PyPDF2

def read_pdf(path):
    pdfFileObject = open(r''.join(path), 'rb')
    pdfReader = PyPDF2.PdfFileReader(pdfFileObject)
    pageObject = pdfReader.getPage(0)
    txt = pageObject.extractText()
    pdfFileObject.close()
    return txt
