# Toolkit For Psychology of Artist's Song Writing

This repository provides tools built around [Genius Lyrics](https://genius.com/) and [Watson Personality Insights](https://www.ibm.com/watson/services/personality-insights/) to create a template for analyzing the changes of an artist's song writing over the duration of their careers.

You can see examples of the product of these tools here:

- [Mac Miller Lyrics Psychology](https://mcconville.github.io/macmiller)

 - [Beatles Lyrics Psychology](https://mcconville.github.io/beatles)

 The repo has two Node JS Scripts:

 - lyricsfinder.js
 - paperbackwriter.js

**lyricsfinder** will read a json data file containing album and song titles for an artist, and will build a text file of lyrics for each album.

**paperbackwriter** will use the same json data structure AND the generated lyrics files to run Watson Personality Insights on the lyrics, inserting the output of Watson PI to the datastructure.

In addition, the repo has a set of webcomponents that are capable of reading the complete json data file and presenting the data in a human readable way.


### Practical Web Components

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) are an open standard approach for modularizing and reusing user interface pieces on a page. 

In the past, web pages have been written with javascript, html and css code that divide related pieces in javascript, html or css files that are effecively long lists of DOM elements, style and function.

 Web Components aim to collect related javascript, style and DOM elements for a related element, and then allow the components to be placed, as custom DOM elements in a building block approach.




