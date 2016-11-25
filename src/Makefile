all: ../orthona/www/js/compiled.js ../orthotope/js/compiled.js tmp/docDatabase.json ../orthotope/js/compiled.js res/entityNames.json ../webintro/js/compiled.js ../webrender/js/compiled.js

res/entityNames.json: res/datasheet/*.*
	(cd build/; ./updatenames)

tmp/docDatabase.json: res/docDatabase.slab
	(cd build; ./transformDocDatabase)

../orthona/www/js/compiled.js: tmp/docDatabase.json ./js/*.js
	(browserify ./js/orthonaApp.js -o ../orthona/www/js/compiled.js; cd ../orthona; cordova build ios; cordova build browser)

../orthotope/js/compiled.js: ./js/*.js
	 browserify ./js/orthotopeApp.js -o ../orthotope/js/compiled.js

../webintro/js/compiled.js: ./js/*.js
	browserify ./js/webintro.js -o ../webintro/js/compiled.js

../webrender/js/compiled.js: ./js/*.js
	browserify ./js/webrender.js -o ../webrender/js/compiled.js
