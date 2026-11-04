"""
Regenerates src/content/cost-trend-data.ts (the yearly series behind each /costs page's
"How fast it is growing, and why" section).

Usage, from apps/website:
  mkdir -p /tmp/ct/nhe /tmp/ct/fred
  # CMS NHE historical data (https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data/historical)
  curl -o /tmp/ct/nhe/a.zip https://www.cms.gov/files/zip/national-health-expenditures-type-service-source-funds-cy-1960-2024.zip
  curl -o /tmp/ct/nhe/t.zip https://www.cms.gov/files/zip/nhe-tables.zip
  unzip /tmp/ct/nhe/a.zip -d /tmp/ct/nhe/national-health-expenditures-type-service-source-funds-cy-1960-2024
  unzip /tmp/ct/nhe/t.zip -d /tmp/ct/nhe/nhe-tables
  # FRED series used below, e.g.
  for id in CES6562000001 CES6562110001 CES6562140001 CES6562160001 CES6562200001 CES6562300001 \
            CIU2026200000000I CIU2026220000000I CIU2026230000000I ECIWAG CPIAUCSL CPIMEDSL; do
    curl -o /tmp/ct/fred/$id.csv "https://fred.stlouisfed.org/graph/fredgraph.csv?id=$id"; done
  python3 scripts/gen-cost-trends.py /tmp/ct src/content/cost-trend-data.ts
  pnpm run format

When CMS publishes a new year, update Y1, the file names, and the row numbers (the
script asserts each row's label, so a shifted row fails loudly).
"""
import csv, openpyxl, re, json, sys, statistics
S=sys.argv[1]; OUT=sys.argv[2]; Y0, Y1 = 2004, 2024
YEARS=list(range(Y0,Y1+1))
rows=list(csv.reader(open(f'{S}/nhe/national-health-expenditures-type-service-source-funds-cy-1960-2024/NHE2024.csv',encoding='latin-1')))
hdr=rows[1]
def nhe(n, label):
    r=rows[n]; assert r[0].strip().startswith(label), (n, r[0], label)
    return [round(float(r[hdr.index(str(y))].replace(',',''))/1000,1) for y in YEARS]
def add(a,b): return [round(x+y,1) for x,y in zip(a,b)]
series={}
def put(id,label,unit,src,vals,note=None):
    series[id]=dict(label=label,unit=unit,sourceIds=src,values=vals,**({"note":note} if note else {}))
NH=["cms-nhe-2024"]
put("nhe-total","All national health spending","usdB",NH,nhe(2,"Total National Health"))
put("phi-total","All private health insurance premiums (spending through private insurance plus its overhead)","usdB",NH,nhe(5,"Private Health Insurance"))
svc={"hospital":(102,"Total Hospital"),"physicianClinical":(132,"Total Physician and Clinical"),"dental":(162,"Total Dental"),"otherProfessional":(192,"Total Other Professional"),"homeHealth":(222,"Total Home Health"),"otherNonDurable":(252,"Other Non-Durable"),"prescriptionDrugs":(282,"Total Prescription Drug"),"durableEquipment":(312,"Total Durable"),"nursing":(342,"Total Nursing"),"otherResidential":(372,"\"Total Other Health" if False else "Total Other Health"),"publicHealth":(522,"Public Health Activity"),"research":(525,"Research"),"structures":(529,"Total Structures")}
from_baseline={}
for k,(n,l) in svc.items(): put(f"svc-{k}",None,"usdB",NH,nhe(n,l))
put("svc-governmentAdministration",None,"usdB",NH,add(nhe(432,"State and Local  Administration"),nhe(462,"Federal Administration")))
put("svc-netCostOfInsurance",None,"usdB",NH,nhe(492,"Non-Medical Insurance"))
put("ins-private","Net cost of private health insurance","usdB",NH,nhe(495,"Private Health Insurance"))
put("ins-medicare","Net cost of insurance, Medicare (mostly Medicare Advantage and Part D plans)","usdB",NH,nhe(496,"Medicare"))
put("ins-medicaid","Net cost of insurance, Medicaid (mostly managed-care plans)","usdB",NH,nhe(497,"Medicaid"))
# sponsor tables
T=f"{S}/nhe/nhe-tables/"
def tab(f):
    rs=[r for r in openpyxl.load_workbook(T+f,data_only=True).active.iter_rows(values_only=True)]
    y=list(rs[1]); return rs, y
spon={"Table 05-1 Private Business Sponsor Expenditures.xlsx":{4:"bizEsi",5:"bizHi",6:"bizOther"},
 "Table 05-2 Household Sponsor Expenditures.xlsx":{4:"hhEsi",5:"hhDirect",6:"hhPc",7:"hhHi",8:"hhSmi",9:"hhOop"},
 "Table 05-3 Federal Government Sponsor Expenditures.xlsx":{4:"fedEsi",5:"fedHi",6:"fedMedicare",7:"fedMedicaid",8:"fedBuyIn",9:"fedRds",11:"fedPrograms",12:"fedPublicHealth",13:"fedOther",14:"fedMarketplace"},
 "Table 05-4 State and Local Government Sponsor Expenditures.xlsx":{4:"slEsi",5:"slHi",6:"slMedicaid",7:"slBuyIn",9:"slPrograms",10:"slPublicHealth",11:"slOther"},
 "Table 05 National Health Expenditures by Type of Sponsor.xlsx":{7:"otherPrivate"}}
for f,m in spon.items():
    rs,y=tab(f)
    for n,id in m.items():
        vals=[rs[n][y.index(yr)] for yr in YEARS]
        vals=[None if v in (None,'-','—') or isinstance(v,str) else round(float(v),1) for v in vals]
        put(f"pay-{id}",None,"usdB",NH,vals)
# FRED annual averages
def fred(id):
    d={}
    for r in list(csv.reader(open(f'{S}/fred/{id}.csv')))[1:]:
        if r[1] in ('','.'): continue
        y=int(r[0][:4]); d.setdefault(y,[]).append(float(r[1]))
    return [round(statistics.mean(d[y]),1) if y in d and (len(d[y]) in (4,12)) else None for y in YEARS]
CES=["bls-ces-fred"]; ECI=["bls-eci-fred"]
put("emp-healthcare","Jobs in health care (all industries in the sector, thousands)","thousands",CES,fred("CES6562000001"))
put("emp-physician-offices","Jobs in offices of physicians (thousands)","thousands",CES,fred("CES6562110001"))
put("emp-outpatient","Jobs in outpatient care centers (thousands)","thousands",CES,fred("CES6562140001"))
put("emp-home-health","Jobs in home health care services (thousands)","thousands",CES,fred("CES6562160001"))
put("emp-hospitals","Jobs in hospitals (thousands)","thousands",CES,fred("CES6562200001"))
put("emp-nursing","Jobs in nursing and residential care facilities (thousands)","thousands",CES,fred("CES6562300001"))
put("eci-healthcare","Wage index, health care and social assistance workers (Employment Cost Index)","index",ECI,fred("CIU2026200000000I"))
put("eci-hospitals","Wage index, hospital workers (Employment Cost Index)","index",ECI,fred("CIU2026220000000I"))
put("eci-nursing","Wage index, nursing and residential care workers (Employment Cost Index)","index",ECI,fred("CIU2026230000000I"))
put("eci-private","Wage index, all private-industry workers (Employment Cost Index)","index",ECI,fred("ECIWAG"))
put("cpi","Consumer prices, all items (CPI-U)","index",["bls-cpi-fred"],fred("CPIAUCSL"))
put("cpi-medical","Consumer prices, medical care (CPI-U)","index",["bls-cpi-fred"],fred("CPIMEDSL"))

head = open(OUT).read().split("export const TREND_SERIES = {")[0]
out = [head + "export const TREND_SERIES = {"]
for k, v in series.items():
    vals = ", ".join("null" if x is None else (str(int(x)) if float(x).is_integer() else str(x)) for x in v["values"])
    lab = "null" if v["label"] is None else json.dumps(v["label"])
    out.append(f'  "{k}": {{\n    label: {lab},\n    unit: "{v["unit"]}",\n    sourceIds: {json.dumps(v["sourceIds"])},\n    values: [{vals}],\n  }},')
out.append("} satisfies Record<string, TrendSeries>\n\nexport type TrendSeriesId = keyof typeof TREND_SERIES\n")
open(OUT, "w").write("\n".join(out))
print(f"wrote {len(series)} series to {OUT}")
