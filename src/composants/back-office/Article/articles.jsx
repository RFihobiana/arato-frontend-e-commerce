import React, { useState, useEffect } from "react";
import { fetchArticles, deleteArticle } from "../../../services/articleService";
import AjouterArticleModal from "./AjouterArticleModal";
import "../../../styles/back-office/article.css";

const Articles = () => {
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [articleAEditer, setArticleAEditer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chargerArticles = async () => {
    try {
      setLoading(true);
      const data = await fetchArticles();
      setArticles(data);
      setFilteredArticles(data);
      setError(null);
    } catch (err) {
      setError(
        "Impossible de charger les articles. Vérifiez la connexion API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerArticles();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = articles.filter(
      (article) =>
        article.titre?.toLowerCase().includes(term) ||
        article.description?.toLowerCase().includes(term) ||
        (article.datePublication && article.datePublication.includes(term))
    );
    setFilteredArticles(results);
  }, [searchTerm, articles]);

  const handleSupprimer = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      try {
        await deleteArticle(id);
        chargerArticles();
      } catch (error) {
        alert("Erreur lors de la suppression de l'article.");
      }
    }
  };

  const handleModifier = (article) => {
    setArticleAEditer(article);
    setIsModalOpen(true);
  };

  const handleAjout = () => {
    setArticleAEditer(null);
    setIsModalOpen(true);
  };


  if (error)
    return (
      <div className="bo-container">
        <p className="bo-message-erreur">{error}</p>
      </div>
    );

  const showEmptyMessage = filteredArticles.length === 0 && !searchTerm;
  const showNoResultsMessage = filteredArticles.length === 0 && searchTerm;

  return (
    <div className="bo-container">
      <header className="bo-header">
        <h1 className="bo-titre-page">Gestion des Articles</h1>
      </header>

      <div className="bo-toolbar">
        <button className="bo-btn-primaire" onClick={handleAjout}>
          Ajouter un article
        </button>
        <input
          type="text"
          placeholder="Rechercher par titre, description ou date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bo-search-input"
        />
      </div>

      <div className="articles-grid-bo">
        {showEmptyMessage && (
          <div className="bo-message-vide">
            <h3>Aucun article n'a été créé</h3>
            <p>
              Cliquez sur " Ajouter un article" pour commencer à publier du
              contenu.
            </p>
          </div>
        )}

        {showNoResultsMessage && (
          <div className="bo-message-vide">
            <h3>Aucun article ne correspond à votre recherche 🔎</h3>
            <p>Veuillez essayer !</p>
          </div>
        )}

        {!showEmptyMessage &&
          filteredArticles.length > 0 &&
          filteredArticles.map((article) => (
            <div className="article-card-bo" key={article.numArticle}>
              <div className="article-image-container-bo">
                <img
                  src={`${IMAGE_BASE_URL}${article.image}`}
                  alt={article.titre || "Article"}
                  className="article-image-bo"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>

              <div className="article-details-bo">
                <h3 className="article-titre-bo">{article.titre}</h3>
                <p className="article-description-bo">
                  {article.description?.substring(0, 80)}...
                </p>
                <p className="article-meta-bo">
                  <span>
                    <b>Auteur :</b> {article.auteur}
                  </span>
                  <br />
                  <span>
                    <b>Publié le :</b> {article.datePublication}
                  </span>
                </p>
              </div>

              <div className="article-actions-bo">
                <button
                  onClick={() => handleModifier(article)}
                  className="bo-btn-secondaire"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleSupprimer(article.numArticle)}
                  className="bo-btn-danger"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
      </div>

      {isModalOpen && (
        <AjouterArticleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={chargerArticles}
          articleAEditer={articleAEditer}
        />
      )}
    </div>
  );
};

export default Articles;
