/**
 * Why each cost in the inventory exists: the law, court ruling, precedent, or
 * history that put it in place, plus the readable URL slug for its page.
 *
 * Keyed by inventory id (see cost-inventory.ts). Every inventory item must have
 * an entry; cost-inventory.ts throws at build time if one is missing.
 */

export type CostOrigin = {
  /** URL slug for /costs/[slug]. Lowercase words joined by hyphens. */
  slug: string
  /** Why this cost exists: the law, precedent, or history behind it. */
  why: string
}

// ---------------------------------------------------------------- shared texts
const HOSPITAL = `Hospitals became the center of American medicine after World War II. The Hill-Burton Act of 1946 paid for thousands of new community hospitals, and when Medicare and Medicaid arrived in 1965 they paid hospitals whatever their "reasonable costs" were, which rewarded expansion. Congress replaced that in 1983 with fixed payments per diagnosis (DRGs), but private insurers still negotiate prices hospital by hospital, which is why the same procedure can cost several times more at one hospital than another. EMTALA (1986) requires every hospital with an emergency department to screen and stabilize anyone who arrives, insured or not, so unpaid care is folded into the prices charged to everyone else.`

const NURSING_HOME = `Before 1965, poor elderly people who could not live alone ended up in county poorhouses. Medicare (1965) pays only for short skilled-nursing stays after a hospital admission; long custodial stays were left to Medicaid, which pays only after a resident has spent nearly all their savings. That split is why Medicaid is the largest payer and families pay so much out of pocket. After reports of widespread neglect, the Nursing Home Reform Act (part of OBRA 1987) set federal standards for staffing, training, and residents' rights; wages stay low because they are set largely by state Medicaid rates.`

const AIDES = `Home care aides were excluded from federal minimum-wage and overtime protection by the "companionship services" exemption added to the Fair Labor Standards Act in 1974, on the theory that they were like babysitters. The Labor Department extended those protections to agency-employed aides in a rule that took effect in 2015. Most aide pay comes from Medicaid home- and community-based services, so state Medicaid rates effectively set the wage; a 2024 Medicaid rule will require, from 2030, that a minimum share of those payments go to workers' pay.`

const PUBLIC_HEALTH = `Public health is one of the oldest government health roles. States hold it under their "police power" to protect public welfare, which the Supreme Court upheld for vaccine mandates in Jacobson v. Massachusetts (1905); Massachusetts set up the first state board of health in 1869. The federal role grew from the Marine Hospital Service (1798) into the Public Health Service, and the CDC was founded in 1946. Funding is mostly state and local, topped up by federal grants and one-off surges such as pandemic aid, which is why it rises and falls with emergencies.`

const RESEARCH = `Federal medical research began with a one-room Hygienic Laboratory in 1887, renamed the National Institute of Health by the Ransdell Act of 1930. After World War II, Vannevar Bush's report "Science, the Endless Frontier" (1945) convinced Congress to fund basic research on a large scale, and NIH grew into the world's largest public funder of biomedical research. The Bayh-Dole Act of 1980 lets universities patent and license discoveries made with federal money, which is how much publicly funded science reaches private drug companies.`

const CAPITAL = `The Hill-Burton Act of 1946 paid for hospital construction in exchange for a promise of charity care, and Medicare reimbursed hospitals' capital costs as a pass-through on top of their other payments until 1991, which encouraged building and buying equipment. To curb duplication, the National Health Planning and Resources Development Act of 1974 required states to adopt "certificate of need" laws that make providers get permission before building or buying big equipment; Congress repealed the requirement in 1987, but many states still have such laws.`

const ESI_HISTORY = `Job-based coverage is an accident of World War II. The Stabilization Act of 1942 froze wages, but the War Labor Board ruled that fringe benefits such as health insurance did not count, so employers competed for scarce workers with benefits. An IRS ruling in 1943 and the Internal Revenue Code of 1954 made employer-paid premiums tax-free to workers, now the largest tax break in the code, and a 1948 labor-board ruling (upheld in Inland Steel, 1949) made benefits a subject of union bargaining.`

const PAYROLL_TAX = `Medicare's hospital insurance (Part A) has been funded by a payroll tax since the Social Security Amendments of 1965, split equally between employer and worker, so working-age people prepay for coverage they receive at 65. The tax originally applied only up to a wage cap; Congress removed the cap in 1993 (effective 1994), and the ACA added an extra tax on high earners' wages from 2013.`

const MEDICAID_MATCH = `Medicaid was created by the Social Security Amendments of 1965 as a joint federal-state program. Each state runs its own program within federal rules, and Washington pays a matching share of costs set by a formula (FMAP) that pays poorer states more. The ACA (2010) extended Medicaid to low-income adults with a higher federal match, and the Supreme Court made that expansion optional in NFIB v. Sebelius (2012), which is why coverage differs so much by state.`

const BUY_IN = `Low-income Medicare beneficiaries often cannot afford Medicare's premiums and cost sharing, so Congress created the Medicare Savings Programs, under which Medicaid pays them: the Qualified Medicare Beneficiary program in the Medicare Catastrophic Coverage Act of 1988 (the part of that law that survived its repeal), extended to people with somewhat higher incomes in 1990 and 1997. States "buy in" to Medicare for these dual-eligible enrollees, with the cost split between federal and state governments as in the rest of Medicaid.`

const CLAIMS = `Every insurer reviews and pays claims under its own rules, and insurance is regulated by each state (the McCarran-Ferguson Act of 1945 left it to them), so there is no single rulebook. The ACA (2010) added required internal and external appeals, and prior authorization and denial reviews keep growing. Each payer needs its own staff to check eligibility, coding, and medical necessity, and providers hire matching staff to fight denials.`

const PBM = `Pharmacy benefit managers began in the 1960s and 1970s as claims processors for drug plans. They became the middlemen of the drug market when Medicare Part D (2006) was built entirely on private plans, and through mergers the three largest now control most prescriptions and own their own mail-order and specialty pharmacies. Their pay is tied to rebates and spreads they negotiate, which is opaque to employers and patients; the FTC opened a formal study in 2022 and found the largest PBMs steered patients to their own pharmacies and marked up specialty drugs.`

// ---------------------------------------------------------------- entries
export const COST_ORIGINS: Record<string, CostOrigin> = {
  // ------------------------------------------------ National spending by service
  "nhe-hospital": { slug: "hospital-care", why: HOSPITAL },
  "nhe-physicianClinical": {
    slug: "physician-and-clinical-services",
    why: `Doctors in the U.S. have been paid fee-for-service since before insurance existed, and the physician-run Blue Shield plans (from 1939) and Medicare Part B (1965) kept that model, paying "usual, customary and reasonable" fees. Congress replaced those fees with the Resource-Based Relative Value Scale in OBRA 1989 (in use from 1992), with an American Medical Association committee recommending how much each service is worth; private insurers largely peg their rates to it. Medicare began covering ambulatory surgery centers in 1982, starting the shift of procedures out of hospitals into the clinics counted here.`,
  },
  "nhe-otherProfessional": {
    slug: "other-professional-services",
    why: `State licensing laws created separate professions (physical therapy, chiropractic, optometry, podiatry, counseling), and coverage was added for each one at a time. Medicare added chiropractic care in the Social Security Amendments of 1972, and it began paying marriage and family therapists and mental-health counselors only in 2024 under the Consolidated Appropriations Act, 2023. Mental-health parity laws (1996 and 2008) and the ACA's essential health benefits (2010) pushed private plans to cover therapy on the same terms as medical care.`,
  },
  "nhe-dental": {
    slug: "dental-services",
    why: `Dentistry grew up apart from medicine: the first dental college opened in Baltimore in 1840, separate from medical schools, and dental insurance grew later as a separate product from union contracts in the 1950s and 1960s. The Medicare law of 1965 expressly excludes routine dental care, Medicaid makes adult dental coverage optional for states (children's dental care has been required since the EPSDT benefit of 1967), and the ACA made only children's dental an essential benefit. That is why so much dental spending is out of pocket.`,
  },
  "nhe-otherResidential": {
    slug: "home-and-community-care",
    why: `OBRA 1981 created Medicaid "1915(c) waivers," letting states pay for care at home and in the community instead of only in institutions. In Olmstead v. L.C. (1999) the Supreme Court ruled that the Americans with Disabilities Act requires states to serve people in the community when they can live there, which accelerated this spending. Medicaid's "IMD exclusion" (1965), which bars payment for adults in large psychiatric facilities, shaped the residential mental-health and addiction care also counted here. Medicaid pays most of this line because private insurance and Medicare never covered long-term supports.`,
  },
  "nhe-homeHealth": {
    slug: "home-health-care",
    why: `Medicare has covered home health since 1965 as care after a hospital stay. The Omnibus Reconciliation Act of 1980 removed the prior-hospitalization requirement and visit limits, and after a 1987–88 class action (Duggan v. Bowen) forced Medicare to loosen its coverage rules, spending grew by double digits every year until 1997; the Balanced Budget Act of 1997 then cut payments sharply, closing many agencies, and moved home health to a fixed per-episode prospective payment system in 2000. Medicare's 2020 payment model (PDGM) changed again how agencies are paid.`,
  },
  "nhe-nursing": { slug: "nursing-facilities", why: NURSING_HOME },
  "nhe-prescriptionDrugs": {
    slug: "retail-prescription-drugs",
    why: `Manufacturers set drug prices, protected by patents and by the FDA's market exclusivity; the Hatch-Waxman Act of 1984 created today's generic-drug pathway and patent extensions. Medicare did not cover outpatient drugs at all until the Medicare Modernization Act of 2003 created Part D (2006), which barred Medicare from negotiating prices until the Inflation Reduction Act of 2022 allowed negotiation for a limited set of drugs. Medicaid gets mandatory rebates under OBRA 1990. Pharmacy benefit managers negotiate confidential rebates for everyone else, which is why list prices and net prices diverge.`,
  },
  "nhe-durableEquipment": {
    slug: "durable-medical-equipment",
    why: `The Medicare law of 1965 expressly excludes eyeglasses and hearing aids, and most private plans followed, so much of this line is paid out of pocket. Medicare began competitive bidding for equipment such as wheelchairs and oxygen (authorized in 2003, started in 2011) after paying far above retail prices. In 2022 the FDA created an over-the-counter category for hearing aids, as Congress required in 2017, to bring prices down.`,
  },
  "nhe-otherNonDurable": {
    slug: "over-the-counter-products",
    why: `Under the FDA's over-the-counter monograph system (from 1972), many medicines can be sold without a prescription, which also puts them outside insurance coverage. The Durham-Humphrey Amendment of 1951 is what drew the line between prescription and non-prescription drugs. The CARES Act of 2020 modernized the monograph rules and let health savings and flexible spending accounts pay for these products without a prescription, but most is still paid out of pocket.`,
  },
  "nhe-governmentAdministration": {
    slug: "government-administration",
    why: `This is the cost of running public programs. To win hospitals' support, the 1965 Medicare law let private companies (mostly Blue Cross and Blue Shield plans) process claims as "fiscal intermediaries" and "carriers," replaced in 2003 by competitively bid Medicare Administrative Contractors. The agency that runs Medicare and Medicaid was created in 1977 as HCFA and renamed CMS in 2001. States run Medicaid themselves, and Washington matches their administrative costs, at higher rates for computer systems, which is why Medicaid's share of this line is large.`,
  },
  "nhe-netCostOfInsurance": {
    slug: "net-cost-of-insurance",
    why: `Private insurance grew from the Baylor hospital plan of 1929, which became Blue Cross, and the McCarran-Ferguson Act of 1945 left its regulation to the states, so there are hundreds of insurers with their own rules. Each charges for administration, marketing, broker commissions, taxes, and profit on top of the care it pays for. The ACA's medical loss ratio rule (2011) caps that overhead as a share of premiums. Public programs add their own private-plan overhead: Medicare Advantage (rooted in the 1982 TEFRA risk contracts and the 2003 MMA) and Medicaid managed care, which the Balanced Budget Act of 1997 let states require.`,
  },
  "nhe-publicHealth": { slug: "public-health-spending", why: PUBLIC_HEALTH },
  "nhe-research": { slug: "research-spending", why: RESEARCH },
  "nhe-structures": { slug: "construction-and-equipment-spending", why: CAPITAL },

  // ------------------------------------------------ Who pays
  "pay-bizEsi": {
    slug: "employer-premiums",
    why: `${ESI_HISTORY} ERISA (1974) then exempted employer plans that pay claims themselves from state insurance rules, letting large employers design one plan nationwide. Since 2015 the ACA has penalized large employers that do not offer affordable coverage. Economists find that most of this employer share is paid in the end by workers through lower wages.`,
  },
  "pay-bizHi": { slug: "employer-medicare-payroll-tax", why: PAYROLL_TAX },
  "pay-bizOther": {
    slug: "workers-comp-and-worksite-care",
    why: `Workers' compensation was the first U.S. social insurance. Starting with Wisconsin in 1911 and spreading to every state by 1948, these laws struck a "grand bargain": employers pay injured workers' medical bills and lost wages regardless of fault, and workers give up the right to sue. A handful of states (California, New York, New Jersey, Rhode Island, Hawaii) and Puerto Rico also require temporary disability insurance, and some employers run worksite clinics to cut absences and claims.`,
  },
  "pay-hhEsi": {
    slug: "worker-premiums",
    why: `${ESI_HISTORY} Workers' own contributions became tax-free too once the Revenue Act of 1978 created "cafeteria plans" (section 125) that let them pay premiums from pre-tax pay. Since the 1980s employers have shifted a growing share of premiums, especially for family coverage, onto workers.`,
  },
  "pay-hhDirect": {
    slug: "individual-insurance",
    why: `For decades insurers in the individual market could reject or surcharge people with pre-existing conditions. HIPAA (1996) guaranteed renewal, and the ACA (2010, in force from 2014) created the marketplaces, required insurers to sell to everyone at community-rated prices, and added income-based premium tax credits. This line is what households pay after those subsidies. The Tax Cuts and Jobs Act of 2017 reduced the individual-mandate penalty to zero from 2019.`,
  },
  "pay-hhPc": {
    slug: "auto-and-property-medical-coverage",
    why: `Starting with Massachusetts in 1971, many states adopted "no-fault" auto insurance laws that require personal injury protection, so a driver's own policy pays medical bills after a crash regardless of who caused it. Homeowners' and other liability policies also pay medical costs for injuries on a property. The Medicare Secondary Payer law (1980) requires these policies to pay before Medicare does.`,
  },
  "pay-hhHi": {
    slug: "worker-medicare-payroll-tax",
    why: `${PAYROLL_TAX} The self-employed pay both the employer and the worker halves under the Self-Employment Contributions Act.`,
  },
  "pay-hhSmi": {
    slug: "medicare-part-b-and-d-premiums",
    why: `Medicare Part B (doctor and outpatient care) was created in 1965 as voluntary coverage with a monthly premium, the rest paid from general federal revenue; since the Balanced Budget Act of 1997 the standard premium has been set to cover about a quarter of program costs. Part D (drugs), created by the Medicare Modernization Act of 2003, also charges premiums. Higher-income enrollees have paid income-related surcharges since 2007 for Part B and since 2011 for Part D.`,
  },
  "pay-hhOop": {
    slug: "out-of-pocket",
    why: `Cost sharing is designed in: the RAND Health Insurance Experiment, begun in 1971, found that people use less care when they pay part of the bill, though they cut necessary care as well as unnecessary care. High-deductible plans spread after the Medicare Modernization Act of 2003 created health savings accounts. The ACA (2010) capped yearly out-of-pocket costs for private plans and banned lifetime limits, but traditional Medicare has no cap on its own (the Inflation Reduction Act of 2022 capped Part D drug costs from 2025). Uninsured people and services nobody covers, such as most adult dental and over-the-counter products, add the rest.`,
  },
  "pay-otherPrivate": {
    slug: "philanthropy-and-investment-income",
    why: `Charitable gifts have been tax-deductible since 1917, and most hospitals are nonprofits exempt from income and property taxes. In 1969 the IRS (Revenue Ruling 69-545) dropped the requirement that tax-exempt hospitals provide charity care in favor of a looser "community benefit" standard; the ACA (2010) added rules on financial assistance policies and community health needs assessments. This line also counts hospitals' investment income and privately funded research.`,
  },
  "pay-fedEsi": {
    slug: "federal-employee-premiums",
    why: `The Federal Employees Health Benefits Act of 1959 created FEHB (in effect from 1960): the government pays most of the premium and employees choose among competing private plans. That design became the model for Medicare Part D and the ACA marketplaces. The Postal Service Reform Act of 2022 moved postal workers into a separate program within it.`,
  },
  "pay-fedHi": {
    slug: "federal-employer-medicare-tax",
    why: `Federal employees originally had their own retirement system and paid no Social Security or Medicare tax. The Tax Equity and Fiscal Responsibility Act of 1982 extended the Medicare payroll tax to federal workers from 1983, and the government as employer pays its matching half. ${PAYROLL_TAX}`,
  },
  "pay-fedMedicare": {
    slug: "medicare-general-revenue",
    why: `Only Medicare Part A has a dedicated payroll tax. The 1965 law funded Part B mostly from general federal revenue, and Part D (2003) was funded the same way, so a growing share of Medicare comes from income taxes and borrowing rather than its trust funds. When Part A spends more than its payroll taxes bring in, it draws down its trust fund. The 2003 law requires a "funding warning" when general revenue passes a set share of Medicare's total, and the trustees have issued one most years since.`,
  },
  "pay-fedMedicaid": {
    slug: "federal-medicaid-share",
    why: `${MEDICAID_MATCH} The 2025 budget law adds work requirements and more frequent eligibility checks for expansion adults from 2027 and limits the provider taxes states use to fund their share.`,
  },
  "pay-fedBuyIn": { slug: "federal-medicare-buy-in", why: BUY_IN },
  "pay-fedRds": {
    slug: "retiree-drug-subsidy",
    why: `When Medicare Part D began in 2006, Congress worried employers would drop drug coverage for their retirees and push them onto Medicare. The Medicare Modernization Act of 2003 therefore pays employers a subsidy for keeping equivalent coverage. The ACA (2010) ended the tax deduction for the subsidized portion, and most employers have since moved retirees into Part D plans instead, so the program has shrunk to almost nothing.`,
  },
  "pay-fedPrograms": {
    slug: "va-military-chip-and-indian-health",
    why: `Each program has its own history. Veterans' hospitals grew after World War I (the VA was formed in 1930) and the MISSION Act of 2018 expanded paid care outside VA facilities. Military families are covered by TRICARE, which grew out of CHAMPUS (1966). CHIP was created by the Balanced Budget Act of 1997 for children in families earning too much for Medicaid. The Indian Health Service carries out treaty obligations to tribes under the Snyder Act of 1921 and the Indian Health Care Improvement Act of 1976.`,
  },
  "pay-fedPublicHealth": { slug: "federal-public-health", why: PUBLIC_HEALTH },
  "pay-fedOther": {
    slug: "other-federal-programs",
    why: `A collection of smaller federal programs created one at a time to fill specific gaps, such as the Maternal and Child Health block grant (Title V of the Social Security Act of 1935), community health centers (from the 1965 War on Poverty), the Ryan White HIV/AIDS Program (1990), and workers' compensation for federal employees (1916).`,
  },
  "pay-fedMarketplace": {
    slug: "aca-marketplace-subsidies",
    why: `The Affordable Care Act (2010) created income-based premium tax credits and cost-sharing reductions for people buying their own coverage, starting in 2014. The American Rescue Plan Act of 2021 made the credits larger and available to more people, and the Inflation Reduction Act extended that through 2025; the enhancement then expired. In 2017 the administration stopped paying insurers for cost-sharing reductions, and insurers responded by raising silver-plan premiums ("silver loading"), which increased the tax credits.`,
  },
  "pay-slEsi": {
    slug: "state-and-local-employee-premiums",
    why: `${ESI_HISTORY} Teachers, police, and other public workers won generous benefits through public-sector bargaining from the 1960s on, often including retiree health coverage. Government plans are exempt from ERISA, so states regulate their own. Accounting rules since 2004 (GASB 45, now GASB 75) make governments report retiree health promises as liabilities.`,
  },
  "pay-slHi": {
    slug: "state-and-local-medicare-tax",
    why: `State and local governments were originally outside Medicare's payroll tax. The Consolidated Omnibus Budget Reconciliation Act of 1985 (COBRA) required it for state and local employees hired after March 1986, and governments as employers pay the matching half. ${PAYROLL_TAX}`,
  },
  "pay-slMedicaid": {
    slug: "state-medicaid-share",
    why: `${MEDICAID_MATCH} States pay the non-federal share from their budgets, where Medicaid is often the largest item, and partly from taxes on hospitals and other providers, which federal law has limited since 1991. The 2025 budget law tightens those provider-tax limits.`,
  },
  "pay-slBuyIn": { slug: "state-medicare-buy-in", why: BUY_IN },
  "pay-slPrograms": {
    slug: "state-and-local-health-programs",
    why: `Local governments have run hospitals for the poor since colonial almshouses (New York's Bellevue traces to 1736), and states built mental hospitals in the 19th century. Counties still fund public hospitals and indigent-care programs, and states pay their share of CHIP (created in 1997) and of other programs that fill gaps in insurance.`,
  },
  "pay-slPublicHealth": { slug: "state-and-local-public-health", why: PUBLIC_HEALTH },
  "pay-slOther": {
    slug: "other-state-and-local-programs",
    why: `Smaller programs states and localities created over time to fill specific gaps, such as school health services, maternal and child health, vocational rehabilitation, and workers' compensation for their own employees.`,
  },

  // ------------------------------------------------ Occupations
  "occ-29-1210": {
    slug: "physicians",
    why: `The Flexner Report of 1910 led to the closing of many U.S. medical schools and tied medical training to universities, raising standards and limiting supply; state licensing laws keep it that way. Since 1965 Medicare has paid for most residency training, and the Balanced Budget Act of 1997 capped the number of residents it funds, which has limited how many new doctors can be trained. Pay is set largely by fee schedules built on Medicare's relative value scale, which rewards procedures over time spent with patients.`,
  },
  "occ-29-1215": {
    slug: "family-medicine-physicians",
    why: `Family medicine became a board-certified specialty in 1969 to replace the vanishing general practitioner. It pays less than most specialties because Medicare's relative value scale (1992), and the specialist-heavy AMA committee that updates it, values procedures above office visits. The ACA's primary-care bonus (2011–2015) and Medicare's 2021 increase in payment for office visits narrowed but did not close the gap, which is one reason fewer graduates choose primary care.`,
  },
  "occ-29-1216": {
    slug: "internal-medicine-physicians",
    why: `General internists were once the main adult primary-care doctors, but many now subspecialize or work as hospitalists, a role that spread after 1996, because subspecialties pay more under Medicare's relative value scale. The same payment history that shapes family medicine (the 1992 fee schedule, the 2021 office-visit increase) shapes their pay.`,
  },
  "occ-29-1221": {
    slug: "pediatricians",
    why: `Medicaid and CHIP cover a large share of U.S. children, and Medicaid has historically paid doctors well below Medicare. The ACA raised Medicaid primary-care fees to Medicare levels for 2013 and 2014, then the increase expired in most states. That payer mix is why pediatricians earn less than most physicians.`,
  },
  "occ-29-1223": {
    slug: "psychiatrists",
    why: `After the Community Mental Health Act of 1963 the country closed most state psychiatric hospitals, but the community system meant to replace them was never fully funded. Parity laws (1996 and 2008) require insurers to cover mental health on equal terms, yet insurer networks pay psychiatrists relatively little, so many do not accept insurance at all. That is why access is poor even though pay is high.`,
  },
  "occ-29-1211": {
    slug: "anesthesiologists",
    why: `Anesthesia became a physician specialty in the 1940s. Medicare pays it on its own time-based conversion factor rather than the main fee schedule, and private rates run far above Medicare. Out-of-network anesthesia bills were a leading cause of surprise billing, which the No Surprises Act (2020, effective 2022) banned, and private-equity roll-ups of anesthesia groups drew an FTC antitrust suit in 2023.`,
  },
  "occ-29-1240": {
    slug: "surgeons",
    why: `Surgical training takes at least five years after medical school, and Medicare's relative value scale (1992) pays procedures generously, with a single "global" payment covering the operation and follow-up visits. Private insurers pay multiples of Medicare for the same codes, which keeps surgical pay among the highest of any occupation.`,
  },
  "occ-29-1141": {
    slug: "registered-nurses",
    why: `North Carolina passed the first nurse registration law in 1903, and nursing training moved from hospital-run diploma schools to colleges over the 20th century, helped by federal funding in the Nurse Training Act of 1964. Hospitals employ most nurses, and neither Medicare nor insurers pay for nursing separately; it is bundled into the hospital's payment, so nurses are a cost to be managed. California is the only state with legal nurse-to-patient ratios (enacted 1999, in force 2004).`,
  },
  "occ-29-1171": {
    slug: "nurse-practitioners",
    why: `The nurse practitioner role was created at the University of Colorado in 1965 to extend primary care to underserved children. The Rural Health Clinic Services Act of 1977 and the Balanced Budget Act of 1997 let them bill Medicare directly, at a discount to physicians. How much they may do without a physician is set by state scope-of-practice laws, which vary widely and are fought over by medical societies.`,
  },
  "occ-29-1151": {
    slug: "nurse-anesthetists",
    why: `Nurses have given anesthesia since the Civil War, making this the oldest advanced nursing specialty. Medicare requires physician supervision, but since 2001 states can opt out of that rule, and many rural hospitals depend on nurse anesthetists working alone. Their pay is high because anesthesia is paid well under Medicare and private insurance.`,
  },
  "occ-29-1071": {
    slug: "physician-assistants",
    why: `The first physician assistant program opened at Duke in 1965 to train returning Navy corpsmen to relieve a doctor shortage. The Balanced Budget Act of 1997 let them bill Medicare in all settings, at a discount to physicians, and state laws set how closely a physician must supervise them.`,
  },
  "occ-29-2061": {
    slug: "licensed-practical-nurses",
    why: `Practical nursing grew during the nurse shortages of World War II as a shorter, one-year training path, and by the 1950s most states licensed it. LPNs now work mostly in nursing homes and home care, where pay is set largely by Medicaid rates.`,
  },
  "occ-31-1131": {
    slug: "nursing-assistants",
    why: `The Nursing Home Reform Act (part of OBRA 1987) requires nursing homes to use certified nursing assistants with a minimum amount of training and a competency exam, after reports of widespread neglect. Their wages are low because nursing homes are paid mostly by Medicaid. A 2024 federal minimum-staffing rule for nursing homes was struck down in court and blocked by Congress in 2025.`,
  },
  "occ-31-1120": { slug: "home-health-aides", why: AIDES },
  "occ-29-1051": {
    slug: "pharmacists",
    why: `The Durham-Humphrey Amendment of 1951 created the prescription-only category, which channels most medicines through a pharmacist. The profession moved to a six-year Doctor of Pharmacy as the only entry degree in the 2000s, raising pay. Medicare does not recognize pharmacists as providers who can bill for clinical services, so most pharmacist pay still comes from dispensing margins squeezed by pharmacy benefit managers.`,
  },
  "occ-29-2052": {
    slug: "pharmacy-technicians",
    why: `As prescription volume grew, states let technicians do more dispensing work under a pharmacist's supervision, with national certification available since 1995. Their wages track the thin dispensing margins pharmacies are paid by pharmacy benefit managers.`,
  },
  "occ-29-1021": {
    slug: "dentists",
    why: `Dentistry has been trained and licensed separately from medicine since the first dental college opened in 1840. Dental therapists, a lower-cost provider used in other countries, were introduced in Alaska tribal communities in 2005 and Minnesota in 2009 but are opposed by dental associations in most states, which keeps dentists as nearly the only providers.`,
  },
  "occ-29-1292": {
    slug: "dental-hygienists",
    why: `Alfred Fones trained the first dental hygienists in Connecticut in 1913 to provide preventive cleanings. Most states still require them to work under a dentist's supervision, which limits independent practice in places without a dentist.`,
  },
  "occ-31-9091": {
    slug: "dental-assistants",
    why: `Dental assistants are mostly trained on the job; each state sets which tasks they may do. Their pay follows dental practice revenue, much of it paid out of pocket because Medicare excludes routine dental care.`,
  },
  "occ-29-1041": {
    slug: "optometrists",
    why: `States began licensing optometrists in the early 1900s, and over time state laws expanded their scope to diagnosing eye disease and prescribing drugs. Medicare began treating optometrists as physicians for the eye services they are licensed to provide in the 1980s.`,
  },
  "occ-29-2081": {
    slug: "opticians",
    why: `The FTC's Eyeglass Rule (1978) requires eye doctors to hand patients their prescriptions so they can shop for glasses elsewhere, and the Fairness to Contact Lens Consumers Act (2003) did the same for contacts. Because Medicare excludes eyeglasses, most of what opticians sell is paid out of pocket.`,
  },
  "occ-29-1181": {
    slug: "audiologists",
    why: `Audiology grew after World War II to treat veterans' hearing loss. Medicare covers diagnostic hearing tests but has excluded hearing aids since 1965. In 2022 the FDA created an over-the-counter category for hearing aids, as Congress required in 2017, opening the market beyond audiologists' offices.`,
  },
  "occ-31-9092": {
    slug: "medical-assistants",
    why: `Medical assistants grew with physician offices and the paperwork insurance creates: rooming patients, entering records, handling referrals. Most states do not license them, so practices can train them on the job. Medicare's electronic health record incentive program (2009) let credentialed assistants enter orders, expanding the role.`,
  },
  "occ-29-1123": {
    slug: "physical-therapists",
    why: `Physical therapy grew from World War I "reconstruction aides" and the polio epidemics. The Balanced Budget Act of 1997 capped Medicare therapy spending per patient; Congress repealed the caps in 2018. Every state now lets patients see a physical therapist without a physician referral in at least some cases.`,
  },
  "occ-31-2021": {
    slug: "physical-therapist-assistants",
    why: `The assistant role was created in the late 1960s to extend therapists' reach at lower cost. Since 2022 Medicare has paid less for services delivered by assistants than by therapists, under the Bipartisan Budget Act of 2018.`,
  },
  "occ-29-1122": {
    slug: "occupational-therapists",
    why: `Occupational therapy was founded as a profession in 1917 and grew with World War I rehabilitation. Medicare covers it in hospitals, nursing homes, home health, and outpatient settings, and the same per-patient caps that applied to physical therapy (1997–2018) applied to it.`,
  },
  "occ-29-1126": {
    slug: "respiratory-therapists",
    why: `Respiratory therapy grew out of oxygen and "iron lung" care during the polio era and the spread of mechanical ventilators in intensive care units. Nearly every state now licenses the role. It is paid inside hospital payments, not billed separately.`,
  },
  "occ-29-2034": {
    slug: "radiologic-technologists",
    why: `The role dates to the discovery of X-rays in 1895. Medicare's open-ended payment for imaging fueled a boom in scans in the 1990s and 2000s, and the Deficit Reduction Act of 2005 cut payment for imaging done in doctors' offices. Federal standards for training were set in the Consumer-Patient Radiation Health and Safety Act of 1981; states decide whether to license.`,
  },
  "occ-29-2010": {
    slug: "lab-technologists",
    why: `After reports of misread Pap smears, the Clinical Laboratory Improvement Amendments of 1988 (CLIA) set federal quality and personnel standards for every lab testing human samples. The Protecting Access to Medicare Act of 2014 reset Medicare lab prices to market rates, and testing has consolidated into a few national companies.`,
  },
  "occ-29-2055": {
    slug: "surgical-technologists",
    why: `Operating-room technicians were trained by the military in World War II and became a civilian profession afterward. Some states require certification. Their pay sits inside hospital and surgery-center payments.`,
  },
  "occ-29-2040": {
    slug: "emts-and-paramedics",
    why: `Modern EMS began after a 1966 National Academy of Sciences report called accidental death "the neglected disease of modern society"; the Highway Safety Act (1966) and the EMS Systems Act (1973) funded it. Medicare and most insurers pay for ambulance transport, not for treating someone on scene, and many services are run by fire departments or volunteers, which keeps pay low. Ground ambulances were left out of the No Surprises Act's protections.`,
  },
  "occ-19-3033": {
    slug: "psychologists",
    why: `Clinical psychology grew after World War II, when the VA funded training to treat returning veterans. States license psychologists, and Medicare began paying them directly in OBRA 1989. Parity laws (1996 and 2008) expanded private coverage, but low network rates lead many to work outside insurance.`,
  },
  "occ-21-1018": {
    slug: "behavioral-health-counselors",
    why: `Virginia licensed professional counselors first in 1976 and every state now does. Medicare did not pay mental-health counselors until 2024 (Consolidated Appropriations Act, 2023). The opioid crisis and the SUPPORT Act of 2018 expanded addiction treatment, but much of it is paid by Medicaid and grants, which keeps wages low.`,
  },
  "occ-21-1022": {
    slug: "healthcare-social-workers",
    why: `Hospital social work began at Massachusetts General Hospital in 1905 to address the social causes of illness. Medicare began paying clinical social workers directly in OBRA 1989. In hospitals they mostly arrange discharges, a job made bigger by Medicare's 1983 switch to fixed payments per stay, which rewards shorter stays.`,
  },
  "occ-11-9111": {
    slug: "health-services-managers",
    why: `Management grew with the complexity of getting paid. Medicare's 1983 switch to fixed payments per diagnosis made hospitals manage costs and coding, HIPAA (1996) and the HITECH Act (2009) added compliance and electronic-record requirements, and each insurer's contracts and rules need staff to manage them.`,
  },
  "occ-43-6013": {
    slug: "medical-secretaries",
    why: `Much of this work exists because the U.S. has many payers, each with its own eligibility checks, forms, and prior-authorization rules. HIPAA's administrative simplification rules (1996) standardized electronic claims but not the rules behind them, so offices still verify coverage, chase referrals, and request approvals payer by payer.`,
  },
  "occ-29-2072": {
    slug: "medical-coders",
    why: `Coding became a profession when payment started to depend on it. The AMA's CPT codes (1966) and ICD diagnosis codes became required for Medicare billing, and Medicare's 1983 switch to payment per diagnosis meant the codes chosen set the price. HIPAA (1996) made the code sets national standards, and the move to ICD-10 in 2015 multiplied the number of codes. Insurers hire coders too, to check providers' coding.`,
  },
  "occ-29-9021": {
    slug: "health-information-technologists",
    why: `The HITECH Act of 2009 paid hospitals and doctors to adopt electronic health records and penalized those that did not, which created this job category almost overnight. The 21st Century Cures Act (2016) added rules against blocking the sharing of health information.`,
  },
  "occ-13-1031": { slug: "claims-adjusters", why: CLAIMS },
  "occ-43-9041": { slug: "claims-processing-clerks", why: CLAIMS },

  // ------------------------------------------------ Industries
  "ind-621100": {
    slug: "payroll-physician-offices",
    why: `Physician practices shifted from solo and small partnerships to hospital-owned and private-equity-owned groups. Most states' "corporate practice of medicine" doctrine bars lay corporations from employing doctors directly, and the Anti-Kickback Statute (1972) and Stark Law (1989) govern who may own what. Medicare pays more for the same visit when a hospital owns the practice (a facility fee), which encouraged hospitals to buy practices.`,
  },
  "ind-621200": {
    slug: "payroll-dental-offices",
    why: `Dental offices are paid largely out of pocket and by separate dental insurance, because dentistry developed apart from medicine and Medicare excludes routine dental care. In recent decades dental service organizations, many backed by private equity, have bought practices and run their business side.`,
  },
  "ind-621300": {
    slug: "payroll-other-practitioner-offices",
    why: `State licensing laws created physical therapy, chiropractic, optometry, and similar professions, and "direct access" laws now let patients see many of them without a physician referral. Insurance coverage for each was added one at a time, often by state mandate.`,
  },
  "ind-621400": {
    slug: "payroll-outpatient-centers",
    why: `Medicare began paying ambulatory surgery centers in 1982 and moved hospital outpatient departments to a prospective payment system in 2000. Lower costs and patient preference moved surgery, imaging, dialysis, and urgent care out of hospitals into these centers.`,
  },
  "ind-621500": {
    slug: "payroll-laboratories",
    why: `CLIA (1988) set federal standards for every clinical lab, and Medicare pays labs on a fee schedule reset to market prices by the Protecting Access to Medicare Act of 2014. Testing consolidated into a few national companies, and COVID-19 testing briefly swelled the industry in 2020–2022.`,
  },
  "ind-621600": {
    slug: "payroll-home-health-agencies",
    why: `Medicare's home health benefit (1965), expanded in 1980 and cut back by the Balanced Budget Act of 1997, built this industry, and Medicaid's home- and community-based services (from 1981) added personal care. Aide wages are tied to Medicaid rates.`,
  },
  "ind-621900": {
    slug: "payroll-ambulance-and-other-ambulatory",
    why: `Modern ambulance services date to the Highway Safety Act of 1966 and the EMS Systems Act of 1973. The blood supply moved to volunteer donors under the National Blood Policy of 1974, after concerns over paid donors and hepatitis. Both are paid per transport or per unit, not for readiness.`,
  },
  "ind-622000": {
    slug: "payroll-hospitals",
    why: `${HOSPITAL} Hospitals are now the largest health care employer, and often the largest employer in their town.`,
  },
  "ind-623000": { slug: "payroll-nursing-and-residential-care", why: NURSING_HOME },
  "ind-456100": {
    slug: "payroll-pharmacies",
    why: `The Durham-Humphrey Amendment of 1951 made most medicines prescription-only, which channels them through pharmacies. Pharmacies are paid by pharmacy benefit managers, whose falling reimbursements have closed thousands of stores, especially independents and those in poorer neighborhoods.`,
  },
  "ind-325400": {
    slug: "payroll-drug-manufacturers",
    why: `The Kefauver-Harris Amendments of 1962, passed after the thalidomide disaster, required proof that a drug works before approval, making trials long and costly. Generic production moved overseas after the Hatch-Waxman Act (1984) set off price competition, and a tax credit for manufacturing in Puerto Rico (from 1976, phased out by 2006) shaped where U.S. plants were built.`,
  },
  "ind-339100": {
    slug: "payroll-device-makers",
    why: `The Medical Device Amendments of 1976 gave the FDA authority over devices, with the "510(k)" route letting a new device reach the market by showing it is similar to one already sold. The ACA's medical device tax took effect in 2013 and was repealed in 2019.`,
  },
  "ind-524114": {
    slug: "payroll-health-insurers",
    why: `Insurers employ staff to sell plans, build networks, review and pay claims, and manage prior authorization. Because the McCarran-Ferguson Act (1945) left regulation to the states and public programs contract with private plans (Medicare Advantage, Part D, Medicaid managed care), the U.S. has hundreds of insurers each doing this work separately. ${CLAIMS}`,
  },

  // ------------------------------------------------ Hospital cost structure
  "hosp-labor": {
    slug: "hospital-labor",
    why: `Hospitals run around the clock, so they are labor-intensive. Medicare's per-diagnosis payments (since 1983) are adjusted by a local wage index, so labor costs flow straight into prices. During the pandemic, hospitals paid agency "travel nurses" far above staff rates, which raised labor costs sharply in 2021–2022.`,
  },
  "hosp-supplies": {
    slug: "hospital-supplies",
    why: `Most hospitals buy supplies through group purchasing organizations, which a 1986 exception to the Anti-Kickback Statute lets collect fees from the suppliers they choose. Devices such as implants are sold under confidential contracts that make prices hard to compare, and the Medical Device Amendments of 1976 set how they reach the market.`,
  },
  "hosp-drugs": {
    slug: "hospital-drugs",
    why: `Hospitals buy drugs given during treatment and bill for them with a markup. The 340B program (Veterans Health Care Act of 1992) lets safety-net hospitals buy drugs at deep discounts while insurers pay them full price, a gap meant to fund care for low-income patients. Shortages of cheap generic injectables, whose makers earn little, add cost and risk.`,
  },
  "hosp-other": {
    slug: "hospital-other-costs",
    why: `This includes electronic health records (pushed by the HITECH Act of 2009), outside services, buildings, malpractice insurance, and depreciation. Medicare paid capital costs as a pass-through until 1991, and Medicare cost reports still require hospitals to report these costs.`,
  },

  // ------------------------------------------------ Drugs
  "pharma-rd": {
    slug: "drug-industry-research",
    why: `The Kefauver-Harris Amendments of 1962 required proof of effectiveness before approval, so new drugs must pass multi-phase clinical trials, most of which fail. Patents (now two decades from filing, under a 1994 trade law) and FDA exclusivity let companies recover those costs through high prices, and the Orphan Drug Act (1983) and the R&D tax credit (1981) add incentives. Because the U.S. pays the highest prices, it funds a large share of the world's drug research.`,
  },
  "pharma-payroll": {
    slug: "drug-manufacturing-payroll",
    why: `The Kefauver-Harris Amendments of 1962 and FDA manufacturing rules set how drugs are made and tested in the U.S. Generic production moved largely to India and China after the Hatch-Waxman Act (1984) set off price competition, so most U.S. drug-industry jobs are in branded drugs and research.`,
  },
  "insulin-cost": {
    slug: "insulin-production-cost",
    why: `Insulin's discoverers sold the patent to the University of Toronto in 1923 for a nominal sum so it would be affordable. A century later three manufacturers dominated the market, and list prices rose for years as rebates paid to pharmacy benefit managers grew. The Inflation Reduction Act of 2022 capped Medicare copays for insulin from 2023, and manufacturers cut list prices in 2023–2024 when the American Rescue Plan's Medicaid rebate change took effect.`,
  },
  "pbm-markups": { slug: "pbm-markups", why: PBM },
  "pharmacy-payroll": {
    slug: "pharmacy-payroll",
    why: `The Durham-Humphrey Amendment of 1951 created prescription-only drugs, which must be dispensed by a pharmacist. Pharmacies are reimbursed by pharmacy benefit managers, whose low and unpredictable payments have closed many stores. ${PBM}`,
  },
  "device-payroll": {
    slug: "medical-device-payroll",
    why: `The Medical Device Amendments of 1976 gave the FDA authority over devices and created the "510(k)" pathway that lets most new devices reach market by showing they resemble one already sold. The ACA's device tax (2013) was repealed in 2019.`,
  },

  // ------------------------------------------------ Insurance
  "ins-private-net": {
    slug: "private-insurer-overhead",
    why: `Private insurers charge premiums above what they pay for care to cover sales, claims processing, networks, taxes, and profit. The McCarran-Ferguson Act (1945) left their regulation to the states, so each state sets its own rules. The ACA's medical loss ratio rule (2011) caps overhead and profit as a share of premiums, which limits the share but not the dollar amount, so overhead grows with premiums.`,
  },
  "ins-ma-partd": {
    slug: "medicare-advantage-overhead",
    why: `Private plans entered Medicare through risk contracts in TEFRA (1982), Medicare+Choice (1997), and Medicare Advantage in the Medicare Modernization Act of 2003, which set plan payments above the cost of traditional Medicare to attract insurers. Payments are adjusted for how sick enrollees appear in diagnosis codes, which rewards coding more diagnoses, and the ACA added quality bonuses in 2012. Part D (2006) was built entirely on private plans.`,
  },
  "ins-mco": {
    slug: "medicaid-managed-care-overhead",
    why: `OBRA 1981 created "1915(b)" waivers letting states put Medicaid enrollees into managed care, and the Balanced Budget Act of 1997 let states require it without a waiver. States adopted it to make costs predictable, and most Medicaid enrollees are now in private plans paid a fixed amount per person, with overhead and profit inside that amount.`,
  },
  "ins-earnings": {
    slug: "insurer-profits",
    why: `Blue Cross and Blue Shield plans began as nonprofits; the Tax Reform Act of 1986 took away their federal tax exemption, and many converted to for-profit companies in the 1990s. Insurers have since bought pharmacy benefit managers, clinics, and physician groups. The ACA's medical loss ratio rule (2011) caps profit as a share of premiums, not in dollars, and profits earned by owned providers fall outside it.`,
  },
  "ins-brokers": {
    slug: "broker-commissions",
    why: `Insurance is sold through state-licensed agents and brokers paid commissions by insurers, a practice as old as the industry. The ACA (2010) funded "navigators" to help people enroll without commissions, and the Consolidated Appropriations Act, 2021 requires brokers to disclose their pay to employer plans.`,
  },
  "ins-premium-tax": {
    slug: "premium-taxes",
    why: `States have taxed insurance premiums since the 19th century, and the McCarran-Ferguson Act (1945) confirmed their power to do so. Employer plans that pay claims themselves are exempt from these taxes under ERISA (1974), one reason large employers self-insure.`,
  },
  "ins-carrier-payroll": {
    slug: "health-insurer-payroll",
    why: `Insurers employ staff to sell plans, build networks, process claims, and run prior authorization. Because the McCarran-Ferguson Act (1945) left regulation to the states, and Medicare and Medicaid contract much of their coverage to private plans (Medicare Advantage, Part D, Medicaid managed care), hundreds of insurers each do this work separately, and providers hire matching staff on their side.`,
  },
  "ins-idr": {
    slug: "surprise-billing-arbitration",
    why: `The No Surprises Act (in the Consolidated Appropriations Act, 2021, effective 2022) banned surprise out-of-network bills and created independent dispute resolution, a form of arbitration, to settle what insurers pay those providers. Far more disputes were filed than expected, many by private-equity-backed physician groups, and lawsuits by the Texas Medical Association over the rules for pricing added delay and cost.`,
  },

  // ------------------------------------------------ Administration, waste, liability, fraud
  "admin-total": {
    slug: "administrative-spending",
    why: `Administration is high because the U.S. has many payers with different rules, prices, and forms, so every provider bills each one separately and every payer checks each claim. HIPAA's administrative simplification rules (1996) standardized the electronic formats but not the rules. Studies since the 1990s have found U.S. administrative costs far above single-payer systems such as Canada's.`,
  },
  "admin-hospital-collection": {
    slug: "hospital-billing-costs",
    why: `Hospitals bill many insurers, each with its own coverage rules, prior-authorization requirements, and denials, and dispute many claims. A 2024 CMS rule requires Medicare Advantage, Medicaid, and marketplace plans to answer prior-authorization requests within set deadlines and support electronic requests from 2026–2027, but it does not cover most employer plans.`,
  },
  "waste-admin": {
    slug: "waste-administrative-complexity",
    why: `Berwick and Hackbarth (2012) sorted U.S. health care waste into six categories, and Shrank and colleagues (2019) updated the estimates. Administrative complexity is the largest: duplicated billing, credentialing, and prior authorization across many payers, the same fragmentation behind high administrative costs.`,
  },
  "waste-pricing": {
    slug: "waste-pricing-failure",
    why: `Unlike most rich countries, the U.S. does not set or cap prices for private insurance, so prices are negotiated and depend on market power; hospital and physician consolidation since the 1990s has raised them. Prices were secret until federal transparency rules took effect for hospitals (2021) and insurers (2022). This is one of the six waste categories from Berwick and Hackbarth (2012).`,
  },
  "waste-delivery": {
    slug: "waste-care-delivery",
    why: `The Institute of Medicine's "To Err Is Human" (1999) showed that preventable errors kill many patients each year. Since then Medicare has penalized hospitals for avoidable infections and complications (ACA programs from 2012–2015), but care that fails to follow best practice and causes harm still costs money.`,
  },
  "waste-lowvalue": {
    slug: "waste-low-value-care",
    why: `Fee-for-service payment, the U.S. default since before insurance, pays more for doing more, whether or not it helps. Fear of malpractice suits adds tests. The Choosing Wisely campaign (2012) asked specialty societies to name tests and treatments that rarely help.`,
  },
  "waste-fraud": {
    slug: "waste-fraud-and-abuse",
    why: `Fee-for-service programs pay claims first and check later ("pay and chase"), which invites fraud. The False Claims Act of 1863 lets whistleblowers sue on the government's behalf, and HIPAA (1996) created a dedicated federal health care fraud program; Medicare Fraud Strike Forces began in 2007.`,
  },
  "waste-coordination": {
    slug: "waste-care-coordination",
    why: `Care is split among independent hospitals, practices, and nursing homes with separate records and payments, so no one is paid to manage the hand-offs. The ACA (2010) added Medicare penalties for hospital readmissions (from 2012) and accountable care organizations to reward coordination.`,
  },
  "liability-total": {
    slug: "malpractice-liability",
    why: `Malpractice law is state tort law. Spikes in malpractice insurance premiums in the 1970s, 1980s, and early 2000s led many states to cap damages, starting with California's MICRA (1975). Since 1992 the federal government has covered malpractice claims against community health centers. Mello and colleagues (2010) estimated the full cost of the system, including defensive medicine.`,
  },
  "liability-defensive": {
    slug: "defensive-medicine",
    why: `Because malpractice suits depend on showing a doctor fell short of the standard of care, doctors order extra tests and referrals to protect themselves. State damage caps (from California's MICRA in 1975) reduced premiums but have done less to change ordering. Mello and colleagues (2010) estimated this cost.`,
  },
  "fraud-low": {
    slug: "fraud-low-estimate",
    why: `Health care fraud persists because programs pay most claims automatically and review a small share afterward. The False Claims Act (1863) and HIPAA's fraud program (1996) are the main tools. The National Health Care Anti-Fraud Association's range is widely cited but is an estimate; no one measures fraud directly.`,
  },
  "fraud-high": {
    slug: "fraud-high-estimate",
    why: `This is the top of the National Health Care Anti-Fraud Association's estimated range. Fraud persists because programs pay most claims automatically and review a small share afterward ("pay and chase"); the False Claims Act (1863) and HIPAA's fraud program (1996) are the main enforcement tools.`,
  },
  "improper-medicare": {
    slug: "medicare-improper-payments",
    why: `The Improper Payments Information Act of 2002 requires agencies to estimate payments that should not have been made, and Medicare measures them through its Comprehensive Error Rate Testing program. Most improper payments are missing or insufficient documentation, not proven fraud.`,
  },

  // ------------------------------------------------ Training
  "med-debt": {
    slug: "medical-school-debt",
    why: `Since the Flexner era, U.S. medical school has been a four-year graduate program after college, and tuition has risen for decades. The Grad PLUS loan program (from 2006) let students borrow the full cost of attendance from the government, and Public Service Loan Forgiveness (2007) offered relief for those working in nonprofits. The 2025 budget law ends Grad PLUS for new borrowers and caps federal borrowing for professional students.`,
  },
  "resident-salary": {
    slug: "resident-salary",
    why: `Residents are both trainees and the hospital's front-line doctors. Medicare has paid hospitals for residency training since 1965, but hospitals set resident pay, which stays low. The Supreme Court held in Mayo Foundation v. United States (2011) that residents are employees for payroll tax purposes, and resident unions have grown since 2020. Duty-hour limits followed the 1984 death of Libby Zion in a New York hospital.`,
  },
  "residency-slot-cost": {
    slug: "residency-position-cost",
    why: `Medicare funds most residency positions through direct and indirect graduate medical education payments (since 1965). The Balanced Budget Act of 1997 capped the number of residents each hospital can count, and the Consolidated Appropriations Act, 2021 added a limited number of new positions, the first increase in decades, so hospitals that train more pay the cost themselves.`,
  },

  // ------------------------------------------------ Long-term & end-of-life care
  "hospice-medicare": {
    slug: "medicare-hospice",
    why: `TEFRA (1982) created the Medicare hospice benefit, effective 1983, paying a daily rate for patients expected to live six months or less who give up curative treatment. The daily rate pays the same whether the patient needs much or little care, which drew for-profit companies; they now run most hospices, and longer stays among patients who are not near death have drawn scrutiny.`,
  },
  "aides-payroll": { slug: "home-care-aide-wages", why: AIDES },
  "nursing-home-payroll": { slug: "nursing-home-payroll", why: NURSING_HOME },

  // ------------------------------------------------ Margins & executive pay
  "hospital-margin": {
    slug: "hospital-margins",
    why: `Most hospitals are nonprofits, exempt from taxes in exchange for a "community benefit" (IRS, 1969), but they still need margins to fund buildings and equipment. Margins come mostly from private insurers, whose prices depend on market power; mergers since the 1990s have raised prices while many rural and safety-net hospitals lose money on Medicare and Medicaid patients.`,
  },
  "ceo-pay": {
    slug: "hospital-ceo-pay",
    why: `Tax law requires nonprofit executive pay to be "reasonable." The 1996 intermediate-sanctions law lets boards meet that test by comparing pay with similar organizations, which tends to ratchet pay upward as each board benchmarks against the others. Pay must be disclosed on IRS Form 990, and the Tax Cuts and Jobs Act of 2017 added an excise tax on nonprofit pay above a set threshold.`,
  },
  "physician-pay-gap": {
    slug: "specialist-pay-gap",
    why: `Medicare's relative value scale (1992) sets the relative worth of each service, and the AMA committee that recommends updates, the RUC (since 1991), has been dominated by specialists. Procedures were valued generously and rarely cut as they became faster, while office visits lagged. Medicare's 2021 increase in office-visit payments narrowed the gap somewhat.`,
  },

  // ------------------------------------------------ Capital, research & public health
  "cap-structures": { slug: "structures-and-equipment", why: CAPITAL },
  "cap-research": { slug: "noncommercial-research", why: RESEARCH },
  "cap-publichealth": { slug: "government-public-health", why: PUBLIC_HEALTH },
}
