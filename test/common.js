'use strict';

const chai = require('chai');
const path = require('path');
const fs = require('fs');
const os = require('os');
const Lib = require('../lib');

module.exports = {
  assert: chai.assert,
  path: path,
  fs: fs,
  os: os,
  Lib: Lib,
};
