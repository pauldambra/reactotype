/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');
var mountTodoNode = document.getElementById('app');
var mountTableNode = document.getElementById('table-container');
var PayTable = require('./payTable');
var data = require('./ui/payData');
var TodoApp = require('./todo');

React.render(<PayTable payYears={data} />, mountTableNode);
React.render(<TodoApp />, mountTodoNode);

