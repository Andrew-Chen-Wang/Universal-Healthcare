import { phaseRoute } from "@website/lib/plan/views/phase"

const route = phaseRoute("single-payer")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
