# Scripty_Finale_Test
Test respository for access and development of Scripty Web App


To Run the *Django- App*
    *Dependies*
        - Django

1. Locate to manage.py file inside Scripty_v1 Folder.

2. run - python manage.py runserver

*NOTE* - USE NEW GOOGLE TRANSLATION PACKAGE..

run pip install git+https://github.com/lushan88a/google_trans_new

Then do this..

Locate to C:\Users\{USERNAME}\AppData\Local\Programs\Python\Python39\Lib\site-packages\google_trans_new
Change line 151 in google_trans_new/google_trans_new.py which is: response = (decoded_line + ']') to response = decoded_line