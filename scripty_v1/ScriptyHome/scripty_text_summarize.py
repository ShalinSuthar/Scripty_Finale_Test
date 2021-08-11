import nltk 
from nltk.corpus import stopwords 
from nltk.tokenize import word_tokenize, sent_tokenize 
   
def summarize(text):
    stopWords = set(stopwords.words("english")) 
    words = word_tokenize(text) 

    freqTable = dict() 
    for word in words: 
        word = word.lower() 
        if word in stopWords: 
            continue
        if word in freqTable: 
            freqTable[word] += 1
        else: 
            freqTable[word] = 1
   
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
    # print(summary)
    return summary
# text ="Adding feelings to your essays can be much more powerful than just listing your achievements. It allows reviewers to connect with you and understand your personality and what drives you. In particular, be open to showing vulnerability. Nobody expects you to be perfect and acknowledging times in which you have felt nervous or scared shows maturity and self-awareness."


# print(summarize(text))