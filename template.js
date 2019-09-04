module.exports = function generateTemplate(templateStr, options) {
  if (!templateStr) {
    return '';
  }
  return templateStr.replace(/\{(\w+)\}/g, (str, key) => options[key]);
};
