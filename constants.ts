import { Unit, UnitId } from './types';

export const COURSE_CONTENT: Unit[] = [
  {
    id: UnitId.CONDUCTION,
    title: "Unit 1: Heat Conduction",
    icon: "Thermometer",
    topics: [
      "Fourier’s Law of Conduction",
      "1D, 2D, and 3D Conduction Equations",
      "Steady & Unsteady State Conduction",
      "Thermal Resistance Network",
      "Composite Walls & Cylinders",
      "Critical Radius of Insulation"
    ]
  },
  {
    id: UnitId.CONVECTION,
    title: "Unit 2: Convection",
    icon: "Wind",
    topics: [
      "Newton’s Law of Cooling",
      "Forced vs. Natural Convection",
      "Hydrodynamic & Thermal Boundary Layers",
      "Laminar vs. Turbulent Flow",
      "Dimensionless Numbers (Re, Pr, Nu, Gr)",
      "Internal & External Flow Correlations"
    ]
  },
  {
    id: UnitId.BOILING,
    title: "Unit 3: Boiling & Condensation",
    icon: "Droplets",
    topics: [
      "Pool Boiling Curve & Regimes",
      "Nucleate vs. Film Boiling",
      "Film vs. Dropwise Condensation",
      "Heat Pipe Principle",
      "Applications in Heat Exchangers"
    ]
  },
  {
    id: UnitId.RADIATION,
    title: "Unit 4: Radiation",
    icon: "Sun",
    topics: [
      "Blackbody & Gray Body Radiation",
      "Stefan–Boltzmann Law",
      "View Factors (Shape Factors)",
      "Radiation Shields",
      "Electrical Analogy for Radiation"
    ]
  },
  {
    id: UnitId.MASS_TRANSFER,
    title: "Unit 5: Mass Transfer",
    icon: "Waves",
    topics: [
      "Fick’s Law of Diffusion",
      "Mass Diffusion Coefficient",
      "Convective Mass Transfer",
      "Heat & Mass Transfer Analogies",
      "Evaporation Process"
    ]
  }
];