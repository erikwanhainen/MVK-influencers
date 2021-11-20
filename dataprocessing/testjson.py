import json
# dataBE = data back end
# json data needs to come in from backend

with open('path_to_file/json_data.json') as dataBE:
  data = json.load(dataBE)

print(dataBE)