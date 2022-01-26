![logo](https://github.com/praveendvd/postman_collection_url_updater/raw/master/logo/logo.png)

Github page: https://praveendvd.github.io/postman_collection_url_updater/

# postman-collection-url-updater

This is a command line utility that helps you to update request URLs in your collection files in a bulk. for instance, let say your URLs where in the form  https://localhost:23456/api/v1/{{path}} and you wanted modify all the requests as {{baseURL}}/{{path}} you can do it as:

    npx postman-collection-url-updater -c "collection.json" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "new_collection.json"
 
in case of PATH variables:

    npx postman-collection-url-updater -c "collection.json" -r "https://{{test}}/:test/test" -w "https://localhost/newpath/:test"

retains the path variable 

    npx postman-collection-url-updater -c "collection.json" -r "https://{{test}} -w "https://localhost/newpath"

makes the changes and if any other path variable is there then it will be retained

eg , output would be https://localhost/newpath/:test/new , if path variable exists else https://localhost/newpath/new


## CLI Options

| options | alias | description | Example |
|--|--|-- |--|
| --collection_path | -c  | Path to the source Collection.json file | collection.json or project/collection.json|
| --replace_url_part| -r | The part of the URL to modify | v1 or https://localhost:23456/api/v1/ or localhost:23456/|
| --with_url_part| -w| The value to replace the matching URL part with| v2 or {{baseURL}}/{{path}} or localhost:8888/| |
| --save_as| -s | (Optional) Path to output collection file, DEFAULT: new_collection.json. If no value provided then the file will be saved by prefixing new to current collection name  | modifiedCollection.json or project/modifiedCollection.json|

