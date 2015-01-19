( function( global ) {
  "use strict";

  function Router() {

    var thisRouter = this;

    this.nature = 'router';
    this.o = global.jQuery({});

    this.config = {
      prefix: ''
    };

    this.config.historySupport = !!( global.history && global.history.pushState );

    // Attach URL change listener
    var eventName = this.config.historySupport ? 'onpopstate' : 'onhashchange';
    window[ eventName ] = this.checkURL.bind( this );

    this.path = this.getPath();
    this.parameters = this.getParameters();
  }


  Router.prototype = new Dispatch();


  Router.prototype.getPath = function() {

    return window.location.pathname.slice( this.config.prefix.length );
  };


  Router.prototype.getParameters = function() {

    var
      params = {},
      paramTuple;

    window.location.search.slice( 1 ).split( '&' ).forEach( function( paramTupleString ) {

      paramTuple = paramTupleString.split( '=' );
      if ( !paramTuple[ 0 ] ) return;
      params[ paramTuple[ 0 ] ] = decodeURIComponent( paramTuple[ 1 ].replace( /\+/g, ' ' ) );
    });

    return params;
  };


  Router.prototype.setURL = function( path, parameters ) {

    path = this.config.prefix + path + serializeParameters( parameters );

    if ( this.config.historySupport ) {
      window.history.pushState( {}, null, path );
    } else {
      window.location.hash = path;
    }

  };


  Router.prototype.checkURL = function() {

    this.path = this.getPath();
    this.parameters = this.getParameters();

    this.announce( 'navigation', {
      path: this.path,
      parameters: this.parameters
    });

    this.announce( 'navigation:' + this.path, this.parameters );
  };


  Router.prototype.navigate = function( path, parameters ) {

    if ( path ) this.path = path;
    if ( this.path.slice( 0, 1 ) !== '/' ) this.path = '/' + this.path;
    if ( parameters !== undefined ) this.parameters = parameters;

    this.setURL( this.path, this.parameters );
    this.checkURL();
  };


  Router.prototype.kickoff = function () {
    this.navigate( this.getPath(), this.getParameters() );
  };


  function serializeParameters( parameters ) {

    if ( !parameters ) return '';

    var parameterTuples = [ ], tuple, s;
    for ( var key in parameters ) {
      tuple = encodeURIComponent( key ) + '=' + encodeURIComponent( parameters[ key ] );
      parameterTuples.push( tuple );
    }

    s = parameterTuples.join( '&' );
    if ( s ) {
      return '?' + s;
    } else {
      return '';
    }

  }

  global.Router = Router;

})( this );
