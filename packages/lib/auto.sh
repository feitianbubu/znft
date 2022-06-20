cd constant
./node_modules/.bin/tsc --module es2020 --outDir ./es
./node_modules/.bin/tsc --module commonjs --outDir ./lib
cd ..

cd util
./node_modules/.bin/tsc  --module es2020 --outDir ./es
./node_modules/.bin/tsc  --module commonjs --outDir ./lib
cd ..

cd service
./node_modules/.bin/tsc  --module es2020 --outDir ./es
./node_modules/.bin/tsc  --module commonjs --outDir ./lib
cd ..

cd react-hook
./node_modules/.bin/tsc  --module es2020 --outDir ./es
./node_modules/.bin/tsc  --module commonjs --outDir ./lib
cd ..


cd react-component
./node_modules/.bin/tsc  --module es2020 --outDir ./es
./node_modules/.bin/tsc  --module commonjs --outDir ./lib
cd ..

cd react-context
./node_modules/.bin/tsc  --module es2020 --outDir ./es
./node_modules/.bin/tsc  --module commonjs --outDir ./lib
cd ..

node copy.js
#node sass.js
