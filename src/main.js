import api from "./api";
class App {
  constructor() {
    this.repositories = [];

    this.formEl = document.getElementById("repoForm");
    this.listEl = document.getElementById("repoList");
    this.inputEl = document.querySelector("input[name=repository");

    this.registerHandlers();
  }

  registerHandlers() {
    this.formEl.onsubmit = event => {
      this.addRepository(event);
    };
  }

  setLoading(loading = true) {
    if (loading) {
      let loadEl = document.createElement("span");
      loadEl.appendChild(document.createTextNode("Carregando..."));
      loadEl.setAttribute("id", "loading");
      loadEl.className = "ml-2 text-info";

      this.formEl.appendChild(loadEl);
    } else {
      document.getElementById("loading").remove();
    }
  }

  async addRepository(event) {
    event.preventDefault();

    const repoInput = this.inputEl.value;

    if (repoInput.lenght === 0) return;

    this.setLoading();

    try {
      const response = await api.get(`users/${repoInput}`);

      const { name, bio, html_url, avatar_url } = response.data;
      let biografia = bio;
      if (biografia === null) biografia = "Usuário do GitHub";

      this.repositories.push({
        name,
        bio: biografia,
        avatar_url,
        html_url: html_url + "?tab=repositories"
      });

      this.inputEl.value = "";

      this.render();
    } catch (error) {
      alert("Usuário não Encontrado");
    }

    this.setLoading(false);
  }

  render() {
    this.listEl.innerHTML = "";

    this.repositories.forEach(repo => {
      let imgEl = document.createElement("img");
      imgEl.setAttribute("src", repo.avatar_url);
      imgEl.style.width = "80px";
      imgEl.className = "rounded float-left mr-3";

      let titleEl = document.createElement("strong");
      titleEl.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement("p");
      descriptionEl.appendChild(document.createTextNode(repo.bio));

      let linkEl = document.createElement("a");
      linkEl.setAttribute("target", "_blank");
      linkEl.setAttribute("href", repo.html_url);
      linkEl.appendChild(document.createTextNode("Acessar"));

      let listItemEl = document.createElement("li");
      listItemEl.className = "list-group-item list-group-item-secondary";
      listItemEl.appendChild(imgEl);
      listItemEl.appendChild(titleEl);
      listItemEl.appendChild(descriptionEl);
      listItemEl.appendChild(linkEl);

      this.listEl.appendChild(listItemEl);
    });
  }
}

new App();
