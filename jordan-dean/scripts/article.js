'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEWED: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// COMMENTED: Why isn't this method written as an arrow function?
// It uses contextual 'this', which doesn't work as intended within an => function.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENTED: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // This is a ternary statement. The ? means that the statement ahead of it is an if statement, and what follows it is what is done if the if statement returns true. What is after the colon represents what happens the if statement is not true.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEWED: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEWED: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// This is called in Article.fetchAll. Raw data represents the article data stored in hackerIpsum, which may or may not be pulled from local storage if it exists there at the time. This is a new approach, as the articles may not be directly loaded every time the page is visited.
Article.loadAll = rawData => {
  rawData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  rawData.forEach(articleObject => Article.all.push(new Article(articleObject)))
  articleView.initIndexPage();
}

// REVIEWED: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEWED: What is this 'if' statement checking for? Where was the rawData set to local storage?
  // the if statement is checking if anything at all is stored in local storage, which is set by the 'else'.
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.rawData));

  } else {
    $.getJSON('data/hackerIpsum.json').then(function (data){
      localStorage.rawData = JSON.stringify(data);
      Article.loadAll(data);
    })
  }
}
  //For the else first we had to retrieve the information we were using, then we had to make sure that it was stringified so we could use that data with localstorage, and once it was stringified and in local storage we populated the articles with the unstringified data.
