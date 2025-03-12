document.querySelectorAll(".clickable-option").forEach((option) => {
  option.addEventListener("click", () => {
    option.classList.toggle("selected");
    generatePattern();
  });
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
  matricule186: ":DivisionSAPA: **Gestionnaire PA - 186 | Alex Mendes**",
  matricule305: ":DivisionSAPA: **Gestionnaire PA - 305 | Bijou Boubakar**",
  matricule003: ":DivisionSAPA: **Gestionnaire PA - 003 | Yahya Gonzalez**",
  matricule112: ":DivisionSAPA: **Gestionnaire PA - 112 | Adrianna Mendes**",
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
    selectedOptions.includes("autre") && autreText ? `| ${autreText} |` : "";

  const motifs = selectedOptions
    .map((option) => (option === "autre" ? autreMessage : messages[option]))
    .filter((option) => option !== "");

  const autreTextGroup = document.getElementById("autreTextGroup");
  autreTextGroup.style.display = selectedOptions.includes("autre")
    ? "block"
    : "none";

  const signature =
    selectedMatricule ||
    ":DivisionSAPA: **Gestionnaire PA - 170 | Dorian Rossini**";

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
Motifs : ||** ${motifs.join(" | ")} **||
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
      clearForm();
    })
    .catch((err) => {
      console.error("Erreur lors de la copie :", err);
    });
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
