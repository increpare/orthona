all: ../orthona/www/js/compiled.js ../orthotope/js/compiled.js tmp/docDatabase.json ../orthotope/js/compiled.js res/entityNames.json

res/entityNames.json: res/datasheet/*.*
	(cd build/; ./updatenames)

tmp/docDatabase.json: res/docDatabase.slab
	(cd build; ./transformDocDatabase)

../orthona/www/js/compiled.js: tmp/docDatabase.json ./js/*.js
	browserify ./js/orthonaApp.js -o ../orthona/www/js/compiled.js

../orthotope/js/compiled.js: ./js/*.js
	 browserify ./js/orthotopeApp.js -o ../orthotope/js/compiled.js

