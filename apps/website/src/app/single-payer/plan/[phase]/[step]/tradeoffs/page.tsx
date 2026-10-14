import { tradeoffsRoute } from "@website/lib/plan/views/tradeoffs"

const route = tradeoffsRoute("single-payer")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
