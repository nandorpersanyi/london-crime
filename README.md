# Website

[http://web.nandorpersanyi.com/london-crime-dashboard/](http://web.nandorpersanyi.com/london-crime-dashboard/ "London Crime Dashboard")

- username: london
- password: crime1234

## Build

`npm install`

`bower install`

## Add data

Add the following two files to the app/data folder:

[2015-10-metropolitan-street-trimmed4.json](http://web.nandorpersanyi.com/london-crime-dashboard/data/2015-10-metropolitan-street-trimmed4.json)
[london-boroughs.geojson](http://web.nandorpersanyi.com/london-crime-dashboard/data/london-boroughs.geojson)

This data is publicly available under the Open Government Licence.

## Develop

`grunt serve`

Depending on Google's policies in the future, you may need to add an API key for the map to work:
index.html, line 28
`<script src='//maps.googleapis.com/maps/api/js?key=YOUR_API_KEY'></script>`


## Deploy

`grunt builddeploy`

Will deploy the application in the dist folder