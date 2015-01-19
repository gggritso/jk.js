( function( global ) {
  "use strict";

  RSVP.on( 'error', function( error ) {
    console.error( error.stack );
  });

  function JK ( config ) {

    config || ( config = {} );

    this.config = config;

    this.global = {};
    this.state = {};

    this.views = {};
    this.connections = {};
    this.storages = {};
    this.data = {};

    this.utils = JKUtils;
    JKUtils = undefined;

    this.router = new Router();
  }

  JK.prototype = new Dispatch();

  var viewPromiseResolvers = {};
  JK.prototype.getView = function( viewName ) {

    var thisJK = this;
    return new RSVP.Promise( function( resolve, reject ) {

      if ( thisJK.views[ viewName ] ) {
        // The view is available, so just resolve
        resolve( thisJK.views[ viewName ] );
        return;
      } else {
        // The view is not available! Save the resolver function for later
        viewPromiseResolvers[ viewName ] = resolve;
      }

    });

  };

  JK.prototype.form = function( element ) {

    var
      $form = ( element.jquery ) ? element : $( element ),
      data = {};

    $form.find( 'input, textarea' ).each( function( index, element ) {

      if ( element.type == 'radio' && element.checked ) {
        data[ element.name ] = element.value;
      } else if ( element.type == 'checkbox' && element.checked ) {
        data[ element.name ] = true;
      } else if ( element.type == 'checkbox' && !element.checked ) {
        data[ element.name ] = false;
      } else if ( [ 'radio', 'checkbox' ].indexOf( element.type ) === -1 ) {
        data[ element.name ] = element.value;
      }

    });

    return data;
  };


  var jk = global.jk = new JK();

  global.jk.on( 'view:init', function( event, view ) {

    if ( !jk.views[ view.name ] ) {
      jk.views[ view.name ] = view;
      // Did someone request this view earlier? If so, find the resolver function they need,
      // and resolve it now.
      viewPromiseResolvers[ view.name ] && viewPromiseResolvers[ view.name ]( view );
    }

  });


})( this );
