import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'; // <-- Imports de Recharts
import '../../styles/back-office/TableauDeBord.css'; 

// --- NOUVEAUX COMPOSANTS DE GRAPHIQUES ---

const DiagrammeEvolutionVentes = ({ data }) => (
  <div className="carte graphique-carte">
    <h2 className="titre-graphique">Évolution des ventes</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="jour" stroke="#555" />
        <YAxis stroke="#555" domain={[0, 10000]} />
        <Tooltip formatter={(value) => [`ventes : ${value}`, 'Mer']} />
        <Legend />
        <Line 
            type="monotone" 
            dataKey="ventes" 
            stroke="#20b2aa" // Couleur Vert Aquamarin pour la ligne
            strokeWidth={2}
            dot={{ r: 5 }} // Points de données
            activeDot={{ r: 8, stroke: '#20b2aa', fill: '#fff' }} // Point actif au survol
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const DiagrammeVentesParCategorie = ({ data, colors }) => {
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text 
            x={x} 
            y={y} 
            fill="white" 
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            style={{ fontWeight: 'bold', fontSize: '14px' }}
          >
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };

    return (
        <div className="carte graphique-carte">
            <h2 className="titre-graphique">Ventes par catégorie</h2>
            <div className="pie-container"> {/* Conteneur pour centrer le graphique et la légende */}
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                
                <div className="pie-legend">
                    {data.map((entry, index) => (
                        <p key={`legend-${index}`} style={{ color: colors[index % colors.length], fontWeight: 'bold' }}>
                            {entry.name} {entry.percent}%
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- COMPOSANTS EXISTANTS ---

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
            <td className="data" data-label="Montant Total">{client.montantTotal.toFixed(2)} €</td>
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

// --- COMPOSANT PRINCIPAL ---

const TableauDeBord = () => {
  const [periodeActive, setPeriodeActive] = useState('Cette semaine');

  const COULEURS_PIE = ['#20b2aa', '#ffa500', '#9400d3', '#696969']; // Légumes, Fruits, Céréales, Autres

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
    
    // Nouvelles données pour le graphique de l'évolution des ventes (correspond à votre image)
    evolutionVentes: [
        { jour: 'Lun', ventes: 4500 },
        { jour: 'Mar', ventes: 5200 },
        { jour: 'Mer', ventes: 4800 },
        { jour: 'Jeu', ventes: 6200 },
        { jour: 'Ven', ventes: 7200 },
        { jour: 'Sam', ventes: 8500 },
        { jour: 'Dim', ventes: 6800 },
    ],

    // Nouvelles données pour le graphique des catégories (correspond à votre image)
    ventesCategories: [
        { name: 'Légumes', value: 45, percent: 45 },
        { name: 'Fruits', value: 30, percent: 30 },
        { name: 'Céréales', value: 15, percent: 15 },
        { name: 'Autres', value: 10, percent: 10 },
    ],
  };

  const indicateursPrincipaux = [
    { titre: 'Total Commandes', valeur: donneesDashboard.totalCommandesSemaine, unite: '' },
    { titre: 'Panier Moyen', valeur: donneesDashboard.panierMoyenSemaine.toFixed(2), unite: '€' },
    { titre: 'Revenu Total', valeur: donneesDashboard.revenuTotalSemaine.toFixed(2), unite: '€' },
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
      
      {/* NOUVELLE SECTION POUR LES GRAPHIQUES */}
      <section className="section-graphiques">
          <DiagrammeEvolutionVentes data={donneesDashboard.evolutionVentes} />
          <DiagrammeVentesParCategorie 
              data={donneesDashboard.ventesCategories} 
              colors={COULEURS_PIE} 
          />
      </section>

      <section className="section-classement">
        <TableauClient clients={donneesDashboard.clientsClassement} />
      </section>

    </div>
  );
};

export default TableauDeBord;