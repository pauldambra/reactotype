/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');
var PayTable = require('./payTable');
var data = require('./ui/payData');
var TodoApp = require('./todo');
var FilterBox = require('./filterBox');

var mountTodoNode = document.getElementById('app');
var mountTableNode = document.getElementById('table-container');
var mountFilterNode = document.getElementById('filter-container');

React.render(<PayTable payYears={data} />, mountTableNode);
React.render(<TodoApp />, mountTodoNode);
React.render(<FilterBox initialEarliest={1977} initialLatest={2010}/>, mountFilterNode);

