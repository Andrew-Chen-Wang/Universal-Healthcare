import { taskRoute } from "@website/lib/plan/views/task"

const route = taskRoute("single-payer")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
