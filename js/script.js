(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";

var menuItemsUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";

function insertHtml(selector, html) {
  document.querySelector(selector).innerHTML = html;
}

function showLoading(selector) {
  insertHtml(selector,
    "<div class='text-center'>Loading...</div>");
}

function insertProperty(string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  return string.replace(
    new RegExp(propToReplace, "g"),
    propValue
  );
}

// STEP 0: Choose random category
function chooseRandomCategory(categories) {
  var randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
}

// Load Home Page
dc.loadHomePage = function () {
  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    function (categories) {

      var randomCategory =
        chooseRandomCategory(categories);

      var randomCategoryShortName =
        "'" + randomCategory.short_name + "'";

      $ajaxUtils.sendGetRequest(
        homeHtmlUrl,
        function (homeHtml) {

          homeHtml =
            insertProperty(
              homeHtml,
              "randomCategoryShortName",
              randomCategoryShortName);

          insertHtml("#main-content", homeHtml);
        },
        false);
    });
};

// Load Menu Items
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort,
    function (data) {

      var html =
        "<h2>" + data.category.name + "</h2><hr>";

      var items = data.menu_items;

      for (var i = 0; i < items.length; i++) {
        html += "<div><strong>" +
          items[i].name +
          "</strong><br>" +
          items[i].description +
          "</div><br>";
      }

      insertHtml("#main-content", html);
    });
};

// Load Home on page load
document.addEventListener("DOMContentLoaded",
  function () {
    dc.loadHomePage();
  });

global.$dc = dc;

})(window);
