import React, { useState, useEffect } from 'react';
import AjouterArticleModal from './AjouterArticleModal';
import { fetchArticles, createArticle, updateArticle, deleteArticle } from '../../../services/articleService';
import '../../../styles/back-office/article.css';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [articleAEditer, setArticleAEditer] = useState(null);

    useEffect(() => {
        const getArticles = async () => {
            try {
                const data = await fetchArticles();
                setArticles(data);
            } catch (err) {
                console.error('Erreur lors du fetch des articles', err);
            }
        };
        getArticles();
    }, []);
    
    const openAjouterModal = () => {
        setArticleAEditer(null);
        setIsModalOpen(true);
    };

    const handleEdit = (article) => {
        setArticleAEditer(article);
        setIsModalOpen(true);
    };

    const handleDelete = async (numArticle) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            try {
                await deleteArticle(numArticle);
                setArticles(articles.filter(a => a.numArticle !== numArticle));
            } catch (err) {
                console.error('Erreur lors de la suppression', err);
            }
        }
    };

    const handleSaveArticle = async (formData) => {
        try {
            let savedArticle;
            if (articleAEditer) {
                savedArticle = await updateArticle(articleAEditer.numArticle, formData);
                setArticles(articles.map(a => a.numArticle === savedArticle.numArticle ? savedArticle : a));
            } else {
                savedArticle = await createArticle(formData);
                setArticles([savedArticle, ...articles]);
            }
            setArticleAEditer(null);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Erreur lors de l’enregistrement de l’article', err);
        }
    };

    return (
        <div className="gestion-articles-bo">
            <header className="header-articles-bo">
                <h1 className="titre-page-bo">📰 Gestion des Articles de Blog</h1>
                <button className="btn-ajouter-article-bo" onClick={openAjouterModal}>
                    <svg className="icone-plus-bo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
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
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <tr key={article.numArticle}>
                                <td>{article.numArticle}</td>
                                <td>{article.titre}</td>
                                <td>{article.auteur}</td>
                                <td>{article.datePublication?.substring(0, 10)}</td>
                                <td>{article.description?.substring(0, 50)}...</td>
                                <td>
                                    <div className="actions-cell-bo">
                                        <button className="btn-action-editer" onClick={() => handleEdit(article)}>Éditer</button>
                                        <button className="btn-action-supprimer" onClick={() => handleDelete(article.numArticle)}>Supprimer</button>
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

export default Articles;
