import { costRoute } from "@website/lib/plan/views/cost"

const route = costRoute("single-payer")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
