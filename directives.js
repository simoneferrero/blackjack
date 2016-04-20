app.directive('welcome', function() {
  return {
    template: `
    <div id="title">
      <h3 ng-bind-html="intro | to_trusted"></h3>
      <h1 ng-bind-html="title | to_trusted"></h1>
      <p ng-bind-html="paragraph | to_trusted"></p>
      <button ng-click="goToApp()">Go to app</button>
    </div>`
  };
});
