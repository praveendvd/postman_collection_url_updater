

![logo](https://github.com/praveendvd/postman_collection_url_updater/raw/master/logo/logo.png)

Github page: https://praveendvd.github.io/postman_collection_url_updater/

# postman-collection-url-updater

Postman collection url updater (postman-collection-url-updater) is a command line utility project that can update urls across multiple postman requests in your postman collection. It allows to update postman request urls in buld inside the postman collection

for instance, let say your Postman request URLs where in the form https://localhost:23456/api/v1/{{path}} and you wanted modify all the requests inside your postman collection as {{baseURL}}/{{path}} you can do it as:

npx postman-collection-url-updater -c "collection.json" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "new_collection.json"

## in case of PATH and Query variables:

    npx postman-collection-url-updater -c "collection.json" -r "https://{{test}}/:test/test" -w "https://localhost/newpath/:test/:test2""

retains the path variable :test and creates new path variable :test2

    npx postman-collection-url-updater -c "collection.json" -r "https://{{test}} -w "https://localhost/newpath"

makes the changes and if any other path variable is there then it will be retained

    npx postman-collection-url-updater -c "collection.json" -r "https://{{test}}/:test/test" -w "https://localhost/newpath""

makes the changes and removes :test if it doesn't exists in remaining part and retains remaining Path variables

eg , output would be https://localhost/newpath/:test/new , if path variable exists else https://localhost/newpath/new

## in case of REGEx match:

Pass the regex as -r parameter and replace it with -w parameter. -w parameter will have the capture group available:

For example:

    npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue&$2" -p 

or

    npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue&$2" -p true

This will replace all urls having query parameter to the form  \<path\>?newquery=newvalue&\<remaining query>

If you want to add query parameter to all URLs irrespective of whether the query parameter exists or not, then use :

    npx postman-collection-url-updater -c "collection.json" -r "^(.*?)(?:\?(.*))?$" -w "$1?newquery=newvalue&$2" -p true
## Interactive Option

You can also pass arguments interactively by passing i flag

`npx postman-collection-url-updater -i`


## CLI Options
  

| options | alias | description | Example |
|--|--|-- |--|
| --interactive| -i | (Optional) Allows to pass arguments interactively, DEFAULT: false.| npx postman-collection-url-updater -i |
| --use_regex_pattern| -p | (Optional) A flag to set whether to match URLs using Regex or not. DEFAULT: false.Just pass the flag without any value eg `-p` to set this flag. It also supports passing value as `-p true` |`npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue$2" -p` or `npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue$2" -p true`|
| --collection_path | -c  | Path to the source Collection.json file | collection.json or project/collection.json|
| --replace_url_part| -r | The part of the URL to modify | v1 or https://localhost:23456/api/v1/ or localhost:23456/|
| --with_url_part| -w| The value to replace the matching URL part with| v2 or {{baseURL}}/{{path}} or localhost:8888/| |
| --save_as| -s | (Optional) Path to output collection file, DEFAULT: new_collection.json. If no value provided then the file will be saved by prefixing new to current collection name  | modifiedCollection.json or project/modifiedCollection.json|

