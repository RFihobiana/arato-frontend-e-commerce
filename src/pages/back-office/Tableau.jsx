import React from 'react'
import SideBar from '../../composants/back-office/SideBar'
import TableauDeBord from '../../composants/back-office/TableauDeBord'
const Tableau= () => {
  return (
    <div className="dashboard-layout">
      <SideBar/>
       <div className="dashboard-content">
      <TableauDeBord/>
      </div>
    </div>
  )
}

export default Tableau
