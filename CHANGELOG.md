
  
# Change Log
All notable changes to this project will be documented in this file.
 
 
## [Unreleased] - 2022-01-24
 
Added functionality to update URLs, example : user can update the https://localhost/ part to {{BaseURL}} in bulk by using the command 

    npx postman-collection-url-updater -c "collection.json" -r "https://localhost:23456/api/v1/{{path}}" -w "{{baseURL}}/{{path}}" -s "new_collection.json"

## [1.0.0 - 1.0.7] - 2022-01-24


### Added

ReadME , Tags and Console outputs

## [1.0.8] - 2022-01-24
  
Here we would have the update steps for 1.2.4 for people to follow.
 
### Added
 
### Fixed
 
-  PATCH Add logic to convert PATH variables and retain PATH variables as when requires. eg: 
- 
      postman-collection-url-updater -c "collection.json" -r "https://{{test}}/:test/test" -w "https://localhost/newpath/;test"

retains the path variable 

    postman-collection-url-updater -c "collection.json" -r "https://{{test}} -w "https://localhost/newpath"

makes the changes and if any other path variable is there then it will be retained

eg , output would be https://localhost/newpath/:test/new , if path variable exists else https://localhost/newpath/new
 