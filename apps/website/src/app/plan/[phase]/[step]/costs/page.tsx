import { costsRoute } from "@website/lib/plan/views/costs"

const route = costsRoute("hybrid")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
