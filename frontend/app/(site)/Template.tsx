"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {LOCAL_DATA} from '@/constants'


export default function Template() {
  return (
    <main className="home-page">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
    </main>
  );
}

const HeroSection = () => {
  const [inView, setIsInView] = useState(false);

  const {exampleImage} = LOCAL_DATA.images

  return (
    <section
      className="pt-20! hero text-center sm:text-left  lg:min-h-[calc(100vh-80px)] flex items-center"
      id="home-page"
    >
      <motion.div
        onViewportEnter={() => setIsInView(true)}
        viewport={{ amount: 0.7 }}
        className="container flex justify-between items-center flex-col sm:flex-row gap-x-12.5 gap-y-[30px] flex-center"
      >
        <div className={`max-w-122.5 ${inView ? "lazy-animate" : ""}`} data-lazy="fade">
          <h4 className="sub-title mb-1 text-[18px] font-medium text-[#3e3e3e]">Welcom home.</h4>
          <h1 className="title text-3xl leading-[1.4]  md:text-5xl font-medium md:leading-[1.4] mb-10">
            This is project HQ
          </h1>
        </div>
        <div className={`avatar ${inView ? "lazy-animate" : ""} delay-300 max-w-100 w-full`} data-lazy="fade">
            <img src={exampleImage} alt="avatar" className="w-full max-h-75 object-contain rounded-lg" />
        </div>
      </motion.div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="about">
      <div className="container">
        <h2 className="about-title text-3xl font-bold mb-3">About Section</h2>
        <p className="about-description ">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur, explicabo!
        </p>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  return (
    <section className="services">
      <div className="container">
        <h2 className="services-title text-3xl font-bold mb-3">Services Section</h2>
        <p className="services-description ">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur, explicabo!
        </p>
      </div>
    </section>
  );
};
