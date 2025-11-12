import React from "react";
import Header from "../../composants/Header";
import HeroSection from "../../composants/front-office/Accueil/HeroSection";
import ProduitsSection from "../../composants/front-office/Accueil/ProduitsSection";
import PointsFortSection from "../../composants/front-office/Accueil/PointsFortSection";
import AProposSection from "../../composants/front-office/Accueil/AboutSection";
import NewsLetterSection from "../../composants/front-office/Accueil/NewsLetterSection";
import FooterSection from "../../composants/FooterSection";
export default function Accueil(){
    return (
        <div>
        <Header/>
        <HeroSection/>
        <ProduitsSection/>
        <PointsFortSection/>
        <AProposSection/>

        <NewsLetterSection/>
        <FooterSection/>
       
        </div>
    )
}