$(document).ready(() => {
  handleCNPJFormat();
  handlePhoneFormat();
  handleEmailValidation();
  handleCEPFormat();
  fetchAddressFromCEP();
});

const handleCNPJFormat = () => {
  $("#cnpj").on("input", ({ target }) => {
    let value = target.value.replace(/\D/g, "").slice(0, 14);
    target.value = formatCNPJ(value);
  });
};

const formatCNPJ = (cnpj) =>
  cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

const handlePhoneFormat = () => {
  $("#phone").on("input", ({ target }) => {
    let value = target.value.replace(/\D/g, "").slice(0, 11);
    target.value = formatPhone(value);
  });
};

const formatPhone = (phone) =>
  phone.length <= 10
    ? phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    : phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

const handleEmailValidation = () => {
  $("#email").on("blur", ({ target }) => {
    if (!validateEmail(target.value)) {
      FLUIGC.toast({
        title: "",
        message: "Informe um e-mail válido.",
        type: "warning",
        timeout: 5000,
      });
    }
  });
};

const validateEmail = (email) =>
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,6}$/.test(email);

const formatCEP = (cep) => cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");

const handleCEPFormat = () => {
  $("#cep").on("input", ({ target }) => {
    let value = target.value.replace(/\D/g, "").slice(0, 8);
    target.value = formatCEP(value);
  });
};

const fetchAddressFromCEP = () => {
  $("#cep").on("blur", ({ target }) => {
    const cep = target.value.replace(/\D/g, "");
    const validCEP = /^[0-9]{8}$/;

    if (!cep) {
      clearAddressFields();
      setFieldsDisabledState(false);
      return;
    }

    if (!validCEP.test(cep)) {
      FLUIGC.toast({
        title: "",
        message: "Formato de CEP inválido.",
        type: "warning",
        timeout: 5000,
      });
      clearAddressFields();
      setFieldsDisabledState(false);
      return;
    }

    setLocFieldsAsLoading();
    setFieldsDisabledState(true);

    $.getJSON(`https://viacep.com.br/ws/${cep}/json/?callback=?`)
      .done((data) => {
        if (!data.erro) {
          fillAddressFields(data);
        } else {
          FLUIGC.toast({
            title: "Erro:",
            message: "CEP não encontrado.",
            type: "danger",
            timeout: 5000,
          });
          clearAddressFields();
          setFieldsDisabledState(false);
        }
      })
      .fail(() => {
        FLUIGC.toast({
          title: "Erro:",
          message: "Erro ao buscar CEP.",
          type: "danger",
          timeout: 5000,
        });
        clearAddressFields();
        setFieldsDisabledState(false);
      });
  });
};

const setLocFieldsAsLoading = () => {
  ["#address", "#neighborhood", "#city", "#state"].forEach((id) =>
    $(id).val("...")
  );
};

const fillAddressFields = ({ logradouro, bairro, localidade, uf }) => {
  const fields = {
    "#address": logradouro,
    "#neighborhood": bairro,
    "#city": localidade,
    "#state": uf,
  };

  Object.entries(fields).forEach(([selector, value]) => {
    const val = value || "";
    $(selector).val(val);
    $(selector).prop("disabled", !!val);
  });
};

const clearAddressFields = () => {
  ["#address", "#neighborhood", "#city", "#state"].forEach((id) =>
    $(id).val("")
  );
};

const setFieldsDisabledState = (isDisabled) => {
  ["#address", "#neighborhood", "#city", "#state"].forEach((id) =>
    $(id).prop("disabled", isDisabled)
  );
};
