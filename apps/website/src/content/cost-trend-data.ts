/**
 * Yearly history behind the "Why it is growing" section of each /costs page.
 * Generated from public data and transcribed as-is; do not edit by hand.
 *
 * - usdB series: CMS National Health Expenditure Accounts (NHE2024.csv for spending
 *   by service and the net cost of insurance; Tables 5-1 to 5-4 and 5 for who pays).
 * - thousands: BLS Current Employment Statistics, annual average of monthly jobs (via FRED).
 * - index: BLS Employment Cost Index (wages and salaries, annual average of quarters)
 *   and CPI-U (annual average of months), via FRED.
 *
 * `values[i]` is the value for `TREND_FIRST_YEAR + i`; null where the line did not exist.
 */

export const TREND_FIRST_YEAR = 2004
export const TREND_LAST_YEAR = 2024

export type TrendUnit = "usdB" | "thousands" | "index"

export type TrendSeries = {
  /** Shown above the chart. Null for lines whose label is the cost item's own label. */
  label: string | null
  unit: TrendUnit
  sourceIds: string[]
  values: (number | null)[]
}

export const TREND_SERIES = {
  "nhe-total": {
    label: "All national health spending",
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      1894.2, 2026.3, 2163.8, 2304.2, 2400.9, 2491.5, 2588.7, 2676.4, 2784.3, 2859.1, 3010.3,
      3177.2, 3324.1, 3464.2, 3637.7, 3805.1, 4204.3, 4376.9, 4586.6, 4925.3, 5278.6,
    ],
  },
  "phi-total": {
    label:
      "All private health insurance premiums (spending through private insurance plus its overhead)",
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      625.2, 670.1, 704.4, 747.1, 767.7, 792.4, 817.7, 849.2, 878.1, 880.2, 926.8, 981.9, 1037,
      1081.4, 1142.8, 1179.3, 1184.3, 1263.1, 1358.6, 1511.2, 1644.6,
    ],
  },
  "svc-hospital": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      565.3, 608.6, 651.2, 691.9, 721.6, 771, 808.8, 833.2, 878, 906.8, 940.5, 989, 1035.4, 1077.6,
      1120.6, 1189.3, 1259.5, 1319.1, 1357.5, 1501.1, 1634.7,
    ],
  },
  "svc-physicianClinical": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      383.6, 408.6, 431.6, 455.7, 479.6, 495.5, 510.1, 533.3, 554.4, 565.4, 595.3, 634.2, 673.2,
      706.1, 741.3, 781.7, 837.2, 904.8, 956.5, 1026.9, 1109.7,
    ],
  },
  "svc-dental": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      82.2, 87.2, 91.8, 97.7, 102.8, 103.4, 105.9, 108, 109.5, 111.4, 114.7, 119.9, 126.1, 131.1,
      137.8, 144.5, 140.4, 166.4, 166.8, 177.5, 189.2,
    ],
  },
  "svc-otherProfessional": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      50.2, 52.8, 55.3, 60.1, 64.5, 67, 69.9, 72.8, 76.4, 78, 82.4, 87.3, 92.1, 96.9, 104.9, 111.8,
      119.4, 136.7, 147.4, 166.9, 184.9,
    ],
  },
  "svc-homeHealth": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      44.6, 49.3, 52.1, 57.5, 62.2, 67, 70.5, 74.6, 78.1, 80.9, 85, 89.7, 94.3, 99.9, 106.6, 113.9,
      126.2, 127.4, 138.2, 153.6, 169.4,
    ],
  },
  "svc-otherNonDurable": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      32.7, 35.5, 38.7, 41.7, 45.3, 47.6, 51.8, 56.6, 61.2, 63.5, 66.2, 70.3, 73.3, 76.3, 80.7,
      85.1, 94.9, 106.3, 115.3, 123.3, 128.7,
    ],
  },
  "svc-prescriptionDrugs": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      195.6, 208.6, 228.1, 239.3, 244.3, 254.3, 253.4, 256.4, 257.1, 259.5, 290.9, 312.5, 313.8,
      316.2, 321.3, 333.8, 345.5, 365.9, 390.6, 432.9, 467,
    ],
  },
  "svc-durableEquipment": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      33.2, 36.2, 39.6, 43.3, 42.6, 41.4, 40, 40.6, 43.3, 44.7, 46.4, 48.8, 50.5, 52.5, 56.2, 60,
      60.2, 71.9, 77.4, 81.9, 86.4,
    ],
  },
  "svc-nursing": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      105.1, 111.4, 115.9, 124.9, 130.4, 135.2, 140.5, 145.3, 147.3, 148.7, 152.6, 156.8, 162,
      163.4, 166.9, 172.6, 192.3, 179, 188.6, 205, 219.9,
    ],
  },
  "svc-otherResidential": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      89.4, 95.4, 101.1, 108.1, 112.6, 122.1, 129, 133.1, 141.9, 149, 158.2, 173.5, 186, 198.2, 206,
      212.5, 230.1, 244.1, 267.9, 293.7, 320.5,
    ],
  },
  "svc-publicHealth": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      54.9, 57.3, 60.9, 66, 71.6, 74.2, 75.7, 74.4, 77.2, 81.5, 84.4, 85.5, 90.1, 95.9, 99.7, 108.6,
      243.4, 214, 208.8, 158, 157.6,
    ],
  },
  "svc-research": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      38.6, 40.3, 41.2, 42.6, 44.3, 45.3, 49.1, 49.6, 48.4, 46.7, 46, 46.4, 47.6, 50.9, 53.7, 56.5,
      60.2, 61.8, 65.4, 71.5, 70.4,
    ],
  },
  "svc-structures": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      78.4, 85.2, 91.8, 103.6, 112, 101.9, 103, 109.2, 114.8, 116.4, 113.9, 118.5, 121.4, 132.4,
      139, 141.8, 139.7, 156, 158.6, 162, 168.2,
    ],
  },
  "svc-governmentAdministration": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      27.3, 28.5, 29, 29.3, 29.4, 29.7, 30.2, 33, 34.3, 37.5, 41.8, 41.8, 44.1, 44.1, 46.5, 48.3,
      48.1, 51.3, 53.5, 57.7, 66.1,
    ],
  },
  "svc-netCostOfInsurance": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      113, 121.4, 135.6, 142.3, 137.7, 135.9, 150.8, 156.3, 162.4, 169.2, 192.2, 203.2, 214.3,
      222.7, 256.4, 244.6, 307.1, 272.3, 294.1, 313.4, 306,
    ],
  },
  "ins-private": {
    label: "Net cost of private health insurance",
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      80.4, 83.9, 87, 92.2, 89.9, 85.3, 94.5, 98.3, 99.4, 99.6, 110, 109.4, 115.1, 124.8, 147.1,
      135.8, 162.9, 142.7, 153.1, 169.1, 176.5,
    ],
  },
  "ins-medicare": {
    label: "Net cost of insurance, Medicare (mostly Medicare Advantage and Part D plans)",
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      4.7, 7, 14.7, 17.4, 18.1, 21.6, 23.4, 24.5, 25.8, 26.7, 28.4, 31.8, 36.5, 36.1, 41.4, 43.8,
      60.1, 47.2, 58.6, 60.6, 57.6,
    ],
  },
  "ins-medicaid": {
    label: "Net cost of insurance, Medicaid (mostly managed-care plans)",
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      5.9, 6.8, 7.5, 8.1, 9.1, 10.4, 13.9, 14.4, 15.7, 19.1, 28.7, 35.9, 36.8, 34.1, 37.7, 34.8,
      52.6, 55.3, 57.4, 56.1, 45.5,
    ],
  },
  "pay-bizEsi": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      327.9, 350.6, 358.7, 379.6, 381.7, 390.6, 391, 407.9, 423.7, 419.7, 433.4, 445.8, 471.7,
      494.5, 525.9, 548.1, 544.3, 587.3, 631.3, 708.7, 753.1,
    ],
  },
  "pay-bizHi": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      68.4, 72.3, 77, 81.2, 82.2, 77.2, 78.8, 82.6, 87.2, 90, 95, 100, 102.8, 107.8, 113.4, 118.7,
      120.6, 134.5, 144.7, 152.4, 159.2,
    ],
  },
  "pay-bizOther": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      44.5, 46.4, 46.7, 46.3, 44.9, 40.9, 41.2, 44.6, 47.6, 50.4, 53.1, 53.9, 54.8, 54.8, 55.5,
      54.9, 48.5, 51.3, 54.3, 55, 55.1,
    ],
  },
  "pay-hhEsi": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      152.9, 164.4, 177.5, 191.3, 207.9, 209.7, 215, 218.4, 228.9, 227.5, 222, 235.1, 245.6, 260.9,
      268.6, 283.9, 291.9, 300.1, 329, 357.8, 382.1,
    ],
  },
  "pay-hhDirect": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      35.1, 35.7, 34.9, 34.2, 34.8, 38.1, 41.7, 44.6, 47.1, 51.1, 63.7, 71.6, 73.6, 71.1, 74, 73.2,
      72.1, 71.8, 76.6, 80.6, 86.3,
    ],
  },
  "pay-hhPc": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      25.2, 25.8, 26.9, 25.8, 24.2, 25.9, 26.2, 25.5, 26.2, 28.5, 28.4, 29.5, 30.1, 34.3, 38.8,
      42.3, 43.5, 46.2, 41.4, 47.1, 55.3,
    ],
  },
  "pay-hhHi": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      91.5, 96.6, 103.7, 109.1, 112.2, 108.2, 111.8, 117.1, 125.5, 130.4, 140.3, 148.6, 154.7,
      162.6, 169.6, 176.1, 183.1, 198.6, 218.3, 230.9, 246.4,
    ],
  },
  "pay-hhSmi": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      24.7, 29.1, 36.6, 40.3, 44.2, 47.3, 49, 51.2, 53.4, 59.3, 62.9, 64.8, 70.1, 78.6, 90.1, 95.5,
      101.3, 106.3, 122.4, 123, 132.3,
    ],
  },
  "pay-hhOop": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      248.8, 265, 278.3, 294.2, 301.2, 298.2, 303.4, 312.3, 325.1, 333.8, 345.4, 360.7, 375.4,
      385.3, 403, 420.4, 412.3, 457.2, 491.9, 525.4, 556.6,
    ],
  },
  "pay-fedEsi": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      21.6, 23.1, 24.3, 24.6, 25.1, 26.8, 28.5, 30.8, 31.5, 32.4, 33.2, 33.9, 36.2, 37.5, 38.3,
      38.6, 39.8, 41, 41.5, 44.1, 46.7,
    ],
  },
  "pay-fedHi": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      3.3, 3.3, 3.4, 3.6, 3.8, 3.9, 4.1, 4.1, 4.1, 4.1, 4.1, 4.2, 4.2, 4.3, 4.5, 4.6, 4.9, 5, 5.2,
      5.5, 5.8,
    ],
  },
  "pay-fedMedicare": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      107.2, 120.2, 157.4, 170.2, 194.8, 231.3, 246.6, 256.5, 264.5, 270.2, 279.4, 293.6, 303.4,
      307.6, 328.5, 363.1, 375.3, 399.3, 404.1, 464.7, 509.6,
    ],
  },
  "pay-fedMedicaid": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      172.3, 177.5, 173.9, 185.6, 203.2, 247.5, 266.5, 247.3, 243.3, 256.7, 306, 342.8, 357.8,
      361.6, 372.5, 387.9, 460.6, 515.6, 572.1, 592.6, 596.7,
    ],
  },
  "pay-fedBuyIn": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      4, 4.9, 5.7, 6.1, 6.7, 7.7, 9.3, 8.9, 7.8, 8.3, 8.4, 8.5, 9.9, 11, 11.4, 11.8, 14.1, 14.9,
      17.4, 16.8, 16.1,
    ],
  },
  "pay-fedRds": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      0, 0, 3.8, 3.9, 3.8, 3.9, 3.9, 3.6, 3, 1.7, 1.4, 1.2, 1, 0.9, 0.8, 0.7, 0.6, 0.6, 0.6, 0.5,
      0.5,
    ],
  },
  "pay-fedPrograms": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      106.2, 111.8, 119.4, 125.1, 134.6, 147.3, 159.1, 166.7, 163.2, 162.9, 170, 180.7, 190.8,
      202.3, 213.7, 225.7, 243.2, 260.4, 275.4, 301.5, 306.8,
    ],
  },
  "pay-fedPublicHealth": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      9, 9.2, 9.5, 9.7, 9.9, 12, 14.2, 10.7, 10.8, 10.3, 10.8, 11.3, 11.8, 12.6, 12.1, 13.3, 139.3,
      101.1, 90.2, 37.9, 35.4,
    ],
  },
  "pay-fedOther": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      6.3, 6.4, 6.4, 6.7, 6.9, 7.3, 7.7, 9.6, 11.6, 13, 12.2, 12.6, 12.4, 12.2, 12.8, 14, 180.8,
      85.4, 33.6, 16.4, 17.9,
    ],
  },
  "pay-fedMarketplace": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17.6, 28.3, 33.4, 40.4, 50.7, 50.1, 53.2, 62.8, 68.9, 86.4,
      116.6,
    ],
  },
  "pay-slEsi": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      87.8, 96.3, 105.2, 113.5, 114.5, 121.3, 135, 138.7, 143.4, 147.3, 155.3, 164.5, 172.2, 171.9,
      179.4, 178.9, 176.1, 191.9, 201.5, 222.4, 246.8,
    ],
  },
  "pay-slHi": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      9.3, 9.8, 10.3, 10.9, 11.6, 11.8, 11.9, 11.9, 12.1, 12.4, 12.8, 13.3, 13.7, 14.2, 14.8, 15.4,
      15.8, 16.3, 17.3, 18.5, 19.9,
    ],
  },
  "pay-slMedicaid": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      118.4, 131.8, 132.7, 140.3, 141.2, 127.2, 130.9, 159.5, 179.5, 188.3, 192.3, 200.2, 207,
      217.2, 224.3, 227.4, 211.9, 222.5, 237.8, 281.1, 335,
    ],
  },
  "pay-slBuyIn": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      2.7, 3.5, 4, 4.4, 4.3, 3.5, 4, 5.3, 5.4, 5.7, 5.8, 5.9, 6.8, 7.5, 7.7, 7.9, 7.2, 7.5, 8.8,
      9.6, 10.7,
    ],
  },
  "pay-slPrograms": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      28.1, 30, 38.1, 42.8, 45.4, 45.7, 41.8, 45.3, 46.6, 48.5, 48.7, 49.1, 48.8, 51.3, 53.5, 56,
      59.5, 64.7, 69.5, 75.4, 84.2,
    ],
  },
  "pay-slPublicHealth": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      46, 48.1, 51.4, 56.3, 61.7, 62.2, 61.5, 63.7, 66.3, 71.1, 73.6, 74.1, 78.4, 83.3, 87.7, 95.3,
      104.2, 112.8, 118.6, 120.1, 122.1,
    ],
  },
  "pay-slOther": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      25.7, 26.8, 27.4, 28.4, 29.3, 30.3, 31.8, 31, 29.9, 30.1, 29.6, 31, 32.4, 32.6, 32.8, 34.5,
      35.3, 36.2, 37.3, 39.9, 40.9,
    ],
  },
  "pay-otherPrivate": {
    label: null,
    unit: "usdB",
    sourceIds: ["cms-nhe-2024"],
    values: [
      127.3, 137.6, 150.4, 170.1, 170.8, 165.7, 173.9, 178.5, 196.3, 205.3, 205, 212.2, 225.1, 246,
      253.5, 266.9, 265, 285.7, 277, 310.8, 340.5,
    ],
  },
  "emp-healthcare": {
    label: "Jobs in health care (all industries in the sector, thousands)",
    unit: "thousands",
    sourceIds: ["bls-ces-fred"],
    values: [
      14466.5, 14840.7, 15252.5, 15734.1, 16187.3, 16538.6, 16819.4, 17070.5, 17427.2, 17731,
      18021.2, 18555.1, 19070.3, 19520.8, 19920.4, 20419.8, 19793.3, 20064.3, 20577.8, 21540.7,
      22510.9,
    ],
  },
  "emp-physician-offices": {
    label: "Jobs in offices of physicians (thousands)",
    unit: "thousands",
    sourceIds: ["bls-ces-fred"],
    values: [
      2004.5, 2049.4, 2102.5, 2155, 2205, 2230.6, 2263.8, 2294.6, 2339.7, 2378.2, 2411.2, 2470.7,
      2526.3, 2581.4, 2615.7, 2673.3, 2631.3, 2731.8, 2812.7, 2902.2, 2959.7,
    ],
  },
  "emp-outpatient": {
    label: "Jobs in outpatient care centers (thousands)",
    unit: "thousands",
    sourceIds: ["bls-ces-fred"],
    values: [
      523.3, 547.4, 568.4, 589.5, 612.7, 627.8, 649.4, 670.1, 699, 731.1, 763.6, 805.8, 853, 897.1,
      931.4, 969.1, 970.1, 999.4, 1032.2, 1070.1, 1133.1,
    ],
  },
  "emp-home-health": {
    label: "Jobs in home health care services (thousands)",
    unit: "thousands",
    sourceIds: ["bls-ces-fred"],
    values: [
      776.6, 821.3, 865.8, 913.9, 961.2, 1026.7, 1084.5, 1140.6, 1185, 1230.1, 1262.1, 1314.2,
      1365.5, 1419.8, 1467.2, 1518.6, 1494.7, 1504.2, 1535.5, 1620.6, 1746.5,
    ],
  },
  "emp-hospitals": {
    label: "Jobs in hospitals (thousands)",
    unit: "thousands",
    sourceIds: ["bls-ces-fred"],
    values: [
      4254.7, 4314.9, 4392.6, 4483.8, 4595.2, 4645.1, 4677.9, 4721.5, 4779, 4785.8, 4786.8, 4895.6,
      5015, 5071.6, 5129.8, 5189.8, 5136.7, 5114.9, 5165.5, 5335.2, 5527.5,
    ],
  },
  "emp-nursing": {
    label: "Jobs in nursing and residential care facilities (thousands)",
    unit: "thousands",
    sourceIds: ["bls-ces-fred"],
    values: [
      2818.5, 2855.2, 2892.1, 2957.8, 3015.4, 3082.9, 3124.6, 3168.6, 3195.6, 3228.6, 3258.1, 3291,
      3318.9, 3347.4, 3356.2, 3374.4, 3214.6, 3023.7, 3010.3, 3163, 3314.5,
    ],
  },
  "eci-healthcare": {
    label: "Wage index, health care and social assistance workers (Employment Cost Index)",
    unit: "index",
    sourceIds: ["bls-eci-fred"],
    values: [
      96, 98.9, 102.3, 106.4, 109.7, 112.2, 113.9, 115.3, 117.5, 119.5, 121.5, 123.9, 126.4, 129.2,
      132.9, 136.4, 139.5, 144.7, 153.2, 161.6, 168.6,
    ],
  },
  "eci-hospitals": {
    label: "Wage index, hospital workers (Employment Cost Index)",
    unit: "index",
    sourceIds: ["bls-eci-fred"],
    values: [
      95.2, 98.7, 102.3, 105.9, 109.7, 112.6, 114.5, 116.3, 118.1, 120, 121.9, 124.2, 127.1, 130.1,
      133.1, 136.6, 140, 145.1, 153.4, 162, 169.2,
    ],
  },
  "eci-nursing": {
    label: "Wage index, nursing and residential care workers (Employment Cost Index)",
    unit: "index",
    sourceIds: ["bls-eci-fred"],
    values: [
      96.2, 98.8, 101.9, 105.3, 108.5, 110.9, 112.2, 113.3, 114.5, 115.7, 117.1, 119.5, 122.5, 126,
      129.9, 133.6, 137.9, 144.8, 155.7, 164.9, 172,
    ],
  },
  "eci-private": {
    label: "Wage index, all private-industry workers (Employment Cost Index)",
    unit: "index",
    sourceIds: ["bls-eci-fred"],
    values: [
      96.8, 99.2, 102, 105.5, 108.6, 110.3, 112.1, 114, 116, 118.2, 120.6, 123.3, 126.2, 129.5,
      133.4, 137.4, 141.4, 147.1, 154.8, 161.9, 168.3,
    ],
  },
  cpi: {
    label: "Consumer prices, all items (CPI-U)",
    unit: "index",
    sourceIds: ["bls-cpi-fred"],
    values: [
      188.9, 195.3, 201.6, 207.3, 215.3, 214.6, 218.1, 224.9, 229.6, 233, 236.7, 237, 240, 245.1,
      251.1, 255.7, 258.9, 271, 292.6, 304.7, 313.7,
    ],
  },
  "cpi-medical": {
    label: "Consumer prices, medical care (CPI-U)",
    unit: "index",
    sourceIds: ["bls-cpi-fred"],
    values: [
      310.1, 323.2, 336.2, 351.1, 364.1, 375.6, 388.4, 400.2, 414.9, 425.1, 435.3, 446.8, 463.7,
      475.3, 484.7, 498.4, 518.9, 525.3, 546.6, 549.1, 563.9,
    ],
  },
} satisfies Record<string, TrendSeries>

export type TrendSeriesId = keyof typeof TREND_SERIES
