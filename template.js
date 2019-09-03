module.exports = function template(templateStr, options) {
  if (!templateStr) {
    return '';
  }
  return templateStr.replace(/\{([\w.]+)\}/g, (str, key) => options[key]);
};
