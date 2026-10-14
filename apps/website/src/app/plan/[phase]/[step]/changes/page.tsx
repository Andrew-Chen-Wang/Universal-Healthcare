import { changesRoute } from "@website/lib/plan/views/changes"

const route = changesRoute("hybrid")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
