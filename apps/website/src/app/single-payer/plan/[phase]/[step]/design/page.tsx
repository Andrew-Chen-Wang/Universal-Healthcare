import { designRoute } from "@website/lib/plan/views/design"

const route = designRoute("single-payer")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
