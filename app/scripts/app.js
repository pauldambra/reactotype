/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');

var PayTable = require('./payTable');
var data = require('./payData');
var FilterBox = require('./filterBox');

var mountTableNode = document.getElementById('table-container');
var mountFilterNode = document.getElementById('filter-container');

React.render(<PayTable payYears={data} />, mountTableNode);
React.render(<FilterBox initialEarliest={1997} initialLatest={2014}/>, mountFilterNode);

