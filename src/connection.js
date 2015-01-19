( function( global ) {
  "use strict";

  function identity( a ) { return a; }

  function Connection ( config ) {

    this.nature = 'connection';
    this.o = global.jQuery({});

    this.ajaxParameters = {
      type: config.type,
      url: config.url,
      data: config.data
    };

    for ( var paramName in config.ajaxParameters ) {
      this.ajaxParameters[ paramName ] = config.ajaxParameters[ paramName ];
    }

    this.preprocessor = config.preprocessor;
    this.postprocessor = config.postprocessor;
  }

  Connection.prototype = new Dispatch();

  Connection.prototype.exchange = function ( data ) {

    var
      thisConnection = this,
      promise;

    for ( var paramName in data ) {
      this.ajaxParameters.data[ paramName ] = data[ paramName ];
    }

    promise = AJAXWithProcessing( this.ajaxParameters, this.preprocessor, this.postprocessor );

    promise.then( function( data ) {
      thisConnection.data = data;
      thisConnection.resolved = true;
      thisConnection.emit( data );
    }, function( xhr, error, status ) {
      console.error( xhr, error, status );
      thisConnection.announce( 'error', { xhr: xhr, error: error, status: status });
    });

  };

  Connection.prototype.emit = function( data ) {
    if ( !data ) data = this.data;
    this.announce( 'data', data );
  };

  function AJAXWithProcessing ( config, preprocessor, postprocessor ) {

    preprocessor || ( preprocessor = identity );
    postprocessor || ( postprocessor = identity );

    return new RSVP.Promise( function( resolve, reject ) {

      config.data = preprocessor( config.data );

      $.ajax( config ).then( function( data ) {
        resolve( postprocessor( data ) );
      }, function( xhr, error, message ) {
        reject( xhr, error, message );
      });

    });

  }


  global.Connection = Connection;

})( this );
