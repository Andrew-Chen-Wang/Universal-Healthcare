import { changesRoute } from "@website/lib/plan/views/changes"

const route = changesRoute("single-payer")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
