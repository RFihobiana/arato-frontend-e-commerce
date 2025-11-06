import React, { useState, useEffect } from 'react';
import AjouterArticleModal from './AjouterArticleModal';
import '../../../styles/back-office/article.css';

const initialArticles = [
    {
        numArticle: 1,
        titre: "Les Tendances du Marché Bio en 2025",
        auteur: "Jeanne Dupont",
        datePublication: "2025-10-25",
        resume: "Un aperçu des fruits et légumes qui domineront les étals l'année prochaine...",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
        image: 'tendances_bio.jpg'
    },
    {
        numArticle: 2,
        titre: "Cuisiner le Chou : 10 Recettes Originales",
        auteur: "Pierre Martin",
        datePublication: "2025-11-01",
        resume: "Découvrez des façons inattendues d'intégrer le chou dans vos repas quotidiens.",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...",
        image: 'recettes_chou.png'
    },
];

const articles = () => {
    const [articles, setArticles] = useState(initialArticles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [articleAEditer, setArticleAEditer] = useState(null);

    const getNextId = () => {
        const maxId = articles.reduce((max, a) => Math.max(max, a.numArticle || 0), 0);
        return maxId + 1;
    };

    const handleSaveArticle = (articleData) => {
        let articleMisAJour = { ...articleData };
        
        if (articleAEditer) {
            setArticles(articles.map(a => 
                a.numArticle === articleMisAJour.numArticle ? articleMisAJour : a
            ));
        } else {
            articleMisAJour.numArticle = getNextId();
            setArticles([articleMisAJour, ...articles]);
        }
        
        setArticleAEditer(null);
        setIsModalOpen(false);
    };

    const handleEdit = (article) => {
        setArticleAEditer(article);
        setIsModalOpen(true);
    };
    
    const handleDelete = (numArticle) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            setArticles(articles.filter(a => a.numArticle !== numArticle));
        }
    };
    
    const openAjouterModal = () => {
        setArticleAEditer(null); 
        setIsModalOpen(true);
    };

    return (
        <div className="gestion-articles-bo">
            <header className="header-articles-bo">
                <h1 className="titre-page-bo">📰 Gestion des Articles de Blog</h1>
                <button
                    className="btn-ajouter-article-bo"
                    onClick={openAjouterModal}
                >
                    <svg className="icone-plus-bo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Ajouter un Article
                </button>
            </header>
            
            <div className="table-container-bo">
                <table className="articles-table-bo">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>Date Pub.</th>
                            <th>Résumé</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <tr key={article.numArticle}>
                                <td>{article.numArticle}</td>
                                <td>{article.titre}</td>
                                <td>{article.auteur}</td>
                                
                                <td>{article.datePublication}</td>
                                <td className="resume-col">{article.resume.substring(0, 50)}...</td>
                                <td>
                                    <div className="actions-cell-bo">
                                        <button 
                                            className="btn-action-editer"
                                            onClick={() => handleEdit(article)}
                                        > Éditer</button>
                                        <button 
                                            className="btn-action-supprimer"
                                            onClick={() => handleDelete(article.numArticle)}
                                        > Supprimer</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AjouterArticleModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setArticleAEditer(null);
                    }}
                    onSave={handleSaveArticle}
                    article={articleAEditer}
                />
            )}
        </div>
    );
};

export default articles;