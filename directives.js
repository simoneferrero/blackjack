app.directive('welcome', function() {
  return {
    template: `<h1>{{ title }}</h1>
      <p ng-bind-html="paragraph | to_trusted"></p>
      <button ng-click="goToApp()">Go to app</button>`
  };
});
