import json
import ssl
import certifi
from config import FMP_KEY, API_ROOT
from urllib.request import urlopen

def callApi(endpoint, ticker, period=None, limit=400):    
    url = (API_ROOT + endpoint + '/' + ticker + '?limit='+ str(limit) +'&apikey=' + FMP_KEY)
    print(url)
    if period is not None:
        url = url + '&period=' + period
    response = urlopen(url, context=ssl.create_default_context(cafile=certifi.where()))
    data = response.read().decode('utf-8')
    return json.loads(data)