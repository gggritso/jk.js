( function( global ) {
  "use strict";

  function isObject ( maybeAnObject ) {
    return maybeAnObject === Object( maybeAnObject );
  }

  function Snitch ( attributes ) {

    this.nature = 'snitch';
    this.o = global.jQuery({});

    this.set( attributes );
  }

  Snitch.prototype = new Dispatch();

  Snitch.prototype.set = function ( attribute, datum, silence ) {

    this._data || ( this._data = {} );

    var attributes;
    if ( isObject( attribute ) && !datum ) {
      attributes = attribute;
    } else {
      attributes = {};
      attributes[ attribute ] = datum;
    }

    for ( var key in attributes ) {
      if ( attributes.hasOwnProperty( key ) && attributes[ key ] ) {
        this._data[ key ] = attributes[ key ];
        if ( !silence ) this.announce( 'change' + ':' + key, attributes[ key ] );
      }
    }

    return this;
  };

  Snitch.prototype.get = function ( attribute  ) {

    if ( !attribute ) return this._data;
    return this._data[ attribute ];
  };

  Snitch.prototype.slice = function ( params ) {

    var ret = {}, thisSnitch = this;
    params.forEach( function( param ) {
      ret[ param ] = thisSnitch.get( param );
    });

    return new Snitch( ret );
  };

  global.Snitch = Snitch;

})( this );
