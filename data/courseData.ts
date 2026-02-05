
interface PPTContent {
  body: string;
  equations?: string;
  applications?: string;
  slides: number[];
  visualId?: string;
}

export const COURSE_PPT_DATA: Record<string, PPTContent> = {
  // --- UNIT 1 ---
  "Fourier’s Law of Conduction": {
    slides: [8, 10],
    visualId: "conduction_mechanism",
    body: "Fourier’s law of heat conduction states that the rate of heat conduction is proportional to the area measured normal to the direction of heat flow and to the temperature gradient in that direction. It describes conduction as the transfer of energy from more energetic particles of a substance to adjacent, less energetic ones through particle interactions.\n\n### Mathematical Formulation\nThe law is expressed by the following differential equation for one-dimensional heat conduction:\n\n$$\\dot{Q} = -kA \\frac{dT}{dx}$$\n\n**Where:**\n- **$\\dot{Q}$:** The rate of heat conduction ($W$)\n- **$k$:** The thermal conductivity of the material ($W/m \\cdot K$)\n- **$A$:** The area normal to the direction of heat flow ($m^2$)\n- **$dT/dx$:** The temperature gradient ($K/m$)\n\n### Application in Different Coordinate Systems\n\n**Three-Dimensional Cartesian Coordinates:**\n$$\\dot{Q}_x = -kA_x \\frac{\\partial T}{\\partial x}, \\quad \\dot{Q}_y = -kA_y \\frac{\\partial T}{\\partial y}, \\quad \\dot{Q}_z = -kA_z \\frac{\\partial T}{\\partial z}$$\n\n**Cylindrical Coordinates (Radial):**\n$$\\dot{Q}_{cond,cyl} = -k(2\\pi rL) \\frac{dT}{dr}$$\n\n**Spherical Coordinates (Radial):**\n$$\\dot{Q}_{cond,sph} = -k(4\\pi r^2) \\frac{dT}{dr}$$\n\n### Significance of the Negative Sign\nHeat is always conducted in the direction of decreasing temperature. Because temperature decreases as the distance ($x$) increases, the temperature gradient ($dT/dx$) is mathematically negative in the direction of heat flow. The negative sign is included in the equation to ensure that the calculated heat transfer rate in the positive direction results in a positive quantity.",
    equations: "$$\\dot{Q} = -kA \\frac{dT}{dx}$$",
    applications: "Driving Force: Temperature difference is the driving force for heat transfer, similar to voltage difference in electric current."
  },
  "1D, 2D, and 3D Conduction Equations": {
    slides: [18],
    visualId: "conduction_cube",
    body: "The general equations for heat conduction are derived from an energy balance on a differential volume element, following the principle that the net heat conduction plus heat generated within the element equals the change in the energy content of the element.\n\n### General Form (3D Cartesian)\nFor a material with constant thermal conductivity $k$:\n\n$$\\frac{\\partial^2 T}{\\partial x^2} + \\frac{\\partial^2 T}{\\partial y^2} + \\frac{\\partial^2 T}{\\partial z^2} + \\frac{\\dot{g}}{k} = \\frac{1}{\\alpha} \\frac{\\partial T}{\\partial t}$$\n\n### One-Dimensional (1D) Formulations\n\n**Large Plane Wall (Variable $k$):**\n$$\\frac{\\partial}{\\partial x} \\left( k \\frac{\\partial T}{\\partial x} \\right) + \\dot{g} = \\rho C \\frac{\\partial T}{\\partial t}$$\n\n**Large Plane Wall (Constant $k$):**\n$$\\frac{\\partial^2 T}{\\partial x^2} + \\frac{\\dot{g}}{k} = \\frac{1}{\\alpha} \\frac{\\partial T}{\\partial t}$$\n\n**Long Cylinder:**\n$$\\frac{1}{r} \\frac{\\partial}{\\partial r} \\left( kr \\frac{\\partial T}{\\partial r} \\right) + \\dot{g} = \\rho C \\frac{\\partial T}{\\partial t}$$\n\n**Sphere:**\n$$\\frac{1}{r^2} \\frac{\\partial}{\\partial r} \\left( kr^2 \\frac{\\partial T}{\\partial r} \\right) + \\dot{g} = \\rho C \\frac{\\partial T}{\\partial t}$$\n\n### Vector Form (Laplacian)\nThe equation can be concisely expressed using the Laplacian operator $\\nabla^2$:\n\n$$\\nabla^2 T + \\frac{\\dot{g}}{k} = \\frac{1}{\\alpha} \\frac{\\partial T}{\\partial t}$$\n\n### Classification of Cases\n- **Poisson’s Equation:** $\\nabla^2 T + \\frac{\\dot{g}}{k} = 0$ (Steady-state with generation)\n- **Laplace Equation:** $\\nabla^2 T = 0$ (Steady-state, no generation)\n- **Diffusion (Fourier) Equation:** $\\nabla^2 T = \\frac{1}{\\alpha} \\frac{\\partial T}{\\partial t}$ (Transient, no generation)",
    equations: "$$\\nabla^2 T + \\frac{\\dot{g}}{k} = \\frac{1}{\\alpha} \\frac{\\partial T}{\\partial t}$$",
    applications: "Used in modeling heat generation in nuclear fuel rods, engine cylinder cooling, and electronic board heat sink design."
  },
  "Steady & Unsteady State Conduction": {
    slides: [18, 19],
    body: "Steady state implies $T$ is constant over time. Unsteady state involves time-varying temperatures, often solved using Lumped Heat Capacity analysis.\n\n**Biot Number Definition:**\n$$Bi = \\frac{h L_c}{k}$$\n\nIf $Bi < 0.1$, internal thermal resistance is negligible compared to surface convection.",
    equations: "$$Bi = \\frac{h L_c}{k} < 0.1$$",
    applications: "Quenching of metals and cooling of electronics."
  },
  "Thermal Resistance Network": {
    slides: [70],
    visualId: "resistance_network",
    body: "Heat flow is analogous to electrical current. Thermal resistance accounts for conduction and convection in series or parallel paths.\n\n**Conduction Resistance:**\n$$R_{cond} = \\frac{L}{kA}$$\n\n**Convection Resistance:**\n$$R_{conv} = \\frac{1}{hA}$$",
    equations: "$$R_{total} = R_1 + R_2 + ...$$",
    applications: "Insulated pipe systems and composite wall structures."
  },
  "Composite Walls & Cylinders": {
    slides: [18],
    body: "Multi-layer systems where total resistance is the sum of individual layer resistances.\n\n$$\\dot{Q} = \\frac{T_{hot} - T_{cold}}{\\sum R_i}$$",
    equations: "$$\\dot{Q} = \\frac{T_{\\infty 1} - T_{\\infty 2}}{R_{total}}$$",
    applications: "Furnace design and building envelope analysis."
  },
  "Critical Radius of Insulation": {
    slides: [19],
    visualId: "critical_radius",
    body: "The insulation thickness that maximizes heat loss from a cylinder or sphere. Beyond this, adding insulation reduces heat loss.\n\n**For a Cylinder:**\n$$r_{cr} = \\frac{k}{h}$$\n\n**For a Sphere:**\n$$r_{cr} = \\frac{2k}{h}$$",
    equations: "$$r_{cr} = k/h$$",
    applications: "Insulating small electrical wires vs steam pipes."
  },

  // --- UNIT 2 ---
  "Newton’s Law of Cooling": {
    slides: [17, 30],
    visualId: "convection_mechanism",
    body: "Convection involves heat transfer between a surface and a moving fluid.\n\n$$\\dot{Q} = h A (T_s - T_\\infty)$$\n\nWhere $h$ is the convection heat transfer coefficient ($W/m^2 \\cdot K$).",
    equations: "$$Q = h A (T_s - T_\\infty)$$",
    applications: "Cooling of computer chips and wind-cooled surfaces."
  },
  "Forced vs. Natural Convection": {
    slides: [15, 16],
    visualId: "egg_cooling",
    body: "Forced convection uses external drivers (fans/pumps). Natural convection is driven by buoyancy forces resulting from density gradients.\n\n**Grashof Number (Natural Convection):**\n$$Gr = \\frac{g \\beta (T_s - T_\\infty) L^3}{\\nu^2}$$",
    applications: "Radiators and room ventilation."
  },
  "Hydrodynamic & Thermal Boundary Layers": {
    slides: [33, 34, 35],
    visualId: "boundary_layer",
    body: "Regions near a surface where velocity (hydrodynamic) and temperature (thermal) differ significantly from the bulk fluid.\n\n**Prandtl Number:**\n$$Pr = \\frac{\\nu}{\\alpha}$$",
    equations: "$$Pr = \\nu / \\alpha$$",
    applications: "Aerodynamic surface cooling."
  },
  "Laminar vs. Turbulent Flow": {
    slides: [36],
    visualId: "flow_regimes",
    body: "Laminar flow is orderly; turbulent flow is chaotic. Turbulence significantly enhances the heat transfer coefficient $h$.\n\n**Reynolds Number:**\n$$Re = \\frac{\\rho V D}{\\mu}$$",
    equations: "$$Re = \\frac{\\rho V D}{\\mu}$$",
    applications: "Industrial pipe flow and turbine blade cooling."
  },
  "Dimensionless Numbers (Re, Pr, Nu, Gr)": {
    slides: [32, 37, 38],
    body: "Dimensionless parameters characterize fluid flow and heat transfer efficiency.\n\n**Nusselt Number:**\n$$Nu = \\frac{h L}{k}$$",
    equations: "$$Nu = h L / k$$",
    applications: "Correlating experimental data."
  },
  "Internal & External Flow Correlations": {
    slides: [31, 39, 41],
    body: "Specific empirical equations used to calculate $h$ for flow inside pipes or over flat plates.\n\n**Dittus-Boelter Equation:**\n$$Nu = 0.023 Re^{0.8} Pr^n$$",
    equations: "$$Nu = 0.023 Re^{0.8} Pr^n$$",
    applications: "Heat exchanger tube sizing."
  },

  // --- UNIT 3 ---
  "Pool Boiling Curve & Regimes": {
    slides: [48, 49],
    visualId: "boiling_curve",
    body: "Boiling regimes depend on the excess temperature of the heating surface.\n\n**Critical Heat Flux (CHF):**\n$$\\dot{q}_{max} \\approx 0.149 h_{fg} \\rho_v [\\sigma g (\\rho_l-\\rho_v)/\\rho_v^2]^{0.25}$$",
    equations: "$$q_{max} \\approx 0.18 h_{fg} \\rho_v [\\sigma g (\\rho_l-\\rho_v)/\\rho_v^2]^{0.25}$$",
    applications: "Steam boilers and nuclear reactors."
  },
  "Nucleate vs. Film Boiling": {
    slides: [51, 54],
    visualId: "bubble_dynamics",
    body: "Nucleate boiling is highly efficient; film boiling involves a vapor blanket that insulates the surface.",
    applications: "Cryogenic liquid storage."
  },
  "Film vs. Dropwise Condensation": {
    slides: [58, 59, 62],
    visualId: "condensation_types",
    body: "Dropwise condensation is up to 10 times more effective than film condensation because it keeps the surface exposed.",
    applications: "Steam power plant condensers."
  },
  "Heat Pipe Principle": {
    slides: [44],
    body: "A device that transfers large amounts of heat via evaporation, condensation, and capillary action.",
    applications: "Laptop CPU cooling."
  },
  "Applications in Heat Exchangers": {
    slides: [63, 68, 74, 77],
    visualId: "he_profiles",
    body: "Devices designed to transfer heat between two fluids efficiently.\n\n$$\\dot{Q} = U A \\Delta T_{lm}$$\n\n$$\\Delta T_{lm} = \\frac{\\Delta T_1 - \\Delta T_2}{\\ln(\\Delta T_1 / \\Delta T_2)}$$",
    equations: "$$Q = U A \\Delta T_{lm}$$",
    applications: "Automotive radiators and HVAC coils."
  },

  // --- UNIT 4 ---
  "Blackbody & Gray Body Radiation": {
    slides: [85, 89],
    visualId: "radiation_emission",
    body: "Blackbodies are perfect emitters/absorbers. Gray bodies reflect realistic surface properties.\n\n**Emissivity:**\n$$\\epsilon = \\frac{E}{E_b}$$",
    equations: "$$\\epsilon = E / E_b$$",
    applications: "Solar collector design."
  },
  "Stefan–Boltzmann Law": {
    slides: [22, 86],
    body: "Defines the power radiated by a surface:\n\n$$E_b = \\sigma T^4$$\n\nWhere $\\sigma = 5.67 \\times 10^{-8} W/m^2 \\cdot K^4$.",
    equations: "$$E = \\sigma T^4$$",
    applications: "Radiant heating systems."
  },
  "View Factors (Shape Factors)": {
    slides: [80],
    body: "Geometrical factor accounting for orientation.\n\n**Reciprocity Rule:**\n$$A_i F_{ij} = A_j F_{ji}$$",
    equations: "$$F_{12} = \\frac{1}{A_1} \\int \\int ...$$",
    applications: "Enclosure heat transfer."
  },
  "Radiation Shields": {
    slides: [80],
    body: "Surfaces placed between radiating bodies. With $n$ shields:\n\n$$\\dot{Q}_{with\\,shields} = \\frac{1}{n+1} \\dot{Q}_{no\\,shield}$$",
    equations: "$$Q_{shield} = \\frac{Q_{no\\,shield}}{n+1}$$",
    applications: "Cryogenic insulation (MLI)."
  },
  "Electrical Analogy for Radiation": {
    slides: [80],
    body: "Radiation problems solved using circuit analogies.\n\n**Surface Resistance:**\n$$R_{surf} = \\frac{1-\\epsilon}{\\epsilon A}$$\n\n**Space Resistance:**\n$$R_{space} = \\frac{1}{A_i F_{ij}}$$",
    equations: "$$R_{surf} = (1-\\epsilon) / (\\epsilon A)$$",
    applications: "Furnace enclosure analysis."
  },

  // --- UNIT 5 ---
  "Fick’s Law of Diffusion": {
    slides: [91],
    visualId: "diffusion_tank",
    body: "Mass transfer driven by concentration gradients.\n\n$$J_A = -D_{AB} \\frac{dC_A}{dx}$$",
    equations: "$$J_A = -D_{AB} \\frac{dC_A}{dx}$$",
    applications: "Gas diffusion in membranes."
  },
  "Mass Diffusion Coefficient": {
    slides: [91],
    body: "Quantifies how fast species diffuse through a medium. In gases, $D_{AB} \\propto T^{3/2} / P$.",
    applications: "Doping of semiconductors."
  },
  "Convective Mass Transfer": {
    slides: [91],
    body: "Mass transfer between a surface and a moving fluid.\n\n**Sherwood Number:**\n$$Sh = \\frac{h_m L}{D_{AB}}$$",
    equations: "$$Sh = h_m L / D_{AB}$$",
    applications: "Industrial drying."
  },
  "Heat & Mass Transfer Analogies": {
    slides: [91],
    body: "Mathematical similarities allow using heat transfer correlations for mass transfer.\n- $Nu \\longleftrightarrow Sh$\n- $Pr \\longleftrightarrow Sc$",
    equations: "$$Nu \\rightarrow Sh, \\, Pr \\rightarrow Sc, \\, \\alpha \\rightarrow D_{AB}$$",
    applications: "Modeling complex evaporation scenarios."
  },
  "Evaporation Process": {
    slides: [45, 92],
    body: "Phase change at the surface driven by vapor pressure differences. Dependent on the Schmidt number ($Sc$) and Sherwood number ($Sh$).",
    applications: "Cooling towers and perspiration."
  }
};
