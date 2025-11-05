import React, { useState } from 'react';
import '../../styles/back-office/TableauDeBord.css'; 


const BoutonFiltrePeriode = ({ periode, periodeActive, setPeriodeActive }) => (
  <button
    className={`bouton-filtre ${periode === periodeActive ? 'actif' : ''}`}
    onClick={() => setPeriodeActive(periode)}
  >
    {periode}
  </button>
);

const TableauClient = ({ clients }) => (
 
  <div className=" tableau-client">
    
    <table className="tableau-data">
      <thead>
        <tr>
          <th>Rang</th> 
          <th>Client</th>
          <th>Montant Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => ( 
          <tr key={client.email}>
            
            <td className="data" data-label="N° Rang"> 
              {client.rang}
            </td>
            <td className="data" data-label="Client">
              
              <p >{client.email}</p>
            </td>
            <td lassName="data" data-label="Montant Total">{client.montantTotal.toFixed(2)} €</td>
            <td className="data" data-label="Action">
              <button className="btn-action">
               Envoyer Code
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TableauDeBord = () => {
  const [periodeActive, setPeriodeActive] = useState('Cette semaine');

  const donneesDashboard = {
    totalCommandesSemaine: 5,
    panierMoyenSemaine: 289.60,
    revenuTotalSemaine: 1448.00,
    clientsClassement: [
      { rang: 1, nom: 'Jean Lefebvre', email: 'jean.lefebvre@email.com', achats: 2, montantTotal: 539.00 },
      { rang: 2, nom: 'Martin Dupont', email: 'martin.dupont@email.com', achats: 1, montantTotal: 447.00 },
      { rang: 3, nom: 'Pierre Moreau', email: 'pierre.moreau@email.com', achats: 1, montantTotal: 274.00 },
      { rang: 4, nom: 'Sophie Bernard', email: 'sophie.bernard@email.com', achats: 1, montantTotal: 188.00 },
    ],
  };

  const indicateursPrincipaux = [
    { 
      titre: 'Total Commandes', 
      valeur: donneesDashboard.totalCommandesSemaine, 
      unite: '', 
      infoPeriode: 'cette semaine' 
    },
    { 
      titre: 'Panier Moyen', 
      valeur: donneesDashboard.panierMoyenSemaine.toFixed(2), 
      unite: '€', 
      icone: '', 
     
      infoPeriode: 'cette semaine'
    },
    { 
      titre: 'Revenu Total', 
      valeur: donneesDashboard.revenuTotalSemaine.toFixed(2), 
      unite: '€', 
      icone: '$', 
   
      infoPeriode: 'cette semaine'
    },
  ];

  return (
    <div className="conteneur">
      <header className="entete-client">
        <h1 className="titre-section"> Statistiques d'Achat par Client</h1>
        <div className="filtre-periode-client">
          <h3 className="titre-periode">Période : {periodeActive}</h3>
          <div className="boutons-periode">
            <BoutonFiltrePeriode periode="Cette semaine" periodeActive={periodeActive} setPeriodeActive={setPeriodeActive} />
            <BoutonFiltrePeriode periode="Ce mois" periodeActive={periodeActive} setPeriodeActive={setPeriodeActive} />
            <BoutonFiltrePeriode periode="Cette année" periodeActive={periodeActive} setPeriodeActive={setPeriodeActive} />
            <BoutonFiltrePeriode periode="Toute la période" periodeActive={periodeActive} setPeriodeActive={setPeriodeActive} />
          </div>
        </div>
      </header>

      <section className="section-indicateurs">
        <div className="carte ">
          <h1 >Revenu Total</h1>
          <p >{indicateursPrincipaux[2].valeur} {indicateursPrincipaux[2].unite}</p>                 
        </div>
        
        <div className="carte ">
           <h1 >{indicateursPrincipaux[0].titre}</h1>
          <p >{indicateursPrincipaux[0].valeur}</p>
         
        </div>

        <div className="carte ">
           <h1>{indicateursPrincipaux[1].titre}</h1>
          <p >{indicateursPrincipaux[1].valeur} {indicateursPrincipaux[1].unite}</p>
         
       </div>
      </section>
      
      <section className="section-classement">
        <TableauClient clients={donneesDashboard.clientsClassement} />
      </section>

    </div>
  );
};

export default TableauDeBord;