
import requests

URL = "https://services.gingersoftware.com/Ginger/correct/jsonSecured/GingerTheTextFull"  # noqa
API_KEY = "6ae0c3a0-afdc-4532-a810-82ded0054236"
from colorama import Fore, Back, Style

class GingerIt(object):
    def __init__(self):
        self.url = URL
        self.api_key = API_KEY
        self.api_version = "2.0"
        self.lang = "US"

    def parse(self, text, verify=True):
        session = requests.Session()
        request = session.get(
            self.url,
            params={
                "lang": self.lang,
                "apiKey": self.api_key,
                "clientVersion": self.api_version,
                "text": text,
            },
            verify=verify,
        )
        data = request.json()
        # print(data)
        return self._process_data(text, data)

    @staticmethod
    def _change_char(original_text, from_position, to_position, change_with):

        return "{}{}{}".format(
            original_text[:from_position],'<span style="color: green;">'+ change_with+'</span>', original_text[to_position + 1 :]
        )
    
    @staticmethod
    def _change_og(original_text, from_position, to_position, change_with):
        return "{}{}{}".format(
            original_text[:from_position],'<span style="color: red;">'+ change_with+'</span>', original_text[to_position + 1 :]
        )

    def _process_data(self, text, data):
        result = text
        ogr = text
        corrections = []

        for suggestion in reversed(data["Corrections"]):
            start = suggestion["From"]
            end = suggestion["To"]

            if suggestion["Suggestions"]:
                suggest = suggestion["Suggestions"][0]
                result = self._change_char(result, start, end, suggest["Text"])
                ogr = self._change_og(ogr, start, end, text[start: end+1])
                corrections.append(
                    {
                        "start": start,
                        "text": text[start : end + 1],
                        "correct": suggest.get("Text", None),
                        "definition": suggest.get("Definition", None),
                    }
                )

        return {"text": text, "result_colored": result, "corrections": corrections, "original_text_colored":ogr}


def check_grammer(text):
    parser = GingerIt()
    return paser.parse(text)



# text = 'The smelt of fliwers bring back memories.'
# parser = GingerIt()
# print(parser.parse(text))