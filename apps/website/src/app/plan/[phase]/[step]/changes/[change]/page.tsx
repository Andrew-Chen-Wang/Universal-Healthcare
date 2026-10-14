import { changeRoute } from "@website/lib/plan/views/change"

const route = changeRoute("hybrid")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
