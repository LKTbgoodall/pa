document.querySelectorAll(".clickable-option").forEach((option) => {
  option.addEventListener("click", () => {
    option.classList.toggle("selected");
    if (option.classList.contains("selected")) {
      // Stocker le matricule sélectionné dans le localStorage
      localStorage.setItem("selectedMatricule", option.getAttribute("data-id"));
    } else {
      // Si le matricule est désélectionné, supprimer du localStorage
      localStorage.removeItem("selectedMatricule");
    }
    generatePattern();
  });
});

// Au chargement de la page, récupérer le matricule sélectionné
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
  generatePattern();
});

function generatePattern() {
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

  const messages = {
    age: "Âge non requis",
    nationalite: "Nationalité non américaine",
    diplomes: "Diplôme non américain",
    aucunDiplome: "Aucun diplôme possédé",
    antecedents: "Antécédents judiciaires présents",
    disponibilites: "Disponibilités faibles",
    lettre: "Lettre de motivation peu convaincante",
    rp: "Cette candidature doit être RP",
    ia: "Suspicion d'utilisation d'IA / Internet",
    iaFlagrant:
      "Utilisation d'IA / Internet flagrant : attente 7 jours avant de repostuler",
    lspd: "Nous sommes la SAMP et non la LSPD",
  };

  const matricules = {
    matricule497: ":DivisionSAPA: **Gestionnaire PA - 497 | Flora Sancho**",
    matricule323: ":DivisionSAPA: **Gestionnaire PA - 323 | Helena Mancini**",
    matricule305: ":DivisionSAPA: **Gestionnaire PA - 305 | Bijou Boubakar**",
    matricule003: ":DivisionSAPA: **Gestionnaire PA - 003 | Yahya Gonzalez**",
    matricule315: ":DivisionSAPA: **Gestionnaire PA - 315 | Alba Martell**",
    matricule054: ":DivisionSAPA: **Gestionnaire PA - 054 | Scott Ella**",
  };

  const selectedOptions = Array.from(
    document.querySelectorAll(
      ".clickable-option.selected:not([data-id^='matricule'])"
    )
  ).map((option) => option.getAttribute("data-id"));

  const selectedMatricule = Array.from(
    document.querySelectorAll(
      ".clickable-option.selected[data-id^='matricule']"
    )
  ).map((option) => matricules[option.getAttribute("data-id")])[0];

  const autreText = document.getElementById("autreText").value.trim();
  const autreMessage =
    selectedOptions.includes("autre") && autreText ? `${autreText}` : "";

  const motifs = selectedOptions
    .map((option) => (option === "autre" ? autreMessage : messages[option]))
    .filter((option) => option !== "");

  const autreTextGroup = document.getElementById("autreTextGroup");
  autreTextGroup.style.display = selectedOptions.includes("autre")
    ? "block"
    : "none";

  const signature =
    selectedMatricule ||
    ":DivisionSAPA: **Superviseur PA - 170 | Dorian Rossini**";

  if (motifs.length > 0) {
    resultDiv.textContent = `Réponse Candidature
Candidat : ${discordFormate}
Motifs : ${motifs.join(" | ")}
Bien à vous,
${signature}
-# Vous avez 3 chances ne baissez pas les bras`;
  } else {
    resultDiv.textContent = `Réponse Candidature
Candidat : ${discordFormate}
Motifs : Félicitations ! Renommez-vous prénom + nom si ce n'est pas déjà fait
Bien à vous,
${signature}`;
  }

  let textToCopy;
  if (motifs.length > 0) {
    textToCopy = `**[Réponse Candidature](https://media.discordapp.net/attachments/987832659201916948/1341378164554731541/image0.gif?ex=67c39f04&is=67c24d84&hm=cb806d675647b26426b1c33a844e7652248c41fb12706c056fa11d0ba2519b3c&=)**
Candidat : ${discordFormate}
Motifs : ||${motifs.join(" | ")}||
Bien à vous,
${signature}
-# Vous avez 3 chances ne baissez pas les bras`;
  } else {
    textToCopy = `**[Réponse Candidature](https://media.discordapp.net/attachments/1202650735112749096/1277373766690799819/accepter.gif?ex=67c41fc6&is=67c2ce46&hm=5829a3ba02b0ba3944ed6e5bbd64a158770d5fdfd2361f7b9065c3acedec454b&=)**
Candidat : ${discordFormate}
Motifs : ** Félicitations ! Renommez-vous prénom + nom si ce n'est pas déjà fait**
Bien à vous,
${signature}`;
  }

  resultDiv.dataset.textToCopy = textToCopy;
}

function copyToClipboard() {
  const resultDiv = document.getElementById("result");
  const textToCopy = resultDiv.dataset.textToCopy;

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      console.log("Texte copié dans le presse-papiers.");

      // Vérifier si "Utilisation d'IA / Internet flagrant" est sélectionné
      const selectedOptions = Array.from(
        document.querySelectorAll(
          ".clickable-option.selected:not([data-id^='matricule'])"
        )
      ).map((option) => option.getAttribute("data-id"));

      if (selectedOptions.includes("iaFlagrant")) {
        // Ouvrir la popup de sanction après avoir copié le message principal
        showSanctionPage();
      } else {
        // Réinitialiser le formulaire si "iaFlagrant" n'est pas sélectionné
        clearForm();
      }

      // Rétablir le défilement de la page
      document.body.style.overflow = "auto";
    })
    .catch((err) => {
      console.error("Erreur lors de la copie :", err);
    });
}

function showSanctionPage() {
  const sanctionPage = document.getElementById("sanctionPage");
  const discordInput = document.getElementById("discord").value.trim();
  const sanctionDiscord = document.getElementById("sanctionDiscord");

  // Mettre à jour le champ Discord dans la page de sanction
  if (discordInput) {
    if (/^\d+$/.test(discordInput)) {
      sanctionDiscord.value = `<@${discordInput}>`;
    } else {
      sanctionDiscord.value = `@${discordInput}`;
    }
  } else {
    sanctionDiscord.value = "@";
  }

  // Calculer la date de fin de sanction (7 jours à partir d'aujourd'hui)
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 7);
  const formattedEndDate = endDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  document.getElementById("sanctionEndDate").value = formattedEndDate;

  // Afficher la page de sanction
  sanctionPage.style.display = "block";
  document.body.style.overflow = "hidden"; // Empêcher le défilement de la page principale
}

function copySanctionToClipboard() {
  const uniqueId = document.getElementById("uniqueId").value.trim();
  const sanctionDiscord = document.getElementById("sanctionDiscord").value;
  const sanctionEndDate = document.getElementById("sanctionEndDate").value;

  const sanctionMessage = `**Motif :** Utilisation d'IA / Internet
**ID Unique :** ${uniqueId}
**Discord :** ${sanctionDiscord}
**Sanction :** Attente 7 jours
**Fin de sanction :** ${sanctionEndDate}`;

  navigator.clipboard
    .writeText(sanctionMessage)
    .then(() => {
      console.log("Sanction copiée dans le presse-papiers.");
      closeSanctionPage();
      clearSanctionForm();
      clearForm(); // Réinitialiser le formulaire principal après la copie
    })
    .catch((err) => {
      console.error("Erreur lors de la copie :", err);
    });
}

function closeSanctionPage() {
  const sanctionPage = document.getElementById("sanctionPage");
  sanctionPage.style.display = "none";
  document.body.style.overflow = "auto"; // Rétablir le défilement de la page principale
}

function clearSanctionForm() {
  document.getElementById("uniqueId").value = "";
  document.getElementById("sanctionDiscord").value = "";
  document.getElementById("sanctionEndDate").value = "";
}

function clearForm() {
  document.getElementById("discord").value = "";
  document
    .querySelectorAll(".clickable-option:not([data-id^='matricule'])")
    .forEach((option) => {
      option.classList.remove("selected");
    });
  document.getElementById("autreText").value = "";
  document.getElementById("autreTextGroup").style.display = "none";
  generatePattern();
}

generatePattern();
