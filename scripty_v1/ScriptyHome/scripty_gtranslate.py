from googletrans import Translator, constants, LANGUAGES


def gtranslate(text,dest="hi",src="en"):
    translator = Translator()
    return translator.translate(text,dest = dest,src=src).text


# Alternative approach

# Used in last version

# class Mytranslator:
#     def __init__(self):
#         self.langs=list(LANGUAGES.values())
#     def run(self,txt="type text here",src="english",dest="hindi"):
#         self.ts=Translator()
#         self.txt=txt
#         self.src=src
#         self.dest=dest
#         try:
#             self.translated=self.ts.translate(self.txt,src=self.src,dest=self.dest)
#         except:
#             self.translated=self.ts.translate(self.txt)
#         self.ttext=self.translated.text

#         return self.ttext
