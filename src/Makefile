all: ../orthona/www/js/compiled.js ../orthotope/js/compiled.js tmp/docDatabase.json ../orthotope/js/compiled.js

tmp/docdatabase.json: res/docDatabase.slab
	cd build;\
	./transformDocDatabase;\
	cd ..

../orthona/www/js/compiled.js: ./js/orthonaApp.js
	browserify ./js/orthonaApp.js -o ../orthona/www/js/compiled.js

../orthotope/js/compiled.js: ./js/orthotopeApp.js
	 browserify ./js/orthotopeApp.js -o ../orthotope/js/compiled.js

