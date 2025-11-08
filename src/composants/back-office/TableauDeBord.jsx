import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import '../../styles/back-office/TableauDeBord.css'; 

const COULEURS_PIE = ['#20b2aa', '#ffa500', '#9400d3', '#696969'];

const DONNEES_PAR_PERIODE = {
    'Cette semaine': {
        totalCommandes: 5,
        panierMoyen: 289.60,
        revenuTotal: 1448.00,
        clientsClassement: [
            { rang: 1, nom: 'Jean Lefebvre', email: 'jean.lefebvre@email.com', achats: 2, montantTotal: 539.00 },
            { rang: 2, nom: 'Martin Dupont', email: 'martin.dupont@email.com', achats: 1, montantTotal: 447.00 },
            { rang: 3, nom: 'Pierre Moreau', email: 'pierre.moreau@email.com', achats: 1, montantTotal: 274.00 },
            { rang: 4, nom: 'Sophie Bernard', email: 'sophie.bernard@email.com', achats: 1, montantTotal: 188.00 },
        ],
        evolutionVentes: [
            { jour: 'Lun', ventes: 4500 },
            { jour: 'Mar', ventes: 5200 },
            { jour: 'Mer', ventes: 4800 },
            { jour: 'Jeu', ventes: 6200 },
            { jour: 'Ven', ventes: 7200 },
            { jour: 'Sam', ventes: 8500 },
            { jour: 'Dim', ventes: 6800 },
        ],
        ventesCategories: [
            { name: 'Légumes', value: 45, percent: 45 },
            { name: 'Fruits', value: 30, percent: 30 },
            { name: 'Céréales', value: 15, percent: 15 },
            { name: 'Autres', value: 10, percent: 10 },
        ],
    },
    'Ce mois': {
        totalCommandes: 22,
        panierMoyen: 310.50,
        revenuTotal: 6831.00,
        clientsClassement: [
            { rang: 1, nom: 'Alexandre Dubois', email: 'alex.dubois@email.com', achats: 4, montantTotal: 1250.00 },
            { rang: 2, nom: 'Sarah Petit', email: 'sarah.petit@email.com', achats: 3, montantTotal: 980.00 },
            { rang: 3, nom: 'Jean Lefebvre', email: 'jean.lefebvre@email.com', achats: 2, montantTotal: 700.00 },
            { rang: 4, nom: 'Lucie Robert', email: 'lucie.robert@email.com', achats: 1, montantTotal: 450.00 },
        ],
        evolutionVentes: [
            { jour: 'Sem 1', ventes: 1200 },
            { jour: 'Sem 2', ventes: 2800 },
            { jour: 'Sem 3', ventes: 3500 },
            { jour: 'Sem 4', ventes: 4200 },
        ],
        ventesCategories: [
            { name: 'Légumes', value: 40, percent: 40 },
            { name: 'Fruits', value: 35, percent: 35 },
            { name: 'Céréales', value: 20, percent: 20 },
            { name: 'Autres', value: 5, percent: 5 },
        ],
    },
    'Cette année': {
        totalCommandes: 250,
        panierMoyen: 350.00,
        revenuTotal: 87500.00,
        clientsClassement: [
            { rang: 1, nom: 'Grande Entreprise Z', email: 'contact@z.com', achats: 50, montantTotal: 15000.00 },
            { rang: 2, nom: 'Local Bio A', email: 'local@a.com', achats: 35, montantTotal: 12000.00 },
            { rang: 3, nom: 'Alexandre Dubois', email: 'alex.dubois@email.com', achats: 15, montantTotal: 7500.00 },
        ],
        evolutionVentes: [
            { jour: 'T1', ventes: 20000 },
            { jour: 'T2', ventes: 25000 },
            { jour: 'T3', ventes: 30000 },
            { jour: 'T4', ventes: 35000 },
        ],
        ventesCategories: [
            { name: 'Légumes', value: 30, percent: 30 },
            { name: 'Fruits', value: 40, percent: 40 },
            { name: 'Céréales', value: 25, percent: 25 },
            { name: 'Autres', value: 5, percent: 5 },
        ],
    },
    'Toute la période': {
        totalCommandes: 450,
        panierMoyen: 345.50,
        revenuTotal: 155475.00,
        clientsClassement: [
            { rang: 1, nom: 'Grande Entreprise Z', email: 'contact@z.com', achats: 70, montantTotal: 25000.00 },
            { rang: 2, nom: 'Local Bio A', email: 'local@a.com', achats: 50, montantTotal: 18000.00 },
        ],
        evolutionVentes: [
            { jour: 'An 1', ventes: 40000 },
            { jour: 'An 2', ventes: 60000 },
            { jour: 'An 3', ventes: 80000 },
        ],
        ventesCategories: [
            { name: 'Légumes', value: 35, percent: 35 },
            { name: 'Fruits', value: 35, percent: 35 },
            { name: 'Céréales', value: 20, percent: 20 },
            { name: 'Autres', value: 10, percent: 10 },
        ],
    }
};

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
        <YAxis stroke="#555" /> 
        <Tooltip formatter={(value) => [`${value.toFixed(2)} €`, 'Ventes']} />
        <Legend />
        <Line 
            type="monotone" 
            dataKey="ventes" 
            stroke="#20b2aa" 
            strokeWidth={2}
            dot={{ r: 5 }} 
            activeDot={{ r: 8, stroke: '#20b2aa', fill: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const DiagrammeVentesParCategorie = ({ data, colors }) => {
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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
            <div className="pie-container"> 
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

const TableauDeBord = () => {
  const [periodeActive, setPeriodeActive] = useState('Cette semaine');

  const donneesDashboard = useMemo(() => {
    return DONNEES_PAR_PERIODE[periodeActive] || DONNEES_PAR_PERIODE['Cette semaine'];
  }, [periodeActive]);

  const indicateursPrincipaux = [
    { titre: 'Total Commandes', valeur: donneesDashboard.totalCommandes, unite: '' },
    { titre: 'Panier Moyen', valeur: donneesDashboard.panierMoyen.toFixed(2), unite: '€' },
    { titre: 'Revenu Total', valeur: donneesDashboard.revenuTotal.toFixed(2), unite: '€' },
  ];

  return (
    <div className="conteneur">
      <header className="entete-client">
        <h1 className="titre-section"> Statistiques d'Achat par Client</h1>
        <div className="filtre-periode-client">
          <h3 className="titre-periode">Période : {periodeActive}</h3>
          <div className="boutons-periode">
            {Object.keys(DONNEES_PAR_PERIODE).map(periode => (
                <BoutonFiltrePeriode 
                    key={periode} 
                    periode={periode} 
                    periodeActive={periodeActive} 
                    setPeriodeActive={setPeriodeActive} 
                />
            ))}
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