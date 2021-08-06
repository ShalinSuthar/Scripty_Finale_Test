
import requests
import json

def ocr_space_file(filename, overlay=False, api_key='helloworld', language='eng'):
    payload = {'isOverlayRequired': overlay,
               'apikey': '722d5f934d88957',
               'language': language,
               'OCREngine': 2
               }
    with open(filename, 'rb') as f:
        r = requests.post('https://api.ocr.space/parse/image',
                          files={filename: f},
                          data=payload,
                          
                          )
    rp = json.loads(r.content.decode())
    return rp["ParsedResults"][0]["ParsedText"]


def ocr_space_url(url, overlay=False, api_key='helloworld', language='eng'):
    payload = {'url': url,
               'isOverlayRequired': overlay,
               'apikey': '722d5f934d88957',
               'language': language,
               }
    r = requests.post('https://api.ocr.space/parse/image',
                      data=payload,
                      )
    rp = json.loads(r.content.decode())
    return rp["ParsedResults"][0]["ParsedText"]


# Use examples:
# test_file = ocr_space_file(filename='example_image.png', language='pol')
# test_url = ocr_space_url(url='http://i.imgur.com/31d5L5y.jpg')
