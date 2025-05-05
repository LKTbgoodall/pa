document.querySelectorAll(".clickable-option").forEach((option) => {
  option.addEventListener("click", () => {
    option.classList.toggle("selected");
    if (option.classList.contains("selected")) {
      if (option.getAttribute("data-id").startsWith("matricule")) {
        localStorage.setItem(
          "selectedMatricule",
          option.getAttribute("data-id")
        );
      }
    } else {
      if (option.getAttribute("data-id").startsWith("matricule")) {
        localStorage.removeItem("selectedMatricule");
      }
    }
    generateResponse();
  });
});

window.addEventListener("load", () => {
  const selectedMatriculeId = localStorage.getItem("selectedMatricule");
  if (selectedMatriculeId) {
    const selectedOption = document.querySelector(
      `.clickable-option[data-id="${selectedMatriculeId}"]`
    );
    if (selectedOption) {
      selectedOption.classList.add("selected");
    }
  }
  generateResponse();
});

function generateResponse() {
  const resultDiv = document.getElementById("result");
  const discordInput = document.getElementById("discord").value.trim();
  let discordFormate = "";

  if (discordInput) {
    if (/^\d+$/.test(discordInput)) {
      discordFormate = `<@${discordInput}>`;
    } else {
      discordFormate = `@${discordInput}`;
    }
  } else {
    discordFormate = "@";
  }

  const selectedMatricule = Array.from(
    document.querySelectorAll(
      ".clickable-option.selected[data-id^='matricule']"
    )
  ).map((option) => {
  const matricules = {
    matricule497: ":DivisionSAPA: **Gestionnaire PA - 497 | Flora Sancho**",
    matricule323: ":DivisionSAPA: **Gestionnaire PA - 323 | Helena Parks**",
    matricule003: ":DivisionSAPA: **Gestionnaire PA - 003 | Yahya Gonzalez**",
    matricule315: ":DivisionSAPA: **Gestionnaire PA - 315 | Alba Martell**",
    matricule054: ":DivisionSAPA: **Gestionnaire PA - 054 | Scott Ella**",
    matricule029: ":DivisionSAPA: **Gestionnaire PA - 029 | Lindsay Frost**",
    matricule372: ":DivisionSAPA: **Gestionnaire PA - 372 | Winston Campbell**",
    matricule142: ":DivisionSAPA: **Directeur-Adjoint - 142 | Damon Blake**",
    matricule063: ":DivisionSAPA: **Directeur - 063 | Jacob Bernard**",
  };
    return matricules[option.getAttribute("data-id")];
  })[0];

  const signature = selectedMatricule ||
    ":DivisionSAPA: **Directeur-Adjoint - 170 | Dorian Rossini**";

  const motifs = {
    personnelles: "Manque de développement pour les questions personnelles",
    generales: "Manque de connaissance du manuel",
    misesEnSituation: "Mauvaise réflexion pour les mises en situation",
    autre: document.getElementById("autreText").value.trim()
  };

  const selectedOptions = Array.from(
    document.querySelectorAll(
      ".clickable-option.selected:not([data-id^='matricule'])"
    )
  ).map((option) => option.getAttribute("data-id"));

  const motifsRefus = selectedOptions
    .map((option) => motifs[option])
    .filter((option) => option !== "");

  const autreTextGroup = document.getElementById("autreTextGroup");
  autreTextGroup.style.display = selectedOptions.includes("autre") 
    ? "block" 
    : "none";

  let previewMessage;
  if (motifsRefus.length > 0) {
    previewMessage = `Réponse Entretien
Candidat : ${discordFormate}
Résultat : Non Validé
Commentaire : ${motifsRefus.join(" | ")}
Bien à vous,
${signature.replace(/\*\*/g, "")}`;
  } else {
    previewMessage = `Réponse Entretien
Candidat : ${discordFormate}
Résultat : Validé
Commentaire : Félicitations ! Vous serez identifié dans le salon ⁠🎓・𝐴𝑛𝑛𝑜𝑛𝑐𝑒-𝑆𝑒𝑠𝑠𝑖𝑜𝑛 pour vous convier à la dernière étape.
Bien à vous,
${signature.replace(/\*\*/g, "")}`;
  }

  let copyMessage;
  if (motifsRefus.length > 0) {
    copyMessage = `**Réponse Entretien**
Candidat : ${discordFormate}
Résultat : **<:refused:1350470605278941317> [Non Validé](https://cdn.discordapp.com/attachments/986100247681957909/1356295087960756548/refu.gif?ex=67ec0bbb&is=67eaba3b&hm=fd2f9bae9a066717d8f7bfe4be3cbafb83bbcb69bd2a3fea5a61c1279e00d4a3&) <:refused:1350470605278941317>**
Commentaire :** ||${motifsRefus.join(" | ")}|| **
Bien à vous,
${signature}`;
  } else {
    copyMessage = `**Réponse Entretien**
Candidat : ${discordFormate}
Résultat : **<:valid:1350470603454283867> [Validé](https://cdn.discordapp.com/attachments/986100247681957909/1356295292558770367/accete.gif?ex=67ec0bec&is=67eaba6c&hm=f0957c332ef5ed87a0ac72d54c91e3548aebc0b30409372297e51e01d3b36c2e&) <:valid:1350470603454283867>**
Commentaire :** Félicitations ! Vous serez identifié dans le salon https://discord.com/channels/978331993370681444/986092194865758288 pour vous convier à la dernière étape. **
Bien à vous,
${signature}`;
  }

  resultDiv.textContent = previewMessage;
  resultDiv.dataset.textToCopy = copyMessage;
}

function copyToClipboard() {
  const resultDiv = document.getElementById("result");
  const textToCopy = resultDiv.dataset.textToCopy;

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      console.log("Texte copié dans le presse-papiers.");
      clearForm();
    })
    .catch((err) => {
      console.error("Erreur lors de la copie :", err);
    });
}

function clearForm() {
  document.getElementById("discord").value = "";
  document
    .querySelectorAll(".clickable-option.selected:not([data-id^='matricule'])")
    .forEach((option) => {
      option.classList.remove("selected");
    });
  document.getElementById("autreText").value = "";
  document.getElementById("autreTextGroup").style.display = "none";
  generateResponse();
}
