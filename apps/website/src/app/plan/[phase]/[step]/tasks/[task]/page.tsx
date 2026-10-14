import { taskRoute } from "@website/lib/plan/views/task"

const route = taskRoute("hybrid")
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
