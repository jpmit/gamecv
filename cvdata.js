// cvdata.js
// Copyright (c) James Mithen 2014.
// Data and formatting of CV.  Data loosely based on LinkedIn profile.

'use strict';
/*global game*/
/*jslint browser:true*/

var text = game.namespace('text');

text.cvdata = {
    "Education": [
        {
            "name": "University of Oxford",
            "title": "DPhil, Theoretical/Computational Physics",
            "description": "DPhil in depatment of Atomic and Laser Physics. Main research theme was numerical simulations (molecular dynamics) of Coulomb systems. Thesis title \"Molecular dynamics simulations of the equilibrium dynamics of non-ideal plasmas\". Programmed in Python, Fortran and C. Presented work at national and international conferences, and in publications in world leading journals.",
            "date": "2008 – 2012"
        },
        {
            "name": "University of Bristol",
            "title": "MSci, Mathematics and Physics",
            "description": "1st class honours",
            "date": "2003 – 2007"
        }
    ],
    "Skills": [
        {
            "skill": "C++"
        },
        {
            "skill": "Computational Physics"
        },
        {
            "skill": "Javascript"
        },
        {
            "skill": "Molecular Dynamics"
        },
        {
            "skill": "Monte Carlo Simulation"
        },
        {
            "skill": "Physics"
        },
        {
            "skill": "Python"
        },
        {
            "skill": "Statistical Physics"
        },
        {
            "skill": "Statistics"
        }
    ],
    "Experience": [
        {
            "title": "Research Fellow",
            "company": "University of Surrey",
            "description": "Research in computational statistical mechanics, specifically looking at crystallization of undercooled liquids. Developed Monte Carlo code in Python/Fortran for use on cluster computers. Extensive modelling and statistical analysis of simulation results.",
            "date": "June 2012 -"
        },
        {
            "title": "Visiting Scientist",
            "company": "Los Alamos National Laboratory",
            "description": "As part of my DPhil research, worked with the T5 Division, applied mathematics and plasma physics, on molecular dynamics simulations of plasmas.",
            "date": "Nov 2010 - Nov 2011"
        },
        {
            "title": "Statistical Analyst",
            "company": "Rushmore Reviews",
            "description": "Worked with management to develop an index to quantify the difficulty of drilling offshore oil wells using statistical methods (linear regression).",
            "date": "Nov 2007 - July 2008"
        },
        {
            "title": "Complexity Sciences Intern",
            "company": "British Antarctic Survey",
            "description": "Created models for idenfiying sub-glacial lakes from satellite images of the East Antarctic Ice Sheet. Programmed in Python and used ArcGIS mapping software.",
            "date": "July 2007 - Sep 2007"
        },
        {
            "title": "Equities Trading Intern",
            "company": "UBS Investment Bank",
            "description": "Rotations on Exotics and Algorithmic trading desks. Programmed in VBA.",
            "date": "July 2006 - Sep 2006"
        }
    ],
    "Academic Awards": [
        {
            "title": "Thesis Prize (runner-up)",
            "description": "Awarded by the UK Institute of Physics (IOP) for the thesis that \"contributes most strongly to the advancement of computational physics\".",
            "date": "June 2012"
        },
        {
            "title": "Sir Neville Mott award",
            "description": "Awarded to the \"top student in Mathematics/Physics\".",
            "date": "June 2007"
        },
        {
            "title": "Research Project Commendation",
            "description": "Awarded for final year research project \"Bound states of quasiparticles in a quantum magnet\".",
            "date": "June 2007"
        },
        {
            "title": "Dean Congratulatory Letter",
            "description": "Awarded in recognition of \"outstanding success\" in examinations.",
            "date": "June 2003"
        }
    ]
};

// format the CV data and store formatted text in "text" attribute
(function () {
    var k,
        i,
        j,
        nitems,
        cvdata = text.cvdata,
        data,
        itemdata,
        txt,
        keyOrder = ["name", "title", "company", "date", "skill", "description"],
        nKeys = keyOrder.length;

    function formatLine(t, divClass) {
        if (divClass === undefined) {
            return '<div>' + t + '</div>';
        }
        return '<div class="' + divClass + '">' + t + '</div>';
    }

    for (k in cvdata) {
        if (cvdata.hasOwnProperty(k)) {
            data = cvdata[k];
            nitems = data.length;
            // create formatted text string
            txt = formatLine(k + "<span class=exit> [Press RETURN to exit]</span>", "heading");
            for (i = 0; i < nitems; i += 1) {
                itemdata = data[i];
                for (j = 0; j < nKeys; j += 1) {
                    if (itemdata.hasOwnProperty(keyOrder[j])) {
                        txt += '<div class="entry">';
                        txt += formatLine(itemdata[keyOrder[j]], keyOrder[j]);
                        txt += '</div>';
                    }
                }
            }
            cvdata[k].text = txt;
        }
    }
}());
