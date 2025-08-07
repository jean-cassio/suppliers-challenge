document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeComponents();
  } catch (error) {
    console.error("Erro na inicialização:", error);
    FLUIGC.toast({
      title: "Erro:",
      message: "Ocorreu um erro. Por favor, tente novamente mais tarde.",
      type: "danger",
      timeout: 5000,
    });
  }
});

const initializeComponents = () => {
  const components = [
    {
      selector: "#supplier-section",
      html: "/components/supplier/supplier.html",
      js: "/components/supplier/supplier.js",
    },
    {
      selector: "#products-section",
      html: "/components/products/products.html",
      js: "/components/products/products.js",
    },
    {
      selector: "#files-section",
      html: "/components/files/files.html",
      js: "/components/files/files.js",
    },
  ];

  components.forEach(({ selector, html, js }) =>
    loadComponent(selector, html, js)
  );
};

const loadComponent = (selector, htmlPath, jsPath) => {
  $(selector).load(htmlPath, () => $.getScript(jsPath));
};
