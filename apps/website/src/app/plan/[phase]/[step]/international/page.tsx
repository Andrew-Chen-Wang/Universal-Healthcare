import { internationalRoute } from "@website/lib/plan/views/international"

const route = internationalRoute("hybrid")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
