import api from './api';

export const fetchArticles = async () => {
    const res = await api.get('/articles'); // publique
    return res.data;
};

export const createArticle = async (articleData) => {
    const res = await api.post('/articles', articleData); // protégé
    return res.data;
};

export const updateArticle = async (id, articleData) => {
    const res = await api.put(`/articles/${id}`, articleData); // protégé
    return res.data;
};

export const deleteArticle = async (id) => {
    const res = await api.delete(`/articles/${id}`); // protégé
    return res.data;
};
