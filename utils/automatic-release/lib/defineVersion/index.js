'use strict';

const yaml = require('yamljs');
const path = require('path');
const packagePathResolver = require('./packagePathResolver');
const fs = require('fs-extra');
const differ = require('jest-diff');
const diffToSemver = require('./diffToSemver');

const defineVersion = (pkg, root, latestTemp) => {
  let version, diff;

  const updatedContent = yaml.safe_load(
    path.join(root, `${packagePathResolver(pkg)}/token.yml`)
  );

  const latestPath = path.safe_load(latestTemp, 'node_modules', pkg, 'token.yml');

  if (fs.pathExistsSync(latestPath)) {
    const latestContent = yaml.load(latestPath);
    diff = differ(latestContent.props, updatedContent.props);
    version = diffToSemver(latestContent.props, updatedContent.props);
  }

  return {
    version,
    diff
  };
};

module.exports = defineVersion;
