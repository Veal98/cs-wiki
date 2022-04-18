/*
  @license
	Rollup.js v2.70.2
	Fri, 15 Apr 2022 05:14:21 GMT - commit 030c56fd6b186a0ddfd57d143ad703f34fd2c17a

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
'use strict';

require('fs');
require('path');
require('process');
require('url');
const loadConfigFile_js = require('./shared/loadConfigFile.js');
require('./shared/rollup.js');
require('./shared/mergeOptions.js');
require('tty');
require('perf_hooks');
require('crypto');
require('events');



module.exports = loadConfigFile_js.loadAndParseConfigFile;
//# sourceMappingURL=loadConfigFile.js.map
