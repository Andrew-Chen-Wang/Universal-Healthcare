import { designRoute } from "@website/lib/plan/views/design"

const route = designRoute("hybrid")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
