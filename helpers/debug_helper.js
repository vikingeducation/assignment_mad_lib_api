const DebugHelper = {};

DebugHelper.debug = arg => {
  return `<pre>${JSON.stringify(arg, null, 2)}</pre>`;
};

module.exports = DebugHelper;

