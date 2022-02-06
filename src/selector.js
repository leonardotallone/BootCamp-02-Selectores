// Podemos usar el siguiente formato de comentario para definir
// el comportamiento de la Función.
/**
 * @description: Recorre el árbol del DOM y recolecta elementos que coincidan en un Array (resulSet).
 * @param {function} matcher: La Función generada por `matchFunctionMaker`.
 * @param {object} startElement: Nodo del que parte la búsqueda.
 * @returns {array}: Nodos encontrados.
 */
const traverseDomAndCollectElements = function (
  matcher,
  startElement = document.body
) {
  let resultSet = [];

  if (matcher(startElement)) resultSet.push(startElement);
  for (let i = 0; i < startElement.children.length; i++) {
    const collectedElements = traverseDomAndCollectElements(
      matcher,
      startElement.children[i]
    );
    resultSet = resultSet.concat(collectedElements);
  }
  return resultSet;
};

/**
 * @description: Detecta y devuelve el tipo de selector
 * @param {string} selector: Representa el selector a evaluar.
 * @returns {string}: Devuelve uno de estos tipos: id, class, tag.class, tag
 */
const selectorTypeMatcher = function (selector) {
  if (selector[0] === "#") return "id";
  if (selector[0] === ".") return "class";
  if (selector.includes(".")) return "tag.class";
  if (selector.includes(" > ")) return "direct-child";
  if (selector.includes(" ")) return "child";
  return "tag";
};

/**
 * @description: Genera una Función comparadora en base a un selector dado.
 * @param {string} selector: Representa el selector a evaluar.
 * @returns {function}: Toma un elemento como un parámetro y devuelve `true`/`false` si el elemento coincide, o no, con el selector.
 */
const matchFunctionMaker = function (selector) {
  const selectorType = selectorTypeMatcher(selector);
  let matcher;
  if (selectorType === "id") {
    matcher = function (element) {
      return "#" + element.id === selector;
    };
  } else if (selectorType === "class") {
    matcher = function (element) {
      const classes = element.className.split(" ");
      return classes.includes(selector.slice(1));
    };
  } else if (selectorType === "tag.class") {
    const [tag, className] = selector.split(".");
    const classMatcher = matchFunctionMaker("." + className);
    const tagMatcher = matchFunctionMaker(tag);
    matcher = function (element) {
      return classMatcher(element) && tagMatcher(element);
    };
  } else if (selectorType === "tag") {
    matcher = function (element) {
      return element.tagName === selector.toUpperCase();
    };
  } else if (selectorType === "direct-child") {
    const [parent, child] = selector.split(" > ");
    const parentMatcher = matchFunctionMaker(parent);
    const childMatcher = matchFunctionMaker(child);
    matcher = function (element) {
      return childMatcher(element) && parentMatcher(element.parentNode);
    };
  } else if (selectorType === "child") {
    const [parent, child] = selector.split(" ");
    const parentMatcher = matchFunctionMaker(parent);
    const childMatcher = matchFunctionMaker(child);
    matcher = function (element) {
      if (childMatcher(element)) {
        let currentParent = element.parentNode;
        while (currentParent) {
          if (parentMatcher(currentParent)) return true;
          currentParent = currentParent.parentNode;
        }
        return false;
      }
    };
  }
  return matcher;
};

/**
 * @description: Busca en el DOM tree los nodos que coincidan con el selector dado.
 * @param {string} selector: Representa el selector a evaluar.
 * @returns {array}: Nodos encontrados.
 */
const querySelector = function (selector) {
  const selectorMatchFunc = matchFunctionMaker(selector);
  const elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
