
![logo](https://github.com/praveendvd/postman_collection_url_updater/raw/master/logo/logo.png)

Github page: https://praveendvd.github.io/postman_collection_url_updater/

- [Introduction](#introduction)
- [Getting started](#getting-started)
- [Executing the utilities](#executing-the-utilities)
    + [postman-collection-url-updater:](#postman-collection-url-updater-)
    + [postman-collection-aggregator:](#postman-collection-aggregator-)
- [Utitlity Specific Documentation](#utitlity-specific-documentation)
  * [postman-collection-url-updater](#postman-collection-url-updater)
    + [in case of PATH and Query variables:](#in-case-of-path-and-query-variables-)
    + [in case of REGEx match:](#in-case-of-regex-match-)
    + [Interactive Option](#interactive-option)
    + [CLI Options](#cli-options)
  * [postman-collection-aggregator](#postman-collection-aggregator)
    + [Interactive Option](#interactive-option-1)
    + [CLI Options](#cli-options-1)


# Introduction

Postman collection url updater is a command line utility project that can update urls across multiple postman requests in your postman collection and, move multiple collections into single collection. It allows to **update postman request urls in bulk inside the postman collection**, and also support **migrating multiple collection into single collection**",❤️

To use the project , just install the package and then run any of the below commandline utilities as per your need 🎉🎉

1. **postman-collection-url-updater :** A commandline utilty that allows to update urls in bulk inside your collection
2. **postman-collection-aggregator :** A commandline utilty that allows to move all collections into a single collection

# Getting started

First install the package locally or globally

`npm i postman-collection-url-updater`

or

`npm i -g postman-collection-url-updater`


# Executing the utilities

Now the utility can be executed as directly or using npx, depending whether the package was installed globally or  
locally

### postman-collection-url-updater:

**if installed locally:**

`npx postman-collection-url-updater -c collection.json -r www.test.com -w {{Baseurl}}`

**if installed globally:**

`postman-collection-url-updater -c collection.json -r www.test.com -w {{Baseurl}}`

### postman-collection-aggregator:

**if installed locally:**

`npx postman-collection-aggregator -d collectiondirectory -n Aggregated_collection`

**if installed globally:**

`postman-collection-aggregator -d collectiondirectory -n Aggregated_collection`

# Utitlity Specific Documentation

## postman-collection-url-updater

postman-collection-url-updater is a command line utility project that can update urls across multiple postman requests in your postman collection. It allows to update postman request urls in bulk inside the postman collection

for instance, let say your Postman request URLs where in the form https://localhost:23456/api/v1/{{path}} and you wanted modify all the requests inside your postman collection as {{baseURL}}/{{path}} you can do it as:

npx postman-collection-url-updater -c "collection.json" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "new_collection.json"

### in case of PATH and Query variables:

    npx postman-collection-url-updater -c "collection.json" -r "https://{{test}}/:test/test" -w "https://localhost/newpath/:test/:test2""

retains the path variable :test and creates new path variable :test2

    npx postman-collection-url-updater -c "collection.json" -r "https://{{test}} -w "https://localhost/newpath"

makes the changes and if any other path variable is there then it will be retained

    npx postman-collection-url-updater -c "collection.json" -r "https://{{test}}/:test/test" -w "https://localhost/newpath""

makes the changes and removes :test if it doesn't exists in remaining part and retains remaining Path variables

eg , output would be https://localhost/newpath/:test/new , if path variable exists else https://localhost/newpath/new

### in case of REGEx match:

Pass the regex as -r parameter and replace it with -w parameter. -w parameter will have the capture group available:

For example:

    npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue&$2" -p 

or

    npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue&$2" -p true

This will replace all urls having query parameter to the form  \<path\>?newquery=newvalue&\<remaining query>

If you want to add query parameter to all URLs irrespective of whether the query parameter exists or not, then use :

    npx postman-collection-url-updater -c "collection.json" -r "^(.*?)(?:\?(.*))?$" -w "$1?newquery=newvalue&$2" -p true
    
### Interactive Option

You can also pass arguments interactively by passing i flag

`npx postman-collection-url-updater -i`


### CLI Options
  

| options | alias | description | Example |
|--|--|-- |--|
| --interactive| -i | (Optional) Allows to pass arguments interactively, DEFAULT: false.| npx postman-collection-url-updater -i |
| --use_regex_pattern| -p | (Optional) A flag to set whether to match URLs using Regex or not. DEFAULT: false.Just pass the flag without any value eg `-p` to set this flag. It also supports passing value as `-p true` |`npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue$2" -p` or `npx postman-collection-url-updater -c "collection.json" -r "(.*)\?(.*)" -w "$1?newquery=newvalue$2" -p true`|
| --collection_path | -c  | Path to the source Collection.json file | collection.json or project/collection.json|
| --replace_url_part| -r | The part of the URL to modify | v1 or https://localhost:23456/api/v1/ or localhost:23456/|
| --with_url_part| -w| The value to replace the matching URL part with| v2 or {{baseURL}}/{{path}} or localhost:8888/| |
| --save_as| -s | (Optional) Path to output collection file, DEFAULT: new_collection.json. If no value provided then the file will be saved by prefixing new to current collection name  | modifiedCollection.json or project/modifiedCollection.json|

## postman-collection-aggregator

postman-collection-aggregator is a command line utility project that can move multiple collections into a new single collection.  For instance , lets say you have two collections A and B , **then a new collection C will be created with A and B as folders in C**.  As folders doesn't support variables , **collection variable will be added to the parent collections variables section and duplicate variables might be merged** all other properties remains intact

You can either pass in the directory containing all the collection.json files that you want to aggregate using -d argument or pass path to each individual target collections using -l argument

`postman-collection-aggregator -d ./collectionFolder`  or

    postman-collection-aggregator -l "./collectionFolder/collection1.json" "./collectionFolder/collection2.json" 

you can pass name of your new collection using -n 

`postman-collection-aggregator -d ./collectionFolder -n "new_collection"`

**see more arguments in the below sections**

### Interactive Option

You can also pass arguments interactively by passing i flag

`postman-collection-aggregator -i` 


### CLI Options
  

| options | alias | description | Example |
|--|--|-- |--|
| --interactive| -i | (Optional) Allows to pass arguments interactively, DEFAULT: false.| `npx postman-collection-aggregator -i` |
| --new_collection_name| -n | (Optional) Pass name for your new collection, DEFAULT: Aggregated_collection| 
| --collection_list | -l  | Path to the each individual target Collection.json file separated by space|`npx postman-collection-aggregator -l "./collection1.json" "./collection2.json" -n "new_collection"`
| --collection_directory| -d | Path to the directory containing all the collection.json files. [**NOTE**: only direct childs will be considered , subdirectories are ignored]|`npx postman-collection-aggregator -d "./collectionDirectory" -n "new_collection"`
| --save_as| -s | (Optional) Path to output collection file, DEFAULT: <collection_name>.collection.json.|`npx postman-collection-aggregator -d "./collectionDirectory" -n "new_collection" -s "output/new.json"`

**Note:** Either -d or -l is required . If both are given only -d will be considered

