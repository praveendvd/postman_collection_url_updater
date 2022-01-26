
![logo](https://github.com/praveendvd/postman_collection_url_updater/raw/master/logo/logo.png)

Github page: https://praveendvd.github.io/postman_collection_url_updater/

# postman-collection-url-updater

This is a command line utility that helps you to update request URLs in your collection files in a bulk. for instance, let say your URLs where in the form https://localhost:23456/api/v1/{{path}} and you wanted modify all the requests as {{baseURL}}/{{path}} you can do it as:

npx postman-collection-url-updater -c "collection.json" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "new_collection.json"

**in case of PATH and Query variables:**

    npx postman-collection-url-updater -c "collection.json" -r "https://{{test}}/:test/test" -w "https://localhost/newpath/:test/:test2""

retains the path variable :test and creates new path variable :test2

    npx postman-collection-url-updater -c "collection.json" -r "https://{{test}} -w "https://localhost/newpath"

makes the changes and if any other path variable is there then it will be retained

    npx postman-collection-url-updater -c "collection.json" -r "https://{{test}}/:test/test" -w "https://localhost/newpath""

makes the changes and removes :test if it doesn't exists in remaining part and retains remaining Path variables

eg , output would be https://localhost/newpath/:test/new , if path variable exists else https://localhost/newpath/new

**in case of REGEx match:**

    npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue&$2" -p 

or

    npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue&$2" -p true

This will replace all urls having query parameter with to the form  \<path\>?newquery=newvalue&\<remaining query>


## CLI Options

  

| options | alias | description | Example |
|--|--|-- |--|
| --collection_path | -c | Path to the source Collection.json file | collection.json or project/collection.json|
| --replace_url_part| -r | The part of the URL to modify | v<br><br>**or**<br><br>https://localhost:23456/api/v1/<br><br>**or**<br><br>localhost:23456/<br><br>**or**<br><br>anyregex eg: `(.*)\?(.*)`|
| --with_url_part| -w| The value to replace the matching URL part with| v2 <br><br>**or**<br><br> {{baseURL}}/{{path}}<br><br>**or**<br><br>localhost:8888<br><br>**or**<br><br>use regex group eg: `$1?newquery=newvalue$2`|
| --save_as| -s | (Optional) Path to output collection file,<br><br>DEFAULT: new_collection.json.<br><br>If no value provided then the file will be saved by prefixing new to current collection name | modifiedCollection.json<br><br>**or**<br><br>project/modifiedCollection.json|
| --use_regex_pattern| -p | (Optional) A flag to set whether to match URLs using Regex or not. <br><br>DEFAULT: false.Just pass the flag without any value eg `-p` to set this flag. <br><br>It also supports passing value as `-p true` |`npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue$2" -p` <br><br>**or**<br><br>`npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue$2" -p true`|