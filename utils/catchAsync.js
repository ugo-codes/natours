module.exports = function (func) {
  return async (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
