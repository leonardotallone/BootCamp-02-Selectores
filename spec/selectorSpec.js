describe("selectorTypeMatcher", function () {
  it("debe retornar el tipo 'id' para un selector de id", function () {
    var type = selectorTypeMatcher("#pagetitle");
    expect(type).toEqual("id");
  });

  it("debe retornar el tipo 'class' para un selector de clase", function () {
    var type = selectorTypeMatcher(".image");
    expect(type).toEqual("class");
  });

  it("debe retornar el tipo 'tag.class' para un selector de tag.class", function () {
    var type = selectorTypeMatcher("img.thumbnail");
    expect(type).toEqual("tag.class");
  });

  it("debe retornar el tipo 'tag' para un selector de tag", function () {
    var type = selectorTypeMatcher("div");
    expect(type).toEqual("tag");
  });
});

describe("matchFunctionMaker", function () {
  it("cuando el selector sea un ID, debe retornar una Función que devuelva TRUE si el elemento coincide con el ID", function () {
    var selector = "#price";
    var matcher = matchFunctionMaker(selector);
    var sampleDivElement = document.createElement("DIV"); // creamos un elemento en memoria
    sampleDivElement.id = "price"; // y le damos el id "price"
    expect(matcher(sampleDivElement)).toEqual(true);
  });

  it("cuando el selector sea un ID, debe retornar una Función que devuelva FALSE si el elemento no coincide con el ID", function () {
    var selector = "#price";
    var matcher = matchFunctionMaker(selector);
    var sampleDivElement = document.createElement("DIV"); // creamos un elemento en memoria
    sampleDivElement.id = "logo"; // y le damos el id "logo"
    expect(matcher(sampleDivElement)).toEqual(false);
  });

  it("cuando el selector sea un CLASS, debe retornar una Función que devuelva TRUE si el elemento coincide con la propiedad `className`", function () {
    var selector = ".heading";
    var matcher = matchFunctionMaker(selector);
    var sampleDivEl = document.createElement("DIV");
    sampleDivEl.className = "heading";
    expect(matcher(sampleDivEl)).toEqual(true);
  });

  it("cuando el selector sea un CLASS, debe retornar una Función que devuelva TRUE si el elemento coicide con la propiedad `className`. No influye si hay múltiples clases en ese elemento", function () {
    var selector = ".heading";
    var matcher = matchFunctionMaker(selector);
    var sampleEl = document.createElement("H1");
    sampleEl.className = "lead heading lightback"; // el elemento tiene tres clases distintas
    expect(matcher(sampleEl)).toEqual(true);
  });

  it("cuando el selector sea un CLASS, debe retornar una Función que devuelva FALSE si el elemento no coincide con la propiedad `className`", function () {
    var selector = ".photo";
    var matcher = matchFunctionMaker(selector);
    var sampleEl = document.createElement("H1");
    sampleEl.className = "photos lightback abstract"; // el elemento tiene tres clases distintas
    expect(matcher(sampleEl)).toEqual(false);
  });

  it("cuando el selector sea un TAG, debe devolver una Función que devuelva TRUE cuando el elemento coincida con el `tagName`", function () {
    var selector = "div";
    var matcher = matchFunctionMaker(selector);
    var sampleDivEl = document.createElement("div");
    expect(matcher(sampleDivEl)).toEqual(true);
  });

  it("cuando el selector sea un TAG.CLASS, debe devolver una Función que devuelva TRUE cuando el elemento coincida con el `tagName` y el `className`", function () {
    var selector = "img.thumbnail";
    var matcher = matchFunctionMaker(selector);
    var sampleDivEl = document.createElement("img");
    sampleDivEl.className = "thumbnail lead lightback"; // el elemento tiene tres clases distintas
    expect(matcher(sampleDivEl)).toEqual(true);
  });

  it("cuando el selector sea un TAG.CLASS, debe devolver una Función que devuelva FALSE si el elemento no coincide con el `tagName`", function () {
    var selector = "img.photo";
    var matcher = matchFunctionMaker(selector);
    var sampleEl = document.createElement("div");
    sampleEl.className = "photos lightback abstract"; // el elemento tiene tres clases distintas
    expect(matcher(sampleEl)).toEqual(false);
  });

  it("cuando el selector sea un TAG.CLASS, debe devolver una Función que devuelva FALSE si el elemento no coincide con el `className`", function () {
    var selector = "img.photo";
    var matcher = matchFunctionMaker(selector);
    var sampleEl = document.createElement("img");
    sampleEl.className = "photos lightback abstract"; // el elemento tiene tres clases distintas
    expect(matcher(sampleEl)).toEqual(false);
  });
});

describe("funcion querySelector ", function () {
  var elements;

  it("debe seleccionar un elemento por tag name (el root en este caso)", function () {
    elements = querySelector("body");
    expect(elements[0].tagName.toLowerCase()).toEqual("body");
  });

  it("debe seleccionar un id", function () {
    elements = querySelector("#pagetitle");
    expect(elements.length).toEqual(1);
  });

  it("debe seleccionar el elemento correcto por id", function () {
    elements = querySelector("#pagetitle");
    expect(elements[0].innerHTML).toEqual("My Photos");
  });

  it("debe seleccionar tag names", function () {
    elements = querySelector("h2");
    expect(elements.length).toEqual(3);
  });

  it("debe seleccionar por clase", function () {
    elements = querySelector(".photo");
    expect(elements.length).toEqual(4);
  });

  it("debe seleccionar por clase incluyendo elementos con múltiples clases", function () {
    elements = querySelector(".lead");
    expect(elements.length).toEqual(3);
  });

  it("debe seleccionar por `tagName` y `className`", function () {
    elements = querySelector("h2.small");
    expect(elements.length).toEqual(2);
  });
});

describe("Credito Extra", function () {
  describe("Selector de Jerarquía", function () {
    it("debe seleccionar los elementos correctos cuando el selector incluya un `child combinator` (>)", function () {
      elements = querySelector("div > img");
      expect(elements.length).toEqual(7);

      elements = querySelector("body > img");
      expect(elements.length).toEqual(0);
    });

    it("debe seleccionar los elementos correctos cuando el selector incluya un `descendant combinator` (espacio en blanco)", function () {
      elements = querySelector("body p");
      expect(elements.length).toEqual(2);

      elements = querySelector("body img");
      expect(elements.length).toEqual(7);
    });
  });
});
