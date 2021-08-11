from PyDictionary import PyDictionary
from nltk.corpus import wordnet

dictionary=PyDictionary()

def getmeaning(word):
    mn=dictionary.meaning(word)
    if(mn):
        return mn
    else:
        return ("Couldn't find meaning")

# def getsynonym(word):
#     syn=dictionary.synonym(word)
#     if(syn):
#         return syn[:5]
#     else:
#         return ("No synonym found")
# def getantonym(word):
#     ant=dictionary.antonym(word)
#     if(ant):
#         return ant[:5]
#     else:
#         return ("No antonym found")

# def gettranslate(word,lang='hi'):
#     return (dictionary.translate(word,lang))
antonyms = []

def getsynonym(word):
    synonyms = []
    for syn in wordnet.synsets(word):
        for l in syn.lemmas():
            if(l.name()):
                synonyms.append(l.name())
    return synonyms

def getantonym(word):
    antonyms = []
    for syn in wordnet.synsets(word):
        for l in syn.lemmas():
            if(l.antonyms()):
                antonyms.append(l.antonyms()[0].name()) 
    return antonyms

#             print("syn: ", set(synonyms))
# print("anto ", set(antonyms))
