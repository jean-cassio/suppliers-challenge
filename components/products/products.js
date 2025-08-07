$(document).ready(() => {
  $("#add-product").on("click", () => addProduct());

  $(document).on("click", ".trash-icon", (e) => removeProduct(e));
  $(document).on("input", ".products-card #stockQuantity", (e) =>
    handleStockInput(e)
  );
  $(document).on("input", ".products-card #unitPrice", (e) =>
    handleUnitValueInput(e)
  );
});

const handleStockInput = (event) => {
  const input = $(event.target);
  const numericValue = input.val().replace(/[^0-9]/g, "");

  input.val(numericValue);
  updateTotalValue(input.closest(".products-card"));
};

const handleUnitValueInput = (event) => {
  const input = $(event.target);
  let value = input.val().replace(/[^0-9]/g, "");

  while (value.startsWith("0") && value.length > 1) {
    value = value.substring(1);
  }

  if (value.length > 2) {
    const main = value.slice(0, -2);
    const decimal = value.slice(-2);
    value = `${main}.${decimal}`;
  } else if (value.length === 2) {
    value = `0.${value}`;
  } else if (value.length === 1) {
    value = `0.0${value}`;
  }

  input.val(value);
  updateTotalValue(input.closest(".products-card"));
};

const updateTotalValue = (productCard) => {
  const stock = parseInt(productCard.find("#stockQuantity").val() || "0", 10);
  const unitValue = parseFloat(productCard.find("#unitPrice").val() || "0.00");
  const totalValue = stock * unitValue;

  productCard.find("#totalPrice").val(totalValue.toFixed(2));
};

const addProduct = () => {
  try {
    $.get("components/products/card/card.html", (data) => {
      const newProduct = $(data);

      const usedIndices = new Set();
      $(".products-card .container-label").each((_, el) => {
        const label = $(el).text().trim();
        const match = label.match(/Produto\s*-\s*(\d+)/);
        if (match) {
          usedIndices.add(parseInt(match[1], 10));
        }
      });

      let nextIndex = 1;
      while (usedIndices.has(nextIndex)) {
        nextIndex++;
      }

      newProduct.find(".container-label").text("Produto - " + nextIndex);
      $(".products-container").append(newProduct);
    });
  } catch (error) {
    console.error("Erro ao adicionar produto: ", error);
    FLUIGC.toast({
      title: "Erro:",
      message: "Ocorreu um erro ao adicionar o produto. Tente novamente.",
      type: "danger",
      timeout: 5000,
    });
  }
};

const removeProduct = (event) => {
  try {
    const productCard = $(event.target).closest(".products-card");
    productCard.remove();
  } catch (error) {
    console.error("Erro ao remover produto: ", error);
    FLUIGC.toast({
      title: "Erro:",
      message: "Ocorreu um erro ao remover o produto. Tente novamente.",
      type: "danger",
      timeout: 5000,
    });
  }
};
