from PyDictionary import PyDictionary
dictionary=PyDictionary()

def getmeaning(word):
    mn=dictionary.meaning(word)
    if(mn):
        return mn
    else:
        return ("Couldn't find meaning")

def getsynonym(word):
    syn=dictionary.synonym(word)
    if(syn):
        return syn[:5]
    else:
        return ("No synonym found")
def getantonym(word):
    ant=dictionary.antonym(word)
    if(ant):
        return ant[:5]
    else:
        return ("No antonym found")

def gettranslate(word,lang='hi'):
    return (dictionary.translate(word,lang))
