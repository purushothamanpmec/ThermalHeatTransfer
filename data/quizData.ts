
import { UnitId, QuizQuestion } from '../types';

export const HARDCODED_QUIZ_DATA: Record<UnitId, QuizQuestion[]> = {
  [UnitId.CONDUCTION]: [
    {
      id: 1,
      question: "According to Fourier's Law, the rate of heat transfer is proportional to which of the following?",
      options: ["Square of temperature gradient", "Temperature gradient", "Cube root of thickness", "Inverse of area"],
      correctAnswerIndex: 1,
      explanation: "Fourier's Law states Q = -kA(dT/dx), where the heat transfer rate is directly proportional to the temperature gradient (dT/dx).",
      difficulty: 'Easy'
    },
    {
      id: 2,
      question: "What is the critical radius of insulation for a cylindrical pipe?",
      options: ["h/k", "k/h", "2k/h", "sqrt(k/h)"],
      correctAnswerIndex: 1,
      explanation: "For a cylinder, the critical radius is defined as r_cr = k/h. Adding insulation up to this radius actually increases heat transfer.",
      difficulty: 'Medium'
    },
    {
      id: 3,
      question: "In the context of the Biot number (Bi), what does Bi < 0.1 signify?",
      options: ["Convection resistance is negligible", "Internal conduction resistance is negligible", "Radiation is dominant", "The system is in steady state"],
      correctAnswerIndex: 1,
      explanation: "A small Biot number (Bi < 0.1) implies that internal thermal resistance is small compared to surface convection, allowing for Lumped Capacitance analysis.",
      difficulty: 'Medium'
    },
    {
      id: 4,
      question: "Which material typically has the highest thermal conductivity?",
      options: ["Air", "Water", "Copper", "Wood"],
      correctAnswerIndex: 2,
      explanation: "Metals like copper have high thermal conductivity due to the presence of free electrons and lattice vibrations.",
      difficulty: 'Easy'
    },
    {
      id: 5,
      question: "The thermal resistance for a plane wall of thickness L, area A, and conductivity k is:",
      options: ["kA/L", "L/kA", "kL/A", "A/kL"],
      correctAnswerIndex: 1,
      explanation: "Thermal resistance R_cond = L/(kA), analogous to electrical resistance R = L/(σA).",
      difficulty: 'Easy'
    }
  ],
  [UnitId.CONVECTION]: [
    {
      id: 6,
      question: "The Prandtl number (Pr) is the ratio of:",
      options: ["Inertial to viscous forces", "Buoyancy to viscous forces", "Momentum diffusivity to thermal diffusivity", "Convection to conduction"],
      correctAnswerIndex: 2,
      explanation: "Pr = ν/α, which represents the ratio of momentum diffusivity (kinematic viscosity) to thermal diffusivity.",
      difficulty: 'Medium'
    },
    {
      id: 7,
      question: "The Nusselt number (Nu) physically represents:",
      options: ["Ratio of convection to conduction in fluid", "Ratio of inertia to viscosity", "Velocity gradient at surface", "Fluid density"],
      correctAnswerIndex: 0,
      explanation: "Nu = hL/k_f. It is the ratio of convective heat transfer to conductive heat transfer within the fluid layer.",
      difficulty: 'Medium'
    },
    {
      id: 8,
      question: "Which dimensionless number is most critical for analyzing Natural Convection?",
      options: ["Reynolds Number", "Grashof Number", "Peclet Number", "Mach Number"],
      correctAnswerIndex: 1,
      explanation: "The Grashof number (Gr) represents the ratio of buoyancy forces to viscous forces and is the key parameter for free/natural convection.",
      difficulty: 'Easy'
    },
    {
      id: 9,
      question: "For flow over a flat plate, the transition from laminar to turbulent flow usually occurs at a Reynolds number of approximately:",
      options: ["2300", "500,000", "1,000", "10,000,000"],
      correctAnswerIndex: 1,
      explanation: "Re_crit for a flat plate is typically taken as 5 x 10^5.",
      difficulty: 'Medium'
    },
    {
      id: 10,
      question: "Newton's Law of Cooling defines heat transfer as proportional to:",
      options: ["T^4", "Temperature difference (Ts - Tinf)", "Square root of velocity", "Pressure gradient"],
      correctAnswerIndex: 1,
      explanation: "Q = hA(Ts - Tinf). It is linear with respect to the temperature difference.",
      difficulty: 'Easy'
    }
  ],
  [UnitId.BOILING]: [
    {
      id: 11,
      question: "Which regime of the boiling curve provides the highest heat transfer coefficient?",
      options: ["Natural Convection", "Nucleate Boiling", "Transition Boiling", "Film Boiling"],
      correctAnswerIndex: 1,
      explanation: "Nucleate boiling is highly efficient because of the mixing action caused by bubbles rising from the surface.",
      difficulty: 'Easy'
    },
    {
      id: 12,
      question: "The Leidenfrost effect is associated with which boiling regime?",
      options: ["Nucleate", "Subcooled", "Transition/Film", "Natural Convection"],
      correctAnswerIndex: 2,
      explanation: "The Leidenfrost point is the minimum heat flux point in the film boiling regime where a vapor layer supports the liquid.",
      difficulty: 'Medium'
    },
    {
      id: 13,
      question: "Dropwise condensation is generally how much more effective than film condensation?",
      options: ["2 times", "10 times", "Identical", "Less effective"],
      correctAnswerIndex: 1,
      explanation: "Dropwise condensation can be 10 or more times effective because the liquid drops slide off, leaving the surface exposed.",
      difficulty: 'Medium'
    },
    {
      id: 14,
      question: "In a Shell and Tube heat exchanger, baffles are used primarily to:",
      options: ["Support the tubes", "Increase turbulence", "Direct fluid flow", "All of the above"],
      correctAnswerIndex: 3,
      explanation: "Baffles support the tube bundle, create cross-flow for better heat transfer (turbulence), and direct the shell-side fluid.",
      difficulty: 'Easy'
    },
    {
      id: 15,
      question: "The LMTD method is most difficult to apply when:",
      options: ["Flow is parallel", "Flow is counter", "Outlet temperatures are unknown", "Specific heat is constant"],
      correctAnswerIndex: 2,
      explanation: "If outlet temperatures are unknown, LMTD requires iteration. The NTU-Effectiveness method is preferred for such design problems.",
      difficulty: 'Hard'
    }
  ],
  [UnitId.RADIATION]: [
    {
      id: 16,
      question: "The Stefan-Boltzmann Law states that total emissive power of a blackbody is proportional to:",
      options: ["T", "T^2", "T^3", "T^4"],
      correctAnswerIndex: 3,
      explanation: "E_b = σT^4, where T is the absolute temperature in Kelvin.",
      difficulty: 'Easy'
    },
    {
      id: 17,
      question: "What is the emissivity of an ideal Blackbody?",
      options: ["0.0", "0.5", "1.0", "Infinity"],
      correctAnswerIndex: 2,
      explanation: "A blackbody is a perfect emitter and absorber, defined as having an emissivity (ε) of 1.",
      difficulty: 'Easy'
    },
    {
      id: 18,
      question: "The View Factor Reciprocity Relation for surfaces 1 and 2 states:",
      options: ["F12 = F21", "A1 F12 = A2 F21", "F11 + F12 = 1", "A1 F21 = A2 F12"],
      correctAnswerIndex: 1,
      explanation: "The reciprocity rule is A1F12 = A2F21. It is fundamental for radiation geometry calculations.",
      difficulty: 'Medium'
    },
    {
      id: 19,
      question: "Kirchhoff's Law of Radiation states that for a surface in thermal equilibrium:",
      options: ["Emissivity equals absorptivity", "Reflectivity equals 1", "Transmissivity is zero", "Heat flux is constant"],
      correctAnswerIndex: 0,
      explanation: "Kirchhoff's Law: ε = α at a given temperature and wavelength.",
      difficulty: 'Medium'
    },
    {
      id: 20,
      question: "Adding 'n' radiation shields of same emissivity effectively reduces heat transfer by a factor of:",
      options: ["n", "n^2", "n + 1", "2n"],
      correctAnswerIndex: 2,
      explanation: "Q_with_shields = Q_without / (n + 1).",
      difficulty: 'Hard'
    }
  ],
  [UnitId.MASS_TRANSFER]: [
    {
      id: 21,
      question: "Fick's First Law of Diffusion states that mass flux is proportional to:",
      options: ["Velocity gradient", "Pressure gradient", "Concentration gradient", "Temperature gradient"],
      correctAnswerIndex: 2,
      explanation: "J = -D(dC/dx). Mass transfer is driven by the concentration gradient.",
      difficulty: 'Easy'
    },
    {
      id: 22,
      question: "The Schmidt Number (Sc) is the mass transfer analogue of which heat transfer parameter?",
      options: ["Nusselt Number", "Reynolds Number", "Prandtl Number", "Grashof Number"],
      correctAnswerIndex: 2,
      explanation: "Sc = ν/D_AB. Like Pr = ν/α, it relates momentum diffusivity to molecular diffusivity.",
      difficulty: 'Medium'
    },
    {
      id: 23,
      question: "The Sherwood Number (Sh) is analogous to:",
      options: ["Nusselt Number", "Biot Number", "Stanton Number", "Fourier Number"],
      correctAnswerIndex: 0,
      explanation: "Sh = h_m L / D_AB, analogous to Nu = hL/k. It represents dimensionless convective mass transfer.",
      difficulty: 'Medium'
    },
    {
      id: 24,
      question: "Lewis Number (Le) is defined as:",
      options: ["Sc / Pr", "Pr / Sc", "Re * Pr", "Sc * Re"],
      correctAnswerIndex: 0,
      explanation: "Le = Sc/Pr = α/D_AB. It relates thermal diffusivity to mass diffusivity.",
      difficulty: 'Hard'
    },
    {
      id: 25,
      question: "In a binary gas mixture, the diffusion coefficient D_AB usually:",
      options: ["Increases with Temperature", "Decreases with Temperature", "Remains constant", "Is independent of Pressure"],
      correctAnswerIndex: 0,
      explanation: "D_AB is proportional to T^1.5 in gases, meaning diffusion is faster at higher temperatures.",
      difficulty: 'Medium'
    }
  ]
};
