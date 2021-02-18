from spellchecker import SpellChecker

spell = SpellChecker()

"""
# find those words that may be misspelled
str="we are"
l=str.split(" ")
misspelled=spell.unknown(l)
#if you want, you can directly parse a list of strings:
#misspelled = spell.unknown(['let', 'us', 'wlak','on','the','groun'])

for word in misspelled:
    # Get the one `most likely` answer
    print(spell.correction(word))

    # Get a list of `likely` options
    print(spell.candidates(word))
"""

def is_missspelled(word):
    miss=spell.unknown(word)
    if(miss):
        return True
    else:
        return False

def get_correct(word):
    return spell.correction(word)

def get_candidates(word):
    return spell.candidates(word)

#print(get_candidates("psycopant"))
