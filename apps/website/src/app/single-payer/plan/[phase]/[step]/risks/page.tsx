import { risksRoute } from "@website/lib/plan/views/risks"

const route = risksRoute("single-payer")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
