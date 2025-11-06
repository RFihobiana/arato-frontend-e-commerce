import React, { useState, useEffect } from 'react';
import '../../../styles/back-office/paiements.css';
const paiementsApiData = [
    {
        numPaiement: 1,
        datePaiement: '2023-10-25 14:32:00',
        montantApayer: 149.99,
        statut: 'effectué',
        commande: {
            numCommande: 4892,
            utilisateur: { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com' }
        },
        mode_paiement: { nomMode: 'Carte Visa' }
    },
    {
        numPaiement: 2,
        datePaiement: '2023-10-25 11:15:00',
        montantApayer: 79.50,
        statut: 'en attente',
        commande: {
            numCommande: 4891,
            utilisateur: { nom: 'Lambert', prenom: 'Marie', email: 'marie.lambert@email.com' }
        },
        mode_paiement: { nomMode: 'PayPal' }
    },
    {
        numPaiement: 3,
        datePaiement: '2023-10-24 09:00:00',
        montantApayer: 25.00,
        statut: 'échoué',
        commande: {
            numCommande: 4890,
            utilisateur: { nom: 'Petit', prenom: 'Luc', email: 'luc.petit@email.com' }
        },
        mode_paiement: { nomMode: 'Virement' }
    },
    {
        numPaiement: 4,
        datePaiement: '2023-10-24 16:00:00',
        montantApayer: 500.25,
        statut: 'effectué',
        commande: {
            numCommande: 4889,
            utilisateur: { nom: 'Bernard', prenom: 'Sophie', email: 'sophie.b@email.com' }
        },
        mode_paiement: { nomMode: 'MasterCard' }
    },
   
];


const Paiements = () => {
    const [paiements, setPaiements] = useState([]);
    const [statutFiltre, setStatutFiltre] = useState('Tous les statuts');
    const [periodeFiltre, setPeriodeFiltre] = useState('Toutes les périodes');
    const [recherche, setRecherche] = useState('');
    const [stats, setStats] = useState({ caTotal: '0', nbTransactions: 0, tauxReussite: '0%' });
    useEffect(() => {
               setPaiements(paiementsApiData);

        const paiementsReussis = paiementsApiData.filter(p => p.statut === 'effectué');
        const ca = paiementsReussis.reduce((sum, p) => sum + p.montantApayer, 0);
        const taux = paiementsApiData.length > 0
            ? ((paiementsReussis.length / paiementsApiData.length) * 100).toFixed(1) + '%'
            : '0%';

        setStats({
            caTotal: ca.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
            nbTransactions: paiementsApiData.length,
            tauxReussite: taux
        });
    }, []);

    const paiementsFiltres = paiements.filter(paiement => {
        const statutMatch = statutFiltre === 'Tous les statuts' || paiement.statut === statutFiltre;

        const clientNomComplet = `${paiement.commande.utilisateur.prenom} ${paiement.commande.utilisateur.nom}`;
        const rechercheMatch = String(paiement.numPaiement).toLowerCase().includes(recherche.toLowerCase()) ||
                               clientNomComplet.toLowerCase().includes(recherche.toLowerCase()) ||
                               paiement.commande.utilisateur.email.toLowerCase().includes(recherche.toLowerCase());

              return statutMatch && rechercheMatch;
    });

       const getStatutClass = (statut) => {
        switch (statut) {
            case 'effectué':
                return 'statut-reussi';
            case 'en attente':
                return 'statut-attente';
            case 'échoué':
                return 'statut-echoue';
            default:
                return 'statut-default';
        }
    };
    const formaterDate = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('fr-FR'),
            heure: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const handleUpdateStatut = (numPaiement) => {
        alert(`Action: Modifier le statut du paiement #${numPaiement} (Appel à PaiementController@update)`);
         };

    const handleDeletePaiement = (numPaiement) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le paiement #${numPaiement} ? (Appel à PaiementController@destroy)`)) {
            alert(`Paiement #${numPaiement} supprimé.`);
           
        }
    };

    return (
        <div className="paiements-container">
            <h1 className="paiements-header">
                <span className="icon-emoji">💳</span> Gestion des Paiements
            </h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <p className="stat-label">CHIFFRE D'AFFAIRES TOTAL</p>
                    <p className="stat-value">{stats.caTotal}</p>
                    <p className="stat-change stat-change-up">
                        <span className="stat-arrow">↑</span>{stats.tauxReussite} de Réussite
                    </p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">TOTAL TRANSACTIONS</p>
                    <p className="stat-value">{stats.nbTransactions}</p>
                    <p className="stat-change stat-change-default">
                        (Effectuées, en attente, échouées)
                    </p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">PAIEMENTS EN ATTENTE</p>
                    <p className="stat-value">{paiements.filter(p => p.statut === 'en attente').length}</p>
                    <p className="stat-change stat-change-up">
                        Nécessite une vérification (ex: virement manuel)
                    </p>
                </div>
            </div>

            <hr className="divider" />

            {/* Historique des Paiements */}
            <div className="paiements-historique-card">
                <div className="historique-header">
                    <h2 className="historique-title">Historique des Paiements (Admin)</h2>
                    <button className="btn btn-export">
                        <span className="icon-emoji">⬇️</span> Exporter
                    </button>
                </div>

                {/* Filtres et Recherche */}
                <div className="filtres-recherche-zone">
                    <div className="filtre-group">
                        <label htmlFor="statutFiltre" className="filtre-label">Statut</label>
                        <select
                            id="statutFiltre"
                            value={statutFiltre}
                            onChange={(e) => setStatutFiltre(e.target.value)}
                            className="filtre-select"
                        >
                            <option>Tous les statuts</option>
                            <option>effectué</option>
                            <option>en attente</option>
                            <option>échoué</option>
                        </select>
                    </div>

                    <div className="filtre-group">
                        <label htmlFor="recherche" className="filtre-label">Recherche</label>
                        <input
                            type="text"
                            id="recherche"
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            placeholder="ID, client, email..."
                            className="filtre-input"
                        />
                    </div>
                </div>

                {/* Tableau des Paiements */}
                <div className="table-wrapper">
                    <table className="paiements-table">
                        <thead>
                            <tr>
                                <th>ID PAIEMENT</th>
                                <th>CLIENT / EMAIL</th>
                                <th>COMMANDE N°</th>
                                <th>DATE</th>
                                <th>MONTANT</th>
                                <th>MODE</th>
                                <th>STATUT</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paiementsFiltres.map((p) => {
                                const { date, heure } = formaterDate(p.datePaiement);
                                const clientNom = `${p.commande.utilisateur.prenom} ${p.commande.utilisateur.nom}`;
                                return (
                                    <tr key={p.numPaiement} className="paiement-row">
                                        <td className="paiement-id">
                                            #{p.numPaiement}
                                        </td>
                                        <td>
                                            <div className="client-name">{clientNom}</div>
                                            <div className="client-email">{p.commande.utilisateur.email}</div>
                                        </td>
                                        <td className="paiement-commande-id">
                                            #{p.commande.numCommande}
                                        </td>
                                        <td>
                                            {date} <span className="paiement-heure">à {heure}</span>
                                        </td>
                                        <td className="paiement-montant">
                                            {p.montantApayer.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                        </td>
                                        <td>
                                            {p.mode_paiement.nomMode}
                                        </td>
                                        <td>
                                            <span className={`statut-badge ${getStatutClass(p.statut)}`}>
                                                {p.statut}
                                            </span>
                                        </td>
                                        <td className="paiement-actions">
                                            <button onClick={() => handleUpdateStatut(p.numPaiement)} className="btn-action btn-modifier">Modifier</button>
                                            <button onClick={() => handleDeletePaiement(p.numPaiement)} className="btn-action btn-supprimer">Supprimer</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {paiementsFiltres.length === 0 && (
                    <div className="no-result">
                        Aucun paiement trouvé pour la recherche et les filtres actuels.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Paiements;