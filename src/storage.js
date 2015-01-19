( function( global ) {
  "use strict";

  function identity( a ) { return a; }

  function Storage ( config ) {

    this.nature = 'storage';
    this.o = global.jQuery({});

    this.key = config.key;

    this.preprocessor = config.preprocessor;
    this.postprocessor = config.postprocessor;
  }

  Storage.prototype = new Dispatch();

  Storage.prototype.exchange = function( data ) {

    if ( data ) {
      this.dump( data );
    } else {
      this.load();
    }
  };

  Storage.prototype.dump = function ( data ) {

    var preprocessor = this.preprocessor || identity;
    this.data = preprocessor( data );
    localStorage[ this.key ] = JSON.stringify( this.data );

    return true;
  };

  Storage.prototype.load = function() {

    var
      postprocessor = this.postprocessor || identity,
      rawData = localStorage[ this.key ];

    if ( !rawData ) {
      this.data = {};
    } else {
      this.data = postprocessor( JSON.parse( localStorage[ this.key ] ) );
    }

    this.publish( 'data', this.data );
    return this.data;
  };

  global.Storage = Storage;

})( this );
