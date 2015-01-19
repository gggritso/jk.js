# jk.js

A really strange back-to-basics pub/sub UI framework.

```javascript
$( function() {

  var template = function( data ) {
    return '<h2>Hi, ' + data.name + '</h2>';
  };

  jk.views.home = new View({
    template: template,
    target: '#target'
  });

  jk.router.on( 'navigation', function( event, path ) {

    if ( path.path === '/' ) {
      jk.views.home.render({ name: 'George'});
    }

  });

  jk.router.kickoff();

});
```
