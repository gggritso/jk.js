( function( global ) {
  "use strict";

  function blank () { return ''; }
  function noop() { return; }

  function View( config ) {

    var thisView = this;

    this.nature = 'view';
    this.o = global.jQuery({});

    this.template = config.template;
    this.target = config.target;
    this.inflate = config.inflate;

    this.name = config.name; // this is optional, helpful for debugging
    this.dummy = config.dummy;

    this.state = {};
    this.settings = new Snitch();

    this.announcer = function() {
      thisView.announce( $( this ).attr( 'publish' ), $( this ).data() );
    };

    jk.announce( 'view:init', thisView );
  }

  View.prototype = new Dispatch();


  View.prototype.render = function( data ) {

    this.data = data;
    this.$target = $( this.target );

    if ( this.$target.length === 0  ) {
      console.error( 'No element matching target selector!' );
      return;
    } else if ( this.$target.length > 1 ) {
      console.warn( 'More than one element matching target selector!' );
    }

    if ( this.inflated ) {
      // This view's already been rendered, remove publish handlers
      // set on the target by other views
      this.$target.off( 'click' );
    }

    this.$target.html( this.template( data ) );
    this.$target.on( 'click', '[publish]', this.announcer );

    this.inflate && this.inflate();
    this.inflated = true;
  };


  View.prototype.rerender = function() {

    this.render( this.data );
  };


  View.prototype.hide = function() {
    this.$target.hide();
  };


  View.prototype.show = function() {
    this.$target.show();
  };


  global.View = View;

})( this );
