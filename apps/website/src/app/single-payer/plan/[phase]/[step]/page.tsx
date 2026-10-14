import { stepOverviewRoute } from "@website/lib/plan/views/step-overview"

const route = stepOverviewRoute("single-payer")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
