# importing libraries 
import nltk 
from nltk.corpus import stopwords 
from nltk.tokenize import word_tokenize, sent_tokenize 
   
# Input text - to summarize  
text = """Upon hearing, in March of [2013],
reports that a 17-year-old schoolboy had sold a piece of software to Yahoo!
for $30 million, you might well have entertained a few preconceived notions about
what sort of child this must be...The app [that then 15-year-old Nick] D'Aloisio designed,
Summly, compresses long pieces of text into a few representative sentences. When he released an
early iteration, tech observers realized that an app that could deliver brief, accurate summaries would be
hugely valuable in a world where we read everything—from news stories to corporate reports—on our phones,
on the go...There are two ways of doing natural language processing: statistical or semantic,' D'Aloisio explains.
A semantic system attempts to figure out the actual meaning of a text and translate it succinctly.
A statistical system—the type D'Aloisio used for Summly—doesn't bother with that; it keeps phrases and
sentences intact and figures out how to pick a few that best encapsulate the entire work.
'It ranks and classifies each sentence, or phrase, as a candidate for inclusion in the summary.
It's very mathematical. It looks at frequencies and distributions, but not at what the words mean. """


def summarize(text):
# Tokenizing the text 
    stopWords = set(stopwords.words("english")) 
    words = word_tokenize(text) 
   
# Creating a frequency table to keep the  
# score of each word 
   
    freqTable = dict() 
    for word in words: 
        word = word.lower() 
        if word in stopWords: 
            continue
        if word in freqTable: 
            freqTable[word] += 1
        else: 
            freqTable[word] = 1
   
# Creating a dictionary to keep the score 
# of each sentence 
    sentences = sent_tokenize(text) 
    sentenceValue = dict() 
   
    for sentence in sentences: 
        for word, freq in freqTable.items(): 
            if word in sentence.lower(): 
                if sentence in sentenceValue: 
                    sentenceValue[sentence] += freq 
                else: 
                    sentenceValue[sentence] = freq 
   
   
   
    sumValues = 0
    for sentence in sentenceValue: 
        sumValues += sentenceValue[sentence] 
   
# Average value of a sentence from the original text 
   
    average = int(sumValues / len(sentenceValue)) 
   
# Storing sentences into our summary. 
    summary = '' 
    for sentence in sentences: 
        if (sentence in sentenceValue) and (sentenceValue[sentence] > (1.2 * average)): 
            summary += " " + sentence 
    return(summary)
"""
original_word=len(text.split(' '))
original_sent=len(summary.split(' '))
new_word=len(text.split('.'))
new_sent=len(summary.split('.'))

print(original_word, new_word)
print(original_sent,new_sent)
"""
print(summarize(text))
