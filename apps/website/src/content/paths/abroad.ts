/**
 * International comparisons for paths whose own precedents are American, so
 * every policy can be compared with other countries. Each entry adds sourced
 * precedents from named countries, or a `noPeer` note when no peer country has
 * a comparable policy (usually because the problem it fixes doesn't arise
 * there), saying how those countries avoid the problem.
 *
 * Merged into each path's precedents in paths/index.ts; the build fails if a
 * path has neither a named country nor a note.
 */
import type { Precedent } from "./types"

export type Abroad = { precedents?: Precedent[]; noPeer?: string }

export const ABROAD: Record<string, Abroad> = {
  // ---- Coverage ----
  "mandate-subsidies": {
    precedents: [
      {
        place: "Switzerland",
        note: "Basic insurance is compulsory for every resident, and about a quarter of the population gets a premium reduction from the federal government and cantons. Premiums are flat per person, so they weigh on middle incomes; voters rejected capping them at 10% of income in 2024.",
        sourceIds: ["ch-premium-relief"],
      },
      {
        place: "Netherlands",
        note: "Everyone must buy statutory insurance from insurers that must accept them; lower-income households get a health care allowance toward the premium.",
        sourceIds: ["cmwf-netherlands-2026"],
      },
    ],
  },
  "churn-continuous": {
    precedents: [
      {
        place: "Germany",
        note: "Coverage doesn't depend on re-proving income: people stay in their sickness fund through job loss, with contributions for the unemployed paid by the state.",
        sourceIds: ["cmwf-germany-2026"],
      },
    ],
  },
  "joblock-portable-esi": {
    precedents: [
      {
        place: "Germany",
        note: "Workers choose their own sickness fund, and the employer pays its share of the contribution to whichever fund they pick, so changing jobs doesn't change coverage.",
        sourceIds: ["cmwf-germany-2026"],
      },
    ],
  },
  "underins-value-based": {
    precedents: [
      {
        place: "France",
        note: "The long-term illness scheme (ALD) covers care for listed chronic conditions at 100%; about 15 million people, 22% of the insured, were in it in 2025, while other care carries copays.",
        sourceIds: ["fr-ald-2025"],
      },
    ],
  },
  "networks-adequacy": {
    precedents: [
      {
        place: "Germany",
        note: "Statutory patients can see any contracted doctor, and since 2019 the 116117 service must find a patient with a referral a specialist appointment within four weeks.",
        sourceIds: ["de-tsvg-116117"],
      },
    ],
  },
  "immigrants-lawful-only": {
    precedents: [
      {
        place: "United Kingdom",
        note: "People not entitled to free care, including undocumented migrants, are billed 150% of the NHS tariff for hospital care, upfront unless it's urgent; primary care, A&E, and many infectious diseases are exempt. Public health doctors report people avoiding care as a result.",
        sourceIds: ["fph-nhs-charging-2018"],
      },
      {
        place: "France",
        note: "The opposite choice: State Medical Aid covers undocumented residents after three months, subject to an income limit, for about 411,000 people in 2022.",
        sourceIds: ["fr-ame"],
      },
    ],
  },
  "territories-full": {
    precedents: [
      {
        place: "France",
        note: "Residents of the overseas departments (Guadeloupe, Martinique, Guyane, Réunion, Mayotte) are in national health insurance, run locally by general social security funds within the Assurance Maladie network.",
        sourceIds: ["fr-cgss-network"],
      },
    ],
  },
  "territories-medicaid-parity": {
    precedents: [
      {
        place: "Netherlands",
        note: "Bonaire, Sint Eustatius, and Saba have their own public insurance scheme, separate from the mainland's insurers but run for the national health ministry, with compulsory coverage for all residents since 2011.",
        sourceIds: ["nl-bes-insurance"],
      },
    ],
  },
  "territories-capped-increase": {
    noPeer:
      "We found no peer country that caps health funding for an overseas territory below what its residents would get at home. France covers its overseas departments in national insurance, and the Netherlands runs a separate scheme for its Caribbean islands (see the other territory paths).",
  },
  // ---- Affordability ----
  "debt-cancel": {
    noPeer:
      "Peer countries have little medical debt to buy: universal coverage with low or capped cost sharing means hospitals rarely send people to collections over care.",
  },
  "debt-credit-rules": {
    noPeer:
      "Medical debt on credit reports is a U.S. problem. In countries where cost sharing is capped (Germany caps copays at 2% of income), medical bills rarely go to collections.",
  },
  "opacity-disclosure": {
    noPeer:
      "Peer countries rarely need disclosure rules because prices are public by design: Germany, Japan, and France publish national fee schedules, so the base price of a visit or procedure is known in advance.",
  },
  "surprise-rate-default": {
    precedents: [
      {
        place: "Germany",
        note: "Even private bills follow a federal fee schedule: doctors may charge 1 to 3.5 times the base fee, need a written reason above 2.3 times, and need a signed agreement before treatment to go higher, so a bill can't arrive at an unregulated price.",
        sourceIds: ["de-goae-fee-range"],
      },
    ],
  },
  // ---- Insurers ----
  "denials-rules": {
    precedents: [
      {
        place: "Netherlands",
        note: "Patients who disagree with their insurer can go to an independent body (SKGZ): its ombudsman mediates free of charge, and its disputes committee issues binding rulings.",
        sourceIds: ["nl-skgz-complaints"],
      },
    ],
  },
  "pa-gold-card": {
    precedents: [
      {
        place: "Australia",
        note: "Since 2007, many drugs that need approval are 'streamlined': the prescriber writes a code showing the patient meets the criteria instead of calling for approval, with phone or online approval kept for the rest.",
        sourceIds: ["au-pbs-streamlined-2007"],
      },
    ],
  },
  "pa-eliminate": {
    precedents: [
      {
        place: "Australia",
        note: "Prior approval is limited to drugs listed as 'authority required', and since 2007 many of those use a written code on the prescription instead of a call for approval.",
        sourceIds: ["au-pbs-streamlined-2007"],
      },
    ],
  },
  "ma-fold": {
    precedents: [
      {
        place: "Germany",
        note: "There's no separate program for older people: retirees stay in their sickness fund, with pensions paying part of the contribution.",
        sourceIds: ["cmwf-germany-2026"],
      },
    ],
  },
  "ma-reform": {
    precedents: [
      {
        place: "Germany",
        note: "Since 2020 a 'manipulation brake' lets the federal insurance office exclude diagnosis groups whose counts grow far faster than average from risk-adjustment payments, with penalties for funds that broke the rules.",
        sourceIds: ["de-rsa-manipulation-brake"],
      },
    ],
  },
  "overhead-public": {
    precedents: [
      {
        place: "Taiwan",
        note: "One public insurer since 1995, with administrative costs under 2% of spending and a smart card for claims.",
        sourceIds: ["taiwan-nhi"],
      },
    ],
  },
  "pbm-regulate": {
    precedents: [
      {
        place: "Germany",
        note: "There are no pharmacy benefit managers: pharmacies get a fixed fee per pack plus 3% of the purchase price, set by federal regulation, so most of their pay doesn't depend on a drug's price and there are no rebates to hide.",
        sourceIds: ["de-ampreisv-3"],
      },
    ],
  },
  // ---- Prices and payment ----
  "prices-cap": {
    precedents: [
      {
        place: "Germany",
        note: "Private insurance pays more than statutory insurance, but within a federal fee schedule: doctors may bill private patients at most 3.5 times the base fee without a signed agreement, and 2.3 times without a written reason.",
        sourceIds: ["de-goae-fee-range"],
      },
    ],
  },
  "prices-competition": {
    precedents: [
      {
        place: "Netherlands",
        note: "Competing insurers negotiate prices and volumes with hospitals for the standard benefit, under competition law; premiums still rose faster than inflation from 2020 to 2025.",
        sourceIds: ["cmwf-netherlands-2026"],
      },
    ],
  },
  "consolidation-antitrust": {
    precedents: [
      {
        place: "United Kingdom",
        note: "In 2013 the competition authority blocked a merger of two NHS hospital trusts, finding the patient benefits too small to outweigh lost competition; the trusts' later plan was cleared.",
        sourceIds: ["uk-cma-poole-bournemouth"],
      },
    ],
  },
  "consolidation-rates": {
    precedents: [
      {
        place: "Germany",
        note: "Since 2010 every general hospital in a state is paid the same base rate per case, so a bigger or merged hospital can't charge more for the same treatment.",
        sourceIds: ["de-landesbasisfallwert"],
      },
    ],
  },
  "pe-limit": {
    precedents: [
      {
        place: "United Kingdom",
        note: "A cautionary case: Southern Cross, the largest care-home operator, sold its homes and leased them back on rising rents; when fees stopped rising it couldn't pay rent and debt, and it was liquidated in 2011. Limits on sale-leasebacks target this model.",
        sourceIds: ["southwark-southern-cross-2012"],
      },
    ],
  },
  "pe-rates": {
    precedents: [
      {
        place: "Germany",
        note: "Uniform state base rates for hospitals mean an acquired hospital is paid the same as any other for the same case, leaving no price markup for a buyer to capture.",
        sourceIds: ["de-landesbasisfallwert"],
      },
    ],
  },
  "facility-site-neutral": {
    precedents: [
      {
        place: "Germany",
        note: "Since 2024, selected procedures are paid one 'sector-equal' fee whether a hospital or an office-based practice does them.",
        sourceIds: ["de-hybrid-drg"],
      },
    ],
  },
  "facility-ban": {
    noPeer:
      "Separate facility fees for office-type visits are a U.S. billing feature. Peer countries with national fee schedules (Germany, Japan, France) pay one fee for an office visit whoever owns the practice, and Germany now pays some procedures the same in or out of hospital.",
  },
  "exec-community-benefit": {
    noPeer:
      "Peer countries don't trade tax exemptions for charity care, because universal coverage leaves little charity care to give. Nonprofit and public hospitals in Germany, Canada, and the Netherlands are paid the same rates as others and regulated directly.",
  },
  // ---- Drugs and supply ----
  "drugs-public-manufacture": {
    precedents: [
      {
        place: "Thailand",
        note: "The state-owned Government Pharmaceutical Organization makes generic HIV drugs, including a three-drug pill used to scale up treatment from 2003 and efavirenz under a 2006 compulsory license that cut its price to about $20 a month.",
        sourceIds: ["th-gpo-efavirenz"],
      },
    ],
  },
  "patents-reform": {
    precedents: [
      {
        place: "India",
        note: "Patent law bars patents on new forms of a known drug unless they significantly improve efficacy; in 2013 the Supreme Court used it to refuse a patent on a new crystal form of the cancer drug imatinib, keeping generics on the market.",
        sourceIds: ["in-novartis-3d-2013"],
      },
    ],
  },
  "rd-public-fund": {
    precedents: [
      {
        place: "United Kingdom",
        note: "The health department's research arm, NIHR, spent £1.3 billion in 2022/23, including a network that runs clinical trials inside the NHS.",
        sourceIds: ["nihr-annual-spend"],
      },
    ],
  },
  "shortages-pay-reliability": {
    precedents: [
      {
        place: "Germany",
        note: "After children's fever-syrup shortages, a 2023 law freed children's medicines from reference prices and discount contracts so makers could charge more, and required makers of discount-contract generics to hold three months' stock.",
        sourceIds: ["de-albvvg"],
      },
    ],
  },
  "shortages-stockpile": {
    precedents: [
      {
        place: "Finland",
        note: "Drug companies and importers must keep stocks in the country, from about three months of normal use for asthma medicine to ten months for antibiotics, with part of the cost compensated by the national emergency supply agency.",
        sourceIds: ["fi-obligatory-stockpiling"],
      },
    ],
  },
  "pharmacy-mail-telehealth": {
    precedents: [
      {
        place: "Canada (Ontario)",
        note: "Remote dispensing locations let drugs be dispensed under a pharmacist supervising by two-way video rather than in person, for communities without a pharmacy.",
        sourceIds: ["on-remote-dispensing"],
      },
    ],
  },
  // ---- Rural care ----
  "rural-global-budget": {
    precedents: [
      {
        place: "Germany",
        note: "The 2024 hospital reform pays 60% of hospitals' former case-based revenue as standby payments for the services they're assigned, so a hospital's income depends less on how many patients it treats.",
        sourceIds: ["de-khvvg"],
      },
    ],
  },
  "rural-convert": {
    precedents: [
      {
        place: "Germany",
        note: "The 2024 hospital reform lets small hospitals become 'sector-spanning' facilities that offer basic inpatient beds alongside outpatient and nursing care, instead of closing.",
        sourceIds: ["de-khvvg"],
      },
    ],
  },
  "shortage-pay": {
    precedents: [
      {
        place: "Canada (Ontario)",
        note: "Doctors who set up full-time practice in eligible northern and rural communities get grants of about CAD 85,000 to 125,000, more for more remote places.",
        sourceIds: ["on-nrrri"],
      },
    ],
  },
  "shortage-telehealth": {
    precedents: [
      {
        place: "Australia",
        note: "Medicare began paying GP video consultations for patients in remote areas in 2019, then widened telehealth to everyone during COVID-19.",
        sourceIds: ["au-mbs-rural-telehealth"],
      },
    ],
  },
  "transport-fund": {
    precedents: [
      {
        place: "Norway",
        note: "A national patient travel service, run by the regional health authorities, pays travel to and from publicly funded treatment, arranging the ride or reimbursing it with a small user fee.",
        sourceIds: ["no-pasientreiser"],
      },
    ],
  },
  // ---- Workforce ----
  "phys-residency": {
    precedents: [
      {
        place: "Germany",
        note: "Eleven states reserve medical school places for students who commit to practise in underserved rural areas after training, typically for ten years, with a large repayment if they leave early.",
        sourceIds: ["de-landarztquote"],
      },
    ],
  },
  "phys-foreign": {
    precedents: [
      {
        place: "Canada (Ontario)",
        note: "Since 2023, experienced internationally trained family doctors can be licensed after a 12-week supervised assessment in practice instead of repeating residency, in return for three years' service in the province.",
        sourceIds: ["on-practice-ready"],
      },
    ],
  },
  "nurse-staffing-ratios": {
    precedents: [
      {
        place: "Australia (Queensland)",
        note: "Queensland legislated nurse-to-patient ratios for adult medical and surgical wards in 27 public hospitals in 2016, and extended them to acute mental health wards in 2019.",
        sourceIds: ["qld-nurse-ratios"],
      },
    ],
  },
  "nurse-staffing-committees": {
    precedents: [
      {
        place: "United Kingdom (Wales, Scotland)",
        note: "Wales (2016) requires health boards to calculate nurse staffing for each covered ward with a set method, take steps to keep to it, and tell patients; Scotland's staffing law took effect in 2024. Neither sets fixed ratios.",
        sourceIds: ["wales-nurse-staffing-act"],
      },
    ],
  },
  "nurse-pipeline": {
    precedents: [
      {
        place: "England",
        note: "Since 2020, nursing and midwifery students get a non-repayable grant of at least £5,000 a year, with extra for shortage specialties.",
        sourceIds: ["en-learning-support-fund"],
      },
    ],
  },
  "burnout-scribes": {
    precedents: [
      {
        place: "England",
        note: "NHS England issued national guidance and a supplier registry for AI scribes in 2025: clinicians must check every note before it enters the record.",
        sourceIds: ["en-ambient-scribing-guidance"],
      },
    ],
  },
  "scope-expand": {
    precedents: [
      {
        place: "England",
        note: "Since 2024, community pharmacists can prescribe for seven common conditions, including sinusitis, sore throat, and urinary infections in women, without a GP visit.",
        sourceIds: ["en-pharmacy-first"],
      },
    ],
  },
  "scope-team": {
    precedents: [
      {
        place: "England",
        note: "A national scheme pays for pharmacists, physiotherapists, paramedics, and care coordinators to work in GP teams; about 29,000 were hired from 2019 to 2023.",
        sourceIds: ["en-arrs-recruitment"],
      },
    ],
  },
  "scopeq-monitor": {
    precedents: [
      {
        place: "United Kingdom",
        note: "After safety concerns about physician associates, an independent review in 2025 recommended renaming the role, tighter supervision, and limits on what they do; the government accepted every recommendation.",
        sourceIds: ["uk-leng-review"],
      },
    ],
  },
  "scopeq-transition-period": {
    precedents: [
      {
        place: "United Kingdom",
        note: "The 2025 review of physician associates recommended two years in hospital practice before working in general practice.",
        sourceIds: ["uk-leng-review"],
      },
    ],
  },
  "staffing-phase": {
    precedents: [
      {
        place: "Australia (Queensland)",
        note: "Ratios started in 2016 for adult medical and surgical wards and were extended to acute mental health wards in 2019 after a pilot.",
        sourceIds: ["qld-nurse-ratios"],
      },
    ],
  },
  "staffing-waivers": {
    precedents: [
      {
        place: "Australia",
        note: "When nursing homes had to have a registered nurse on site around the clock from 2023, small rural and remote homes could apply for temporary exemptions.",
        sourceIds: ["au-care-minutes"],
      },
    ],
  },
  "billing-transition": {
    precedents: [
      {
        place: "Denmark",
        note: "'Flexicurity' pairs easy layoffs with generous, time-limited unemployment benefits and required retraining and job matching, so displaced workers are moved into new jobs rather than protected in old ones.",
        sourceIds: ["dk-flexicurity"],
      },
    ],
  },
  "billing-redeploy": {
    noPeer:
      "No peer country has had to absorb a billing workforce this size: their systems never built one. Denmark's approach to displaced workers in general, benefits plus required retraining, is compared under the worker transition program.",
  },
}
