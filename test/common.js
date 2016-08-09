'use strict';

const chai = require('chai');
const path = require('path');
const fs = require('fs');
const os = require('os');
const Lib = require('../lib');
const shortid = require('shortid');
const StreamHook = require('./streamhook');

module.exports = {
  assert: chai.assert,
  path: path,
  fs: fs,
  os: os,
  Lib: Lib,
  StreamHook: StreamHook,
  shortid: shortid,
};
