( function( global ) {
  "use strict";

  function fulfilledPromise( datum ) {
    return RSVP.Promise.resolve( datum );
  }

  function protoString( obj ) {
    // FIXME: Probably doesn't work in all browsers
    if ( !obj ) return undefined;
    return obj.constructor.name;
  }

  function isDispatch( obj ) {
    return protoString( obj ) === 'Dispatch';
  }

  function swallowEvent( e ) {
    e.preventDefault();
    e.stopPropagation();
  }

  var JKUtils = {
    fulfilledPromise: fulfilledPromise,
    isDispatch: isDispatch
  };

  global.JKUtils = JKUtils;

})( this );
