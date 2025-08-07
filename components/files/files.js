$(document).ready(() => {
  $("#add-file").on("click", () => $("#file-input").click());
  $("#file-input").on("change", handleFileSelection);
  $(document).on("click", ".trash-icon", removeFile);
  $(document).on("click", ".eye-icon", downloadFile);
});

const handleFileSelection = (event) => {
  try {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => addFile(e, file);
    reader.readAsArrayBuffer(file);
  } catch (error) {
    console.error("Erro ao adicionar anexo:", error);
    FLUIGC.toast({
      title: "Erro:",
      message: "Ocorreu um erro ao adicionar o anexo. Tente novamente.",
      type: "danger",
      timeout: 5000,
    });
  }
};

const addFile = (e, file) => {
  const blob = new Blob([e.target.result], { type: file.type });
  const reader = new FileReader();

  reader.onloadend = () => {
    const base64Data = reader.result;
    const storageKey = `fileBlob_${file.name}`;

    sessionStorage.setItem(
      storageKey,
      JSON.stringify({ data: base64Data, type: file.type })
    );

    const fileElement = createFileElement(file.name);
    $(".files-container").append(fileElement);
    $(".files-items-border").show();
  };

  reader.readAsDataURL(blob);
};

const createFileElement = (fileName) => {
  return $(`
    <div class="files-card">
      <img class="trash-icon" src="/assets/images/trash.svg" />
      <img class="eye-icon" src="/assets/images/eye.svg" />
      <div class="container-border">
        <div class="container-content">${fileName}</div>
      </div>
    </div>
  `);
};

const removeFile = function () {
  try {
    const fileCard = $(this).closest(".files-card");
    const fileName = fileCard.find(".container-content").text();
    sessionStorage.removeItem(`fileBlob_${fileName}`);
    fileCard.remove();

    if ($(".files-container .files-card").length === 0) {
      $(".files-items-border").hide();
    }
  } catch (error) {
    console.error("Erro ao remover anexo:", error);
    FLUIGC.toast({
      title: "Erro:",
      message: "Ocorreu um erro ao remover o anexo. Tente novamente.",
      type: "danger",
      timeout: 5000,
    });
  }
};

const downloadFile = function () {
  try {
    const fileCard = $(this).closest(".files-card");
    const fileName = fileCard.find(".container-content").text();
    const fileData = JSON.parse(sessionStorage.getItem(`fileBlob_${fileName}`));

    if (fileData?.data) {
      const blob = base64ToBlob(fileData.data, fileData.type);
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.click();
    }
  } catch (error) {
    console.error("Erro ao fazer download do anexo:", error);
    FLUIGC.toast({
      title: "Erro:",
      message: "Ocorreu um erro ao fazer download do anexo. Tente novamente.",
      type: "danger",
      timeout: 5000,
    });
  }
};

const base64ToBlob = (base64, type) => {
  try {
    const binary = atob(base64.split(",")[1]);
    const byteArray = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new Blob([byteArray], { type });
  } catch (error) {
    console.error("Erro ao converter base64 para Blob:", error);
    FLUIGC.toast({
      title: "Erro:",
      message:
        "Ocorreu um erro ao converter base64 para Blob. Tente novamente.",
      type: "danger",
      timeout: 5000,
    });
  }
};
