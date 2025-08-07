document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeComponents();
    setupSaveHandler();
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

const setupSaveHandler = () => {
  $("form").on("submit", (e) => {
    e.preventDefault();

    try {
      if (validateRequiredFields()) {
        processFormData();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      FLUIGC.toast({
        title: "Erro:",
        message:
          "Erro ao salvar os dados. Verifique os campos e tente novamente.",
        type: "danger",
        timeout: 5000,
      });
    }
  });
};

const validateRequiredFields = () => {
  const requiredFields = [
    { id: "#businessName", label: "Razão Social" },
    { id: "#cnpj", label: "CNPJ" },
    { id: "#tradeName", label: "Nome Fantasia" },
    { id: "#cep", label: "CEP" },
    { id: "#address", label: "Endereço" },
    { id: "#addressNumber", label: "Número" },
    { id: "#addressComplement", label: "Complemento" },
    { id: "#neighborhood", label: "Bairro" },
    { id: "#city", label: "Municipio" },
    { id: "#state", label: "Estado" },
    { id: "#contactName", label: "Nome da Pessoa de Contato" },
    { id: "#phone", label: "Telefone" },
    { id: "#email", label: "E-mail" },
  ];

  for (const { id, label } of requiredFields) {
    const value = $(id).val()?.trim();
    if (!value) {
      FLUIGC.toast({
        title: "",
        message: `${label} é obrigatório!`,
        type: "warning",
        timeout: 5000,
      });
      return false;
    }
  }

  return true;
};

const processFormData = () => {
  try {
    const productsCards = $(".products-card");
    const filesCards = $(".files-card");

    if (!productsCards.length) {
      FLUIGC.toast({
        title: "",
        message: "É necessário adicionar pelo menos um produto.",
        type: "warning",
        timeout: 5000,
      });
      return;
    }

    if (!filesCards.length) {
      FLUIGC.toast({
        title: "",
        message: "É necessário adicionar pelo menos um anexo.",
        type: "warning",
        timeout: 5000,
      });
      return;
    }

    openLoadingModal();

    const supplierData = collectSupplierData(productsCards, filesCards);

    showSuccessModal();
    downloadJSON(supplierData);
  } catch (error) {
    console.error("Erro no processamento:", error);
    FLUIGC.toast({
      title: "Erro:",
      message:
        "Erro ao processar os dados. Por favor, verifique os campos e tente novamente.",
      type: "danger",
      timeout: 5000,
    });
  }
};

const collectSupplierData = (productsCards, filesCards) => {
  const supplier = {
    razaoSocial: $("#businessName").val(),
    nomeFantasia: $("#tradeName").val(),
    cnpj: $("#cnpj").val(),
    inscricaoEstadual: $("#stateRegistration").val(),
    endereco: $("#address").val(),
    bairro: $("#neighborhood").val(),
    cep: $("#zipCode").val(),
    inscricaoMunicipal: $("#municipalRegistration").val(),
    numero: $("#number").val(),
    complemento: $("#complement").val(),
    municipio: $("#city").val(),
    estado: $("#state").val(),
    nomePessoaContato: $("#contactName").val(),
    telefone: $("#phone").val(),
    email: $("#email").val(),
    produtos: [],
    anexos: [],
  };

  productsCards.each((index, element) => {
    supplier.produtos.push({
      indice: index + 1,
      descricaoProduto: $(element).find("#description").val(),
      unidadeMedida: $(element).find("#unit").val(),
      qtdeEstoque: $(element).find("#stockQuantity").val(),
      valorUnitario: $(element).find("#unitPrice").val(),
      valorTotal: $(element).find("#totalPrice").val(),
    });
  });

  filesCards.each((index, element) => {
    const fileName = $(element).find(".container-content").text();
    const fileData = JSON.parse(sessionStorage.getItem("fileBlob_" + fileName));

    supplier.anexos.push({
      indice: index + 1,
      nomeArquivo: fileName,
      blobArquivo: fileData.data,
    });
  });

  return supplier;
};

const downloadJSON = (data) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "supplierData.json";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const loadComponent = (selector, htmlPath, jsPath) => {
  $(selector).load(htmlPath, () => $.getScript(jsPath));
};

const openLoadingModal = () => {
  FLUIGC.modal({
    title: "Salvando Informações",
    content: '<div style="text-align:center;"><h3>Salvando...</h3></div>',
    id: "loading-modal",
    size: "small",
  });
};

const showSuccessModal = () => {
  $("#loading-modal .modal-body").html(
    '<div style="text-align:center;"><h3>Salvo com Sucesso!</h3></div>'
  );
};
