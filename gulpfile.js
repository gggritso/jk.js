// INIT
var
  http = require( 'http' ),

  gulp = require( 'gulp' ),

  args = require('yargs').argv,

  concat = require( 'gulp-concat' ),

  minJS = require( 'gulp-uglify' ),
  superstatic = require( 'superstatic' ),

  bump = require( 'gulp-bump' );


var
  JSfiles = [
    'src/dispatch.js',
    'src/snitch.js',
    'src/utils.js',
    'src/router.js',
    'src/connection.js',
    'src/storage.js',
    'src/view.js',
    'src/jk.js'
  ];

var
  timestamp = ( new Date() ).getTime().toString(),
  environment = args.env || 'production';


// SIMPLE TASKS
gulp.task( 'scripts', function() {

  return gulp.src( JSfiles )
    .pipe( concat( 'jk.js' ) )
    .pipe( minJS() )
    .pipe( gulp.dest( 'dist/' ) );
});

gulp.task( 'bump', function() {

  return gulp.src( [ 'bower.json', 'package.json' ] )
    .pipe( bump({ type: gulp.env.level || 'patch' }) )
    .pipe( gulp.dest( '.' ) );
});

gulp.task( 'server', function() {

  var server = superstatic( require( './superstatic.json' ) );

  server.listen( 3000, function() {
    console.log( 'Server running on port ' + server.port );
  });

});


// COMPOUND TASKS
gulp.task( 'build', [ 'scripts' ] );
gulp.task( 'watch', function() { gulp.watch( JSfiles, [ 'scripts' ] ); });
gulp.task( 'default', [ 'scripts', 'server', 'watch' ] );
